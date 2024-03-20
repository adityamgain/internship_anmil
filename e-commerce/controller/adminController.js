const orders=require('../models/mongodb/order');
require('dotenv').config();

exports.adminlist = async (req, res) => {
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