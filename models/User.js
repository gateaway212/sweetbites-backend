const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,  
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phone_number: { 
        type: String, 
        required: true
    },
    address:{
        type: String,
        required: false
    }
}, { timestamps: true }); // This automatically handles the 'created_at' stuff for u!

module.exports = mongoose.model('User', userSchema);