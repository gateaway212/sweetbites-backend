const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);