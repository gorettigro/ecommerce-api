const express = require('express')

// Controllers
const {
	loginUser,
    createUser,
    productCreatedByUser,
    updateUser,
    disableUserAccount,
    getAllOrders,
    getOrderById
} = require('../controllers/user.controller')

// Middlewares
const { validateSession} = require('../middlewares/auth.middleware');
const { createUserValidations, 
        validateResult
} = require('../middlewares/validators.middleware');
const {
    userExists,
    accountOwner
  } = require('../middlewares/user.middleware');

const router = express.Router()

router.post('/', createUserValidations, validateResult, createUser)

router.post('/login', validateResult, loginUser)

router.use(validateSession)

router.get('/me', productCreatedByUser)

router
  .use('/:id', userExists)
  .route('/:id')
	.patch(accountOwner, validateResult, updateUser)
	.delete(accountOwner, disableUserAccount)

router.get('/orders', getAllOrders)

router.get('/orders/:id', getOrderById)

module.exports = { userRouter: router }