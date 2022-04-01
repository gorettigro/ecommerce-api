const express = require('express');

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Routers
const { userRouter } = require('./routes/user.route');
const { productRouter } = require('./routes/product.route');
const { cartRouter } = require('./routes/cart.route');

const app = express();

// Enable incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints
app.use('/api/v1/users', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);

app.use(globalErrorHandler);

module.exports = { app };