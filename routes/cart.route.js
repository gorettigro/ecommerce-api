const express = require('express')

//Controllers
const {
    addProductToCart,
    updateCart,
    purchaseOrder,
    removeProductFromCart
} = require('../controllers/cart.controller')

//Middlewares
const { validateSession} = require('../middlewares/auth.middleware');
const { updateCartValidations, validateResult} = require('../middlewares/validators.middleware');

const router = express.Router()

router.use(validateSession)

router.get('/', getUserCart);

router.post('/add-product', 
    updateCartValidations, 
    validateResult,
    addProductToCart);

router.patch('/update-cart', updateCart);

router.post('/purchase', purchaseOrder);

router.delete('/:productId', removeProductFromCart);

module.exports = { cartRouter: router }