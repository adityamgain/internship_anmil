const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('suppliers', 'adityaamgain', 'aytida', {
  host: 'localhost',
  dialect: 'postgres'
});

const Biddingproducts = sequelize.define('Biddingproducts', {
    user: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    bidding: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
    { timestamps: true }
);

module.exports = Biddingproducts;