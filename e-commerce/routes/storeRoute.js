const express = require('express');
const router = express.Router();
const storesController = require('../controller/storeController'); // Adjust the path as necessary
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
 * /storelist:
 *  get:
 *    summary: List all stores
 *    tags: [Stores]
 *    responses:
 *      200:
 *        description: A JSON array of stores
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Store'
 */
router.get('/storelist', storesController.storeList);

/**
 * @swagger
 * /addstore:
 *  get:
 *    summary: Display add store page
 *    tags: [Stores]
 *    responses:
 *      200:
 *        description: HTML form for adding a new store
 *  post:
 *    summary: Add a new store
 *    tags: [Stores]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              image:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: Store successfully added
 */
router.get('/addstore', isloggedIn, storesController.addStore);


router.post('/addstore', isloggedIn, upload.single('image'), storesController.addstoreList);

/**
 * @swagger
 * /storelist/nearby/{storeName}/{id}:
 *  get:
 *    summary: List nearby stores based on a given store name and ID
 *    tags: [Stores]
 *    parameters:
 *      - in: path
 *        name: storeName
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: A JSON array of nearby stores
 */
router.get('/storelist/nearby/:storeName/:id', storesController.nearbyStore);


/**
 * @swagger
 * /storelist/{storeName}/{id}:
 *  get:
 *    summary: View details of a specific store by name and ID
 *    tags: [Stores]
 *    parameters:
 *      - in: path
 *        name: storeName
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Detailed view of a specific store
 */
router.get('/storelist/:storeName/:id', storesController.storeView);


/**
 * @swagger
 * /searchstore:
 *  get:
 *    summary: Search for stores
 *    tags: [Stores]
 *    parameters:
 *      - in: query
 *        name: query
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A JSON array of stores that match the search criteria
 */
router.get('/searchstore', storesController.searchStoreList);


// router.get('/edit/:id', isloggedIn, productsController.editProductList);
// router.put('/:id', isloggedIn, upload.single('image'), productsController.editProduct); // or router.put if using methodOverride
// router.delete('/delete/:id', isloggedIn, productsController.deleteProductList);
// router.get('/search', productsController.searchProductList);
// router.get('/bidding', productsController.biddingProductList);

module.exports = router;