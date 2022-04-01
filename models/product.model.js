const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  }
});

Product.addHook('afterUpdate', async (product, options) => {
	if (product.status === 'soldOut' && +product.quantity > 0) {
		await product.update({ status: 'active' });
	}

	if (product.quantity === 0) {
		await product.update({ status: 'soldOut' });
	}
});

module.exports = { Product };