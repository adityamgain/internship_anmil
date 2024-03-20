const datas= require('../json/data.json');
const products=require('../models/mongodb/data');
const orderHistorys=require('../json/storelist.json');
const biddingproducts = require('../models/mongodb/bidding')
const orders=require('../models/mongodb/order');
const path = require('path');
const fs= require('fs');
require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
  user: 'adityaamgain',
  host: 'localhost',
  database: 'suppliers',
  password: 'aytida',
  port: 5432,
});

const writeDataToFile = (filename, content) => {
    fs.writeFileSync(filename, JSON.stringify(content, null, 2), 'utf-8');
};  

exports.cartList = async (req, res) => {
    if(process.env.STORE==='FS'){
        const cartFilePath = path.join(__dirname, 'cart.json');
        fs.readFile(cartFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.send('Unable to load cart');
            }
            let cart = JSON.parse(data);
            res.render('cart', { cartlist: cart });
        });
    }
    else if(process.env.STORE==='DB'){
        // const cartlist = await cartsproducts.find({}); 
        // if (!cartlist) {
        //     return res.send('Cart is empty');
        // }
        // res.render('cart', { cartlist });
        const query = 'SELECT * FROM cartsproducts;';
        const result = await pool.query(query);
        // Check if the cart is empty
        if (result.rows.length === 0) {
            return res.send('Cart is empty');
        }
        // If not empty, render the 'cart' view with the cartlist data
        res.render('cart', { cartlist: result.rows });
    }
};


exports.addingCart = async(req,res)=>{
    const { id } = req.params;
    const userId = req.session.userId;
    if(process.env.STORE==='FS'){
        const product = datas.find(p => p.id === id);
        if (!product) {
            res.send('Product not found');
        }
        const cartFilePath = path.join(__dirname, 'cart.json');
        fs.readFile(cartFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Unable to load cart');
            }
            let cart = JSON.parse(data);
            const cartItem = cart.find(item => item.id === id);
            if (!cartItem) {
                cart.push({ ...product, quantity: 1 });
            }
            fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
                if (err) {
                    console.error(err);
                    res.send('Unable to update cart');
                }
                res.redirect('/cart');
            });
        });
    }
    else if(process.env.STORE==='DB'){
        try {
            // Fetch product details based on the provided ID
            const productQuery = 'SELECT * FROM "Products" WHERE id = $1';
            const productRes = await pool.query(productQuery, [id]);
    
            if (productRes.rows.length === 0) {
                // Product not found
                return res.status(404).send('Product not found');
            }
            const query = 'SELECT name FROM "Products" WHERE id = $1';
            const values = [id];
            const res = await pool.query(query, values);
        
            const name = res.rows[0].name;
    
            const product = productRes.rows[0];
    
            // Check if the product exists in the user's cart
            const cartCheckQuery = 'SELECT * FROM cartsproducts WHERE user_id = $1 AND name = $2';
            const cartCheckRes = await pool.query(cartCheckQuery, [userId, name]);
    
            if (cartCheckRes.rows.length > 0) {
                // Product exists in cart, update quantity
                const updateQuantityQuery = 'UPDATE cartsproducts SET quantity = quantity + 1 WHERE user_id = $1 AND name = $2';
                await pool.query(updateQuantityQuery, [userId, name]);
            } else {
                // Product does not exist in cart, insert new item with product details
                const insertQuery = `
                    INSERT INTO cartsproducts (user_id, name, price, description, quantity, product_type)
                    VALUES ($1, $2, $3, $4, $5, 1, $6)
                `;
                await pool.query(insertQuery, [userId, product.name, product.price, product.description, product.product_type]);
            }
    
            res.redirect('/cart');
        } catch (err) {
            console.error('Error managing cart:', err);
            res.status(500).send('Error updating cart');
        }
    }
}

exports.addingBiddingList = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;
    const { bidding } = req.body;

    // First part: Handle adding/updating bidding list
    try {
        if (process.env.STORE === 'FS') {
            // Handle file system storage logic
            // Similar to your existing FS logic in addingBiddingList
            // Note: You'll need to adjust or remove the redirection at the end of FS logic
        } else if (process.env.STORE === 'DB') {
            // Handle database storage logic
            const product = await products.findById(id);
            if (!product) {
                return res.status(404).send('Product not found');
            }

            let bidProduct = await biddingproducts.findOne({ user: userId, name: product.name });
            if (!bidProduct) {
                bidProduct = new biddingproducts({ user: userId, name: product.name, bidding });
            } else {
                bidProduct.bidding = bidding; // Update bidding amount
            }
            await bidProduct.save();
            // Optionally, you might not want to redirect here, since we have more processing to do
            // res.redirect(`/biddingResult/${id}`);
        }

        // Second part: Process bids and create orders
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        const productsToProcess = await products.find({ createdAt: { $lte: twoMinutesAgo } });

        let ordersCreated = 0;
        for (const prod of productsToProcess) {
            const highestBid = await biddingproducts.findOne({ name: prod.name }).sort('-bidding').limit(1);

            if (highestBid) {
                const order = new orders({ user: highestBid.user, name: prod.name, price: highestBid.bidding });
                await order.save();
                ordersCreated++;
            }
        }

        // Final response after processing
        res.send(`${ordersCreated} orders created for bids finalized.`);
    } catch (error) {
        console.error('Error handling bidding and results:', error);
        res.status(500).send('Error handling bidding and results.');
    }
};

exports.finalCartList = (req,res)=>{
    res.render('checkout');
}

exports.addOrderList = async(req,res)=>{
    const userId = req.session.userId;
    if(process.env.STORE==='FS'){
           const cartData = JSON.parse(fs.readFileSync('cart.json'));
           const orderHistory = JSON.parse(fs.readFileSync('orderhistory.json'));
           orderHistory.push(...cartData);
           fs.writeFileSync('orderhistory.json', JSON.stringify(orderHistory));
           fs.writeFileSync('cart.json', JSON.stringify([]));
           res.redirect('/checkout');
    }
    else if(process.env.STORE==='DB'){
        try {
            // 1. Retrieve cart items for the user
            const cartItemsQuery = 'SELECT * FROM "CartProducts" WHERE "userId" = $1';
            const { rows: cartItems } = await pool.query(cartItemsQuery, [userId]);
    
            // 2. Prepare data for bulk insert (considering only user, name, price for simplicity)
            const orderHistoriesValues = cartItems.map(item => `('${item.user}', '${item.name}', ${item.price})`).join(',');
    
            // 3. Insert order histories into the Orders table
            if (orderHistoriesValues.length > 0) {
                const insertOrderHistoriesQuery = `INSERT INTO "Orders"("user", "name", "price") VALUES ${orderHistoriesValues}`;
                await pool.query(insertOrderHistoriesQuery);
            }
    
            // 4. Delete user's cart items
            const deleteCartItemsQuery = 'DELETE FROM "CartProducts" WHERE "userId" = $1';
            await pool.query(deleteCartItemsQuery, [userId]);
    
            // 5. Redirect to checkout
            res.redirect('/checkout');
        } catch (error) {
            console.error("Error processing checkout:", error);
            res.status(500).send("An error occurred during the checkout process.");
        }
    }
}

exports.orderHistoryList =  async(req,res)=>{
    if(process.env.STORE==='FS'){
        res.render('history',{ orderHistorys });
    }
    else if(process.env.STORE==='DB'){
        // const orderHistory= await orders.find({});
        // res.render('history',{ orderHistory })
        try {
            // SQL query to select all orders
            const query = 'SELECT * FROM "Orders"'; // Adjust the table name as necessary
            // Execute the query
            const { rows: orderHistory } = await pool.query(query);
            // Render the history page with the fetched order history
            res.render('history', { orderHistory });
          } catch (error) {
            console.error("Error fetching order history:", error);
            res.status(500).send("An error occurred while fetching order history.");
          }


    }
}



