const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('blog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql' 
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

const Item = sequelize.define('Items', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // title: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

sequelize.sync().then(() => {
    console.log('Book table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });

module.exports = Item;