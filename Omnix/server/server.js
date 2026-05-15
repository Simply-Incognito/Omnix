"use strict";

const app = require('./app');

require('dotenv').config({ path: `${__dirname}/config/config.env`, debug: true });

// Connect to DB
const connectDB = require(`${__dirname}/config/db`);

connectDB(process.env.LOCAL_DB_URI);


const port = process.env.PORT || 2003;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});