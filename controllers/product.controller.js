
// Models
const { Product } = require('../models/product.model')
const { User } = require('../models/user.model')

// Utils
const { catchAsync } = require("../utils/catchAsync")
const { AppError } = require('../utils/appError')
const { filterObj } = require('../utils/filterObj')

exports.createProduct = catchAsync(async (req, res, next) => {
    
  const { title, description, price, quantity, category  } = req.body

  const userId = req.currentUser.id

  const newProduct = await Product.create({
    title,
    description,
    price,
    quantity,
    category,
    userId
  });

  res.status(200).json({
  status: 'success',
      data: { newProduct }
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  
  const allProducts = await Product.findAll({
    where: { status: 'active' },
    include: [
      { model: User, attributes: { exclude: ['id', 'password', 'status'] } },
    ]
  });

  res.status(200).json({
    status: 'success',
    data : { allProducts }
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {

    const { product } = req;

    res.status(200).json({
      status: 'success',
      data: { product },
      });
});

exports.updateProduct = catchAsync(async (req, res, next) => {

  const { newProduct } = req

  const product = filterObj(
    req.body,
    'title',
    'description',
    'price',
    'quantity'
   )

  const updatedProduct = await newProduct.update({
    ...product,
    quantity: product.quantity ? newProduct.quantity + product.quantity : newProduct.quantity
  });

  res.status(200).json({
    status: 'success',
    data : { updatedProduct }
  });
});

exports.disableProduct = catchAsync(async (req, res, next) => {

    const product = req

	await product.update({ status: 'disabled' });

	res.status(204).json({ status: 'success' });
});
