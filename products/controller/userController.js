const users=require('../models/mongodb/users');
const userlist=require('../user.json');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const fs= require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const logger = require('../logger');
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


exports.signin = (req, res) => {
    res.render('signin');
};

exports.signinUsers = async (req, res) => {
    if(process.env.STORE==='FS'){
        const { name,email, password } = req.body;
        const newUser = {
            id: uuidv4(),
            name,
            email,
            password
        };

        userlist.push(newUser);
        fs.writeFile(path.join(__dirname, 'user.json'), JSON.stringify(userlist), (err) => {
            if (err) {
                console.error(err);
            }
            res.redirect('/');
        });
    }
    else if(process.env.STORE==='DB'){
        // try{
        //     const { name, email, password } = req.body;
        //     const user = await users.findOne({ email: email });
        //     if (user) {
        //         return res.status(400).send('User already exists');
        //     }else{
        //     const newUser = new users({
        //             name,
        //             email,
        //             password 
        //     });
        //     await newUser.save();
        //     logger.info(`User Register: ${newUser.name}`);
        //     res.redirect('/');
        // }
        // }catch(error){
        //     logger.error(`Error registring user: ${error}`);
        //     res.status(500).send('Error registering user');       
        // }
        try {
            const { name, email, password } = req.body;
    
            // First, check if the user already exists
            const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
            const checkResult = await pool.query(checkUserQuery, [email]);
    
            if (checkResult.rows.length > 0) {
                return res.status(400).send('User already exists');
            } else {
                // Hash the password before saving to the database
                const hashedPassword = await bcrypt.hash(password, 12);
    
                // Insert the new user
                const insertUserQuery = `
                    INSERT INTO users(name, email, password)
                    VALUES($1, $2, $3)
                    RETURNING id, name, email; 
                `;
                const values = [name, email, hashedPassword];
    
                const insertResult = await pool.query(insertUserQuery, values);
    
                logger.info(`User Registered: ${insertResult.rows[0].name}`);
                res.redirect('/');
            }
        } catch (error) {
            logger.error(`Error registering user: ${error}`);
            res.status(500).send('Error registering user');
        }
    }
};

exports.login = (req,res)=>{
    res.render('login');
}

exports.loginUsers = async(req,res)=>{
    if(process.env.STORE==='FS'){
        const { email, password } = req.body;
        const userIndex = userlist.findIndex(p => p.email === email);
        if (userIndex === -1) {
            return res.send('User not found');
        }
        const user = userlist[userIndex];
        if (user.password === password) {
            req.session.userId = user.id;
            res.redirect('/');
        }else{
            res.redirect('/login')
        }
    }
    else if(process.env.STORE==='DB'){
        // try{
        // const { email, password } = req.body;
        //     const user = await users.findOne({ email: email });
        //     if (!user) {
        //         return res.send('User not found');
        //     }
        //     if (user.password === password) {
        //         req.session.userId = user.id;
        //         logger.info(`User LoggedIn: ${user.name}`);
        //         res.redirect('/');
        //     } else {
        //         res.redirect('/login');
        //     }
        // }catch(error){
        //     logger.error(`Error logging user: ${error}`);
        //     res.status(500).send('Error loggin user');       
        // }
        try {
            const { email, password } = req.body;
    
            // Attempt to find the user by their email
            const userQuery = 'SELECT * FROM users WHERE email = $1';
            const { rows } = await pool.query(userQuery, [email]);
    
            if (rows.length === 0) {
                return res.send('User not found');
            }
    
            const user = rows[0];
    
            // Compare provided password with hashed password in database
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (isMatch) {
                // Assuming req.session is properly configured for session management
                req.session.userId = user.id; // Set user ID in session
                logger.info(`User LoggedIn: ${user.name}`);
                res.redirect('/');
            } else {
                // Redirect back to login page if password does not match
                res.redirect('/login');
            }
        } catch (error) {
            logger.error(`Error logging in user: ${error}`);
            res.status(500).send('Error logging in user');
        }
    }
}
