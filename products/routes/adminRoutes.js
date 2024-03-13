const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController')
const { isloggedIn } = require('../middleware'); 


// Cart Routes
router.get('/admin', adminController.adminlist);


module.exports = router;