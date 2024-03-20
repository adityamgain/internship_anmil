const express = require('express');
const router = express.Router();
const cartsController = require('../controller/cartController')
const { isloggedIn } = require('../utils/middleware'); 


// Cart Routes
router.get('/cart', isloggedIn, cartsController.cartList);
router.get('/cart/:id', isloggedIn, cartsController.addingCart);
router.get('/checkout', isloggedIn, cartsController.finalCartList);
router.post('/bidding/:id', isloggedIn, cartsController.addingBiddingList);
//router.post('/biddingResult/:id', isloggedIn, cartsController.bidResult);
router.post('/checkout/success', isloggedIn, cartsController.addOrderList);
router.get('/orderhistory',  cartsController.orderHistoryList);

module.exports = router;