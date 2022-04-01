// Models
const { Product } = require('../models/product.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.productExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { status: 'active', id } });

  if (!product) {
    return next(new AppError(404, 'No product found'));
  }

  req.product = product;

  next();
});
