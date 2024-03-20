const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('suppliers', 'adityaamgain', 'aytida', {
  host: 'localhost',
  dialect: 'postgres'
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   password:{
     type:DataTypes.STRING,
     allowNull: false,
    }
});

module.exports = User;