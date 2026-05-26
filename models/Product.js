const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', // Links this product to a specific category
        required: true 
    },
    image_url: { 
        type: String 
    },
    variants: [
        {
            weight: { type: String, required: true }, // e.g., "250gm", "1kg"
            price: { type: Number, required: true }  // e.g., 150, 500
        }
    ],
    stock_quantity: { 
        type: Number, 
        required: true, 
        default: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);