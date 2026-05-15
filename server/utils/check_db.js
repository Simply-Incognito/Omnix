const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect('mongodb://127.0.0.1/omnix_db').then(async () => {
    try {
        const products = await Product.find({}).select('name storeId');
        console.log("ALL PRODUCTS IN DB:", products);
    } catch (err) {
        console.error("Error:", err.message);
    }
    process.exit(0);
});
