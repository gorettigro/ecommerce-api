const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model')
const { Order } = require('../models/order.model')

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');

dotenv.config({ path: './config.env' });

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user given an email and has status active
  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  // Compare entered password vs hashed password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }

  // Create JWT
  const token = await jwt.sign(
    { id: user.id }, // Token payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword
  });

  newUser.password = undefined;


  res.status(201).json({
    status: 'success',
    data: { newUser }
  });
});

exports.productCreatedByUser = catchAsync(async (req, res, next) => {
    const user = await User.findAll({
        where: { status: 'active' },
        include: [
            {
                model: Product
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { user },
    });
  });

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = req.currentUser

	const { name, email } = req.body

	await user.update({ name, email })

	res.status(204).json({ status: 'success' });
});

exports.disableUserAccount = catchAsync(async (req, res, next) => {
    const user = req.currentUser

	await user.update({ status: 'disabled' })

	res.status(204).json({ status: 'success' })
});

// Create a controller a function that gets all the user's orders
// The response must include all products that purchased 
exports.getAllOrders = catchAsync(async (req, res, next) => {
	const { currentUser } = req

	const userOrders = await Order.findAll({
		where: { userId: currentUser.id },
		include: [
			{
				model: ProductInOrder,
				attributes: { exclude: [ 'id', 'orderId' ] },
				include: [
					{
						model: Product,
						attributes: {
							exclude: [ 'userId', 'quantity', 'status' ]
						}
					}
				]
			}
		]
	});

	if (!userOrders) return next(new AppError(`You haven't bought anything yet`, 404))

	res.status(200).json({
		status: 'success',
		data: { userOrders }
	});
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { currentUser, params } = req
  
  // Find the order by a given ID
  // Must get the total price of the order and the prices of the products and how much the user bought
  const order = await Order.findOne({
    where: { id: params.id ,userId: currentUser.id },
    include: [
      {
        // Must include the products of that order
        model: ProductInOrder,
        attributes: { exclude: [ 'id', 'orderId' ] },
        include: [
          {
            model: Product,
            attributes: {
              exclude: [ 'userId', 'quantity', 'status' ]
            }
          }
        ]
      }
    ]
  });

  if (!order) return next(new AppError(`theres no order registered with the following id`, 404))

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});