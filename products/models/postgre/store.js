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
    storeName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    logo:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false,
    }
});

module.exports = Cartproducts;