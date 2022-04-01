const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { promisify } = require('util');

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.validateSession = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(401, 'Invalid session'));
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findOne({
    attributes: { exclude: ['password'] },
    where: { id: decodedToken.id, status: 'active' }
  });

  if (!user) {
    return next(new AppError(401, 'Invalid session'));
  }

  req.currentUser = user;
  next();
});

exports.productOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { currentUser } = req

  const item = await Product.findOne({
      where: { id, status: { [Op.or]: ['active', 'soldOut'] }} 
  })

  if (!item) return next(new AppError('Product not found', 404))

  if (item.userId !== currentUser.id) return next(new AppError('Not owner', 401))

  req.item = item

  next()
})

exports.accountOwner = catchAsync(async (req, res, next) => {
  const { currentUser, product } = req;
  
  if (product.userId !== currentUser.id){
    return next(new AppError(`Youre trying to edit someone else's account`, 500))
  } 
  
  next()
})