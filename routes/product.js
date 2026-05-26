const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. ADD A PRODUCT
// 🌟 ADMIN API: Nayi Mithai Add Karne Ke Liye
router.post('/add', async (req, res) => {
    try {
        const { product_name, price, description, image_url } = req.body;

        // Naya product banayenge (Price ko direct bahar save karenge taaki NaN ka issue kabhi na aaye!)
        const newProduct = new Product({
            product_name: product_name,
            price: Number(price), 
            description: description,
            image_url: image_url
        });

        await newProduct.save();
        res.status(201).json({ message: 'Sweet added successfully! 🍬', product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: 'Server error while adding product', error });
    }
});

// 2. GET ALL PRODUCTS
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find().populate('category'); // .populate shows category details instead of just the ID
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

module.exports = router;

// Update a product by ID
router.patch('/update/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Product updated! ✅', updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Update failed', error });
    }
});