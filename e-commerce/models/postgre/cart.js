const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('suppliers', 'adityaamgain', 'aytida', {
  host: 'localhost',
  dialect: 'postgres'
});

const Cartproducts = sequelize.define('Cartproducts', {
    user: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name:{
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
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = Cartproducts;
