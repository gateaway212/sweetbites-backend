const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use('/products', express.static(path.join(__dirname, 'products')));
app.use(express.json()); // allows us to parse JSON data [cite: 153]
// Add this right above your basic app.get route!
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/products', require('./routes/product'));
app.use('/api/orders', require('./routes/order'));
// Server.js mein ye add karo (Taki browser images dekh sake)
// Ye line Express ko batayegi ki 'uploads' folder public hai

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB is connected successfully! 🚀'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Bakery server and DB are live! 🍩');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});  