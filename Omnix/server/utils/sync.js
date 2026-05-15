const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect('mongodb://127.0.0.1/omnix_db').then(async () => {
    try {
        console.log("Syncing indexes...");
        await Product.syncIndexes();
        console.log("Success: Indexes synchronized!");
    } catch (err) {
        console.error("Error syncing indexes:", err.message);
    }
    process.exit(0);
});
