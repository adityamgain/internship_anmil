const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('suppliers', 'adityaamgain', 'aytida', {
  host: 'localhost',
  dialect: 'postgres'
});

const Products = sequelize.define('Products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    storeName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imagePath: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bidding:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
});

module.exports = Products;