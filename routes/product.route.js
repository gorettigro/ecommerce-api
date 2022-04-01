const express = require('express')

//Controllers
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    disableProduct
} = require('../controllers/product.controller')

//Middlewares
const { createProductValidations, 
        validateResult } = require( '../middlewares/validators.middleware' )
const { validateSession,
        productOwner} = require('../middlewares/auth.middleware')
const { productExists } = require('../middlewares/product.middleware')

const router = express.Router()

router.use(validateSession)

router.route('/')
        .get(getAllProducts)
        .post(createProductValidations,
            validateResult,
            createProduct)

router.use('/:id', productExists)
        .route('/:id')
        .get(getProductById)
        .patch(productOwner, updateProduct)
        .delete(productOwner, disableProduct)

module.exports = { productRouter: router }
