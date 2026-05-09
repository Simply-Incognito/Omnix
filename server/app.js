"use strict";

const express = require('express'),
    cors = require('cors'),
    helmet = require('helmet'),
    rateLimit = require('express-rate-limit');

const AppError = require(`${__dirname}/utils/AppError`);

// Global Error Handler
const globalErrorHandler = require(`${__dirname}/controllers/globalErrorHandler`);

// Express App
const app = express();

// Middlewares
app.use(express.json());

// CORS configuration - allows frontend from different origin to make requests with credentials
app.use(cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Setting HTTP Security Headers
app.use(helmet());

// Rate Limiting
const rateLimiter = rateLimit({
    max: 10,
    windowMs: 60000,
    message: "Too many requests made. The owner of this website has blocked you from making any more requests. Try again later"
});

app.use('/api', rateLimiter);

// Routers
const authRouter = require(`${__dirname}/routes/authRoutes`);
const storeRouter = require(`${__dirname}/routes/storeRoutes`);
const productRouter = require(`${__dirname}/routes/productRoutes`);

app.use('/api/v1/auth', authRouter);
//app.use('/api/v1/users', userRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/products', productRouter);
//app.use('/api/v1/orders', orderRouter);
//app.use('/api/v1/payments', paymentRouter);
//app.use('/api/v1/analytics', analyticsRouter);


// Default Routes
app.use((req, res, next) => {
    return next(new AppError('How did you get here?', 404));
});


// Global Error Handling
app.use(globalErrorHandler);



module.exports = app;