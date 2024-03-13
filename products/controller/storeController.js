const express= require('express');
const datas= require('../data.json');
const products=require('../models/mongodb/data');
const cartsproducts=require('../models/mongodb/cart');
const users=require('../models/mongodb/users');
const carts= require('../cart.json');
const Users=require('../user.json');
const orderHistorys=require('../orderHistory.json');
//const storeslists=require('../storelist.json');
const orders=require('../models/mongodb/order');
const storelists=require('../models/mongodb/store');
const storelist=require('../storelist.json');
const ejsMate = require('ejs-mate');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const fs= require('fs');
const mongoose= require('mongoose');
require('dotenv').config();
const session = require('express-session');
const {isloggedIn} = require('../middleware')
const multer= require('multer');
const logger = require('../logger');
const { Pool } = require('pg');


const writeDataToFile = (filename, content) => {
    fs.writeFileSync(filename, JSON.stringify(content, null, 2), 'utf-8');
  };  


  const pool = new Pool({
    user: 'adityaamgain',
    host: 'localhost',
    database: 'suppliers',
    password: 'aytida',
    port: 5432,
  });


exports.storeList = async (req, res) => {
    if(process.env.STORE==='FS'){
        res.render('storelist',{storelists});
    }
    else if(process.env.STORE==='DB'){
        // const datas= await storelists.find({});
        // res.render('storelist',{datas})
        try {
            const { rows } = await pool.query('SELECT * FROM "storelists"');
            res.render('storelist', { datas: rows });
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
};


exports.addStore = (req, res) => {
    res.render('addStore');
};

exports.addstoreList =async (req, res) => {
    const userId = req.session.userId;
    if(process.env.STORE==='FS'){
        const { name, price, description, quantity, product_type } = req.body;
        const newProduct = {
            id: uuidv4(),
            user: userId,
            storeName,
            type,
            logo: req.file.path,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)] 
            }        
        };

        storelists.push(newProduct);
        fs.writeFile(path.join(__dirname, 'storelist.json'), JSON.stringify(storelists), (err) => {
            if (err) {
                console.error(err);
            }
            res.redirect('/');
        });
    }
    else if(process.env.STORE==='DB'){
        // try{
        //     const { latitude, longitude } = req.body;
        //     const store = new storelists({
        //         user: userId,
        //         storeName: req.body.storeName,
        //         type: req.body.type,
        //         logo: req.file.path,
        //         location: {
        //             type: 'Point',
        //             coordinates: [parseFloat(longitude), parseFloat(latitude)] 
        //         } 
        //     });
        //     await store.save()
        //     logger.info(`Store Inserted: ${store.storeName}`);
        //     res.redirect(`/`)
        // }catch(error){
        //     logger.error(`Error inserting store: ${error}`);
        //     res.status(500).send('Error inserting store');
        // }
        try {
            const { storeName, type, latitude, longitude } = req.body; // Assuming userId comes from req.body or authentication middleware
            const logoPath = req.file.path; // Make sure multer is set up to handle file uploads
            
            const insertQuery = `
                INSERT INTO storelists(user_id, store_name, store_type, logo, latitude, longitude)
                VALUES($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            
            const values = [userId, storeName, type, logoPath, parseFloat(latitude), parseFloat(longitude)];
            
            const { rows } = await pool.query(insertQuery, values);
            
            logger.info(`Store Inserted: ${rows[0].store_name}`);
            res.redirect(`/`);
        } catch (error) {
            logger.error(`Error inserting store: ${error}`);
            res.status(500).send('Error inserting store');
        }
    }
};

exports.storeView = async (req, res) => {
    // const store=await storelists.findById(req.params.id)
    // const  storename  = req.params.storeName;
    // const datas = await products.find({storeName: storename});
    // console.log(storename);
    // res.render('storeview',{ store, datas, storename });
    try {
        // Assuming you have a store_id as a parameter in your URL
        const storeId = req.params.id;
        const store_name = req.params.storeName;

        // Query to get a single store by its ID
        const storeQuery = 'SELECT * FROM "storelists" WHERE "id" = $1';
        const storeResult = await pool.query(storeQuery, [storeId]);

        if (storeResult.rows.length === 0) {
            return res.status(404).send('Store not found');
        }

        const store = storeResult.rows[0];

        // Query to get products by store name
        const productsQuery = 'SELECT * FROM "Products" WHERE "storeName" = $1';
        const productsResult = await pool.query(productsQuery, [store_name]);

        const datas = productsResult.rows;
        // Render your view with the store and products data
        res.render('storeview', { store, datas, store_name });
    } catch (error) {
        console.error(error);
    }
};

exports.nearbyStore = async(req,res)=>{
    const { id } = req.params;
    const store = await storelists.findById(id);
        if (!store) {
            return res.status(404).send('Store not found');
        }
        const [longitude, latitude] = store.location.coordinates;
        const nearbyStorelist = await storelists.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    distanceField: "dist.calculated", // This field will contain the distance
                    maxDistance: 1000, // Maximum distance in meters
                    spherical: true
                }
            }
        ]);
   res.render('nearby',{nearbyStorelist});
}

exports.searchStoreList = async(req, res) => {
    const { query } = req.query;
    if(process.env.STORE==='FS'){
        const matchedProducts = this.storelist.filter(store => 
            store.storeName.toLowerCase().includes(query.toLowerCase()));
        res.render('searchStoreResults', { stores: matchedProducts });
    }
    else if(process.env.STORE==='DB'){
        // const regex = new RegExp(query, 'i');
        // const matchedStore = await storelists.find({ storeName: regex });
        // res.render('searchStoreResults', { stores: matchedStore });
        const searchQuery = 'SELECT * FROM storelists WHERE store_name ILIKE $1';
        const searchValue = [`%${query}%`];
        const result = await pool.query(searchQuery, searchValue);
        const matchedStore = result.rows;
        res.render('searchStoreResults', { stores: matchedStore });
    }
};

