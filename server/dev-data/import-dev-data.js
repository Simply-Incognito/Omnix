const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Store = require('../models/Store');
const User = require('../models/User');

dotenv.config({ path: './config/config.env' });

const DB = process.env.LOCAL_DB_URI;

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log('DB connection failed:', err));

// READ JSON FILES
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const stores = JSON.parse(fs.readFileSync(`${__dirname}/stores.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    console.log('Importing data...');
    
    // 1. Create Users
    const createdUsers = await User.create(users);
    console.log('Users loaded!');

    // 2. Create Stores (Associate with first user)
    const storesWithUsers = stores.map(store => ({
        ...store,
        owner: createdUsers[0]._id
    }));
    const createdStores = await Store.create(storesWithUsers);
    console.log('Stores loaded!');

    // 3. Create Products (Associate with first store)
    const productsWithStores = products.map(prod => ({
        ...prod,
        storeId: createdStores[0]._id
    }));
    await Product.create(productsWithStores);
    console.log('Products loaded!');

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log('Error importing data:', err.message);
    if (err.code === 11000) {
        console.log('Duplicate key error. Data might already exist.');
    }
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Product.deleteMany();
    await Store.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
    console.log('Please use: node import-dev-data.js --import OR --delete');
    process.exit();
}
