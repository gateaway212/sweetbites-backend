const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 🌟 API to Save a New Order
router.post('/create', async (req, res) => {
    try {
        const { userId, items, totalAmount, shippingAddress, paymentStatus } = req.body;

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            shippingAddress,
            paymentStatus: paymentStatus || 'Paid' // Razorpay status ke liye
        });

        await newOrder.save();

        res.status(201).json({ message: 'Order saved successfully! 🥳', order: newOrder });

    } catch (error) {
        console.error("Order save error:", error);
        res.status(500).json({ message: 'Server error during order placement', error });
    }
});

// 🌟 API to Get User's Orders 
router.get('/myorders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});


router.get('/admin/all-orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin orders" });
  }
});


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

// 📊 ADMIN ROUTE: Sales and Revenue Report generate karne ke liye
router.get('/admin/sales-report-analytics', async (req, res) => {
  try {
    // MongoDB aggregation to calculate date-wise revenue and order count
    const salesReport = await Order.aggregate([
      { $match: { status: 'Delivered' } }, // Sirf delivered orders se revenue calculate hoga
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } } // Newest dates first
    ]);

    // Calculate lifetime totals
    const totalStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          lifetimeRevenue: { $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, "$totalAmount", 0] } },
          totalOrdersCount: { $sum: 1 },
          deliveredCount: { $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] } },
          pendingCount: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      dailyAnalytics: salesReport,
      summary: totalStats[0] || { lifetimeRevenue: 0, totalOrdersCount: 0, deliveredCount: 0, pendingCount: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to generate sales report" });
  }
});

module.exports = router;