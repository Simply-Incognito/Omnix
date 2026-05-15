"use strict";

const mongoose = require('mongoose');

module.exports = async (url) => {
    try {
        await mongoose.connect(url);

        console.log(`Connected to DB successfully!`);

    } catch (error) {
        console.log(`An error has occurred: ${error.message}`);
        process.exit(1);
    }
}