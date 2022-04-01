// Models
const { User } = require('../models/user.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    attributes: { exclude: ['password'] },
    where: { id, status: 'active' }
  });

  if (!user) {
    return next(new AppError(404, 'User not found with given id'));
  }

  req.user = user;
  next();
});

exports.accountOwner = catchAsync(async (req, res, next) => {
  const { currentUser, product } = req;
  
  if (product.userId !== currentUser.id){
    return next(new AppError(`Youre trying to edit someone else's account`, 500))
  } 
  
  next()
})