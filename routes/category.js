const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// 1. Add a new category (Admin only task)
router.post('/add', async (req, res) => {
    try {
        const { category_name } = req.body;
        const newCategory = new Category({ category_name });
        await newCategory.save();
        res.status(201).json({ message: 'Category added! 🍬', newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error adding category', error });
    }
});

// 2. Get all categories
router.get('/all', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});

module.exports = router;