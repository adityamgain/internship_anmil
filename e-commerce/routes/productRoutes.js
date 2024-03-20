const express = require('express');
const router = express.Router();
const productsController = require('../controller/productController'); // Adjust the path as necessary
const { isloggedIn } = require('../utils/middleware'); 
const multer = require('multer');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/'); // Make sure this uploads directory exists
    },
    filename: function(req, file, callback) {
        callback(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    fileFilter: fileFilter
});

// Product Routes

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lists all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: An array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', productsController.productList);

/**
 * @swagger
 * /products/limited:
 *   get:
 *     summary: Lists a limited number of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: An array of limited products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/limited', productsController.limitedProductList);

/**
 * @swagger
 * /products/add/{storeName}:
 *   get:
 *     summary: Displays form to add a new product for a store
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form for adding a new product
 */
router.get('/add/:storeName', isloggedIn, productsController.addProduct);

/**
 * @swagger
 * /products/add/{storeName}:
 *   post:
 *     summary: Adds a new product for a store
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: New product added successfully
 */
router.post('/add/:storeName', isloggedIn, upload.single('image'), productsController.addProductList);

/**
 * @swagger
 * /products/edit/{id}:
 *   get:
 *     summary: Displays form to edit an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Form for editing an existing product
 */
router.get('/edit/:id', isloggedIn, productsController.editProductList);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Updates an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put('/:id', isloggedIn, upload.single('image'), productsController.editProduct);

/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Deletes an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete('/delete/:id', isloggedIn, productsController.deleteProductList);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Searches for products based on query
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An array of products matching the search criteria
 */
router.get('/search', productsController.searchProductList);

/**
 * @swagger
 * /products/bidding: 
 *   get:
 *     summary: Lists products available for bidding
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: An array of
*/
router.get('/bidding', productsController.biddingProductList);

module.exports = router;
