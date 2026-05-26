const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Kis user ne order kiya?
    userId: { type: String, required: true },
    
    // Kya kya kharida? (Cart items)
    items: { type: Array, required: true },
    
    // Total bill kitna tha?
    totalAmount: { type: Number, required: true },
    
    // Kahan bhejna hai? (Address from checkout)
    shippingAddress: { type: Object, required: true },
    
    // Status kya hai?
    status: { type: String, default: 'Pending' },
    
    paymentStatus: { type: String, default: 'Paid' }
}, { timestamps: true }); 

module.exports = mongoose.model('Order', orderSchema);