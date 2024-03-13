const datas= require('../data.json');
const products=require('../models/mongodb/data');
const cartsproducts=require('../models/mongodb/cart');
const users=require('../models/mongodb/users');
const carts= require('../cart.json');
const Users=require('../user.json');
const orderHistorys=require('../orderHistory.json');
const biddingproducts = require('../models/mongodb/bidding')
const orders=require('../models/mongodb/order');
const path = require('path');
const fs= require('fs');
const logger = require('../logger');
require('dotenv').config();

exports.adminlist = async (req, res) => {
    // const product = await orders.find({}); 
    // if (!product) {
    //     return res.send('Cart is empty');
    // }
    let oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const prod = await orders.find({
        createdAt: {
            $gte: oneMonthAgo
        }
    });

    // Calculating the total revenue
    const totalRevenue = prod.reduce((acc, order) => acc + order.price, 0);

    res.render('admin', { prod, totalRevenue }); 
    
};