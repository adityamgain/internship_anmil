const express= require('express');
const datas= require('../json/data.json');
const products=require('../models/mongodb/data');
const cartsproducts=require('../models/mongodb/cart');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs= require('fs');
require('dotenv').config();
const logger = require('../utils/logger');
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

exports.productList = async (req, res) => {
    if(process.env.STORE==='FS'){
        res.render('home',{datas});
    }
    else if(process.env.STORE==='DB'){
        //mongodb
        // const datas= await products.find({});
        // res.render('home',{datas})

        // postgresSQL
        try {
            const { rows } = await pool.query('SELECT * FROM "Products"');
            res.render('home', { datas: rows });
        } catch (error) {
            console.error('Error executing query', error.stack);
            res.send("Error fetching data");
        }
    }
};

exports.limitedProductList = async(req,res)=>{
        if(process.env.STORE==='FS'){
            res.render('limited',{datas})
        }
        else if(process.env.STORE==='DB'){
            //mongodb
            // const datas= await products.find({});
            // res.render('limited',{datas})
            try {
                const { rows } = await pool.query('SELECT * FROM "Products"');
                res.render('limited', { datas: rows });
            } catch (error) {
                console.error('Error executing query', error.stack);
                res.send("Error fetching data");
            }
        }
};

exports.addProduct = (req, res) => {
    const { storeName }= req.params;
    res.render('add',{storeName});
};

exports.addProductList =async (req, res) => {
    const { storeName }= req.params;
    if(process.env.STORE==='FS'){
        const { name, price, description, quantity, product_type } = req.body;
        const newProduct = {
            id: uuidv4(),
            name,
            price,
            description,
            quantity,
            product_type,
            imagePath: req.file.path,
            bidding
        };

        datas.push(newProduct);
        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(datas), (err) => {
            if (err) {
                console.error(err);
            }
            res.redirect('/');
        });
    }
    else if(process.env.STORE==='DB'){
        try{
            // moongodb
            // const product = new products({
            //     name: req.body.name,
            //     storeName,
            //     price: req.body.price,
            //     description: req.body.description,
            //     quantity: req.body.quantity,
            //     product_type: req.body.product_type,
            //     imagePath: req.file.path, 
            //     bidding: req.body.bidding
            // });
            // await product.save()
            //res.redirect(`/`)

            const { name, price, description, quantity, product_type, bidding } = req.body;
            const imagePath = req.file.path; // Assuming you're using middleware like multer for file uploads
            const query = `
                INSERT INTO "Products" (name, "storeName", description, quantity, product_type, "imagePath",price, bidding)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            const values = [name, storeName, description, quantity, product_type, imagePath,price, bidding];
            try {
                pool.query(query, values);
                logger.info(`Inserted Product: ${name}`); 
                res.redirect(`/`);
            } catch (error) {
                console.error('Error adding product:', error);
                res.status(500).send('Error adding product');
            }
        }catch(error){
            logger.error(`Error inserting product: ${error}`);
            res.status(500).send('Error adding product');
        }
    }
};
           

exports.editProductList =async(req,res)=>{
    if(process.env.STORE==='FS'){
        const { id } = req.params;
        const product = datas.find(p => p.id === id);
        if (!product) {
            return res.send('Product not found');
        }
        res.render('edit', { product }); 
    }
    else if(process.env.STORE==='DB'){
        // const product=await products.findById(req.params.id)
        // res.render('edit',{ product });
        const productQuery = 'SELECT * FROM "Products" WHERE id = $1';
        const productId = req.params.id;
        const productResult = await pool.query(productQuery, [productId]);

        const product = productResult.rows[0];
        res.render('edit', { product });
    }
}

exports.editProduct = async (req, res) => {
    if(process.env.STORE==='FS'){
        const { id } = req.params;
        const { name, price, description, quantity, product_type } = req.body;
        const productIndex = datas.findIndex(p => p.id === id);
        // Update product details
        datas[productIndex] = { ...datas[productIndex], name, price, description, quantity, product_type };

        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(datas, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('An error occurred');
            }
            res.redirect('/');
        });
    }
    else if(process.env.STORE==='DB'){
        // try{
        //     const { id } = req.params;
        //     const product= await products.findByIdAndUpdate(id, {...req.body});
        //     logger.info(`Updated Product: ${product.name}`);
        //     res.redirect(`/`)
        // }catch(error){
        //     logger.error(`Error updating product: ${error}`);
        //     res.status(500).send('Error updating product');
        // }

        // const query = `
        //         INSERT INTO "Products" (name, "storeName", description, quantity, product_type, "imagePath",price, bidding)
        //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        //     `;
        //     const values = [name, storeName, description, quantity, product_type, imagePath,price, bidding];
        //     try {

        try {
            const { id } = req.params;
            const imagePath = req.file.path;
            const { name, description, quantity, product_type, price, bidding } = req.body;
            const updateQuery = `
                UPDATE "Products"
                SET name = $1, description = $2, quantity = $3, product_type = $4, "imagePath" = $5, price = $6, bidding = $7
                WHERE id = $8
                RETURNING *;`;
    
            const values = [name, description, quantity, product_type, imagePath, price, bidding, id];
            const result = await pool.query(updateQuery, values);
    
            if (result.rows.length > 0) {
                const updatedProduct = result.rows[0];
                logger.info(`Updated Product: ${updatedProduct.name}`);
                res.redirect(`/`);
            } else {
                res.status(404).send('Product not found');
            }
        } catch (error) {
            logger.error(`Error updating product: ${error}`);
            console.log(error);
            res.status(500).send('Error updating product');
        }
    }
};

exports.deleteProductList =async (req, res) => {
    if(process.env.STORE==='FS'){
        const { id } = req.params;
        const productIndex = datas.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return res.status(404).send('Product not found');
        }
        // Remove the product from the array
        datas.splice(productIndex, 1);

        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(datas), (err) => {
            if (err) {
                console.error(err);
            }
            res.redirect('/');
        });
    }
    else if(process.env.STORE==='DB'){
        // try{
        //     const{ id }= req.params;
        //     const product = await products.findByIdAndDelete(id);
        //     logger.info(`Deleted Product: ${product.name}`);
        //     res.redirect('/');
        // }catch(error){
        //     logger.error(`Error deleting product: ${error}`);
        //     res.status(500).send('Error deleting product');
        // }

        try {
            const { id } = req.params;
            const deleteQuery = 'DELETE FROM "Products" WHERE id = $1 RETURNING *;'; 
            const result = await pool.query(deleteQuery, [id]);
            if (result.rows.length > 0) {
                const deletedProduct = result.rows[0];
                logger.info(`Deleted Product: ${deletedProduct.name}`);
                res.redirect('/');
            } else {
                res.status(404).send('Product not found');
            }
        } catch (error) {
            logger.error(`Error deleting product: ${error}`);
            res.status(500).send('Error deleting product');
        }
    }
};

exports.searchProductList = async(req, res) => {
    const { query } = req.query;
    if(process.env.STORE==='FS'){
        const matchedProducts = datas.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()));
        res.render('searchResults', { products: matchedProducts });
    }
    else if(process.env.STORE==='DB'){
        // const regex = new RegExp(query, 'i');
        // const matchedProducts = await products.find({ name: regex });
        // res.render('searchResults', { product: matchedProducts });

        const searchQuery = 'SELECT * FROM "Products" WHERE name ILIKE $1';
        const searchValue = [`%${query}%`];
        const result = await pool.query(searchQuery, searchValue);
        const matchedStore = result.rows;
        // Render your view with the matched stores
        res.render('searchResults', { product: matchedStore });
    }
};

exports.biddingProductList = async(req,res)=>{
    if(process.env.STORE==='FS'){
        res.render('bidding',{datas})
    }
    else if(process.env.STORE==='DB'){
        // const datas= await products.find({});
        // res.render('bidding',{datas})
        try {
            const { rows } = await pool.query('SELECT * FROM "Products"');
            res.render('bidding', { datas: rows });
        } catch (error) {
            console.error('Error executing query', error.stack);
            res.send("Error fetching data");
        }
    }
};