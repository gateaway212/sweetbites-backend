const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 🌟 API to Save a New Order
router.post('/create', async (req, res) => {
    try {
        const { userId, items, totalAmount, shippingAddress, paymentStatus } = req.body;

        // Naya order create karo
        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            shippingAddress,
            paymentStatus: paymentStatus || 'Paid' // Razorpay status ke liye
        });

        // Database mein save karo
        await newOrder.save();

        res.status(201).json({ message: 'Order saved successfully! 🥳', order: newOrder });

    } catch (error) {
        console.error("Order save error:", error);
        res.status(500).json({ message: 'Server error during order placement', error });
    }
});

// 🌟 API to Get User's Orders (Profile page ke liye)
router.get('/myorders/:userId', async (req, res) => {
    try {
        // Sirf is specific user ke orders nikalo, latest wale pehle (sort -1)
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});

// ==========================================
// 👑 ADMIN APIS (Naya Code Yahan Aaya Hai)
// ==========================================

// 🌟 1. ADMIN ROUTE: Saare orders fetch karne ke liye (Sabse naye pehle aayenge)
router.get('/admin/all-orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin orders" });
  }
});

// 🌟 2. ADMIN ROUTE: Order ka status update karne ke liye
router.put('/admin/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Sabse last mein export
module.exports = router;