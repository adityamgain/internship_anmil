const express= require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const fs= require('fs');
const mongoose= require('mongoose');
const {Sequelize, DataTypes} = require("sequelize");
require('dotenv').config();
const session = require('express-session');
const multer= require('multer');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cartRoutes = require('./routes/cartRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const productRoutes = require('./routes/productRoutes')
const storeRoutes = require('./routes/storeRoute');
const adminRoutes = require('./routes/adminRoutes');


const pool = new Pool({
  user: 'adityaamgain',
  host: 'localhost',
  database: 'suppliers',
  password: 'aytida',
  port: 5432,
})

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL');
  // You can execute queries with client.query() here

  // Remember to release the client
  release();
});

// mongoose.connect(process.env.MONGO_URL, { 
//   useNewUrlParser: true, useUnifiedTopology: true 
// });


// const sequelize = new Sequelize(
//     'suppliers',
//     'adityaamgain',
//     'aytida',
//      {
//        host: 'localhost',
//        dialect: 'postgres'
//      }
//    );
//   try {
//     sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
//   sequelize.sync({ alter: true });
//   console.log("All models were synchronized successfully.");


const port=3000;
const app=express()


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      description: 'A simple Express User API',
    },
    server:{
      url: `http://localhost:3000/`,
    }
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto', httpOnly: true }
}));


app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/', productRoutes);
app.use('/', cartRoutes); // Use cart routes with '/cart' as base URL
app.use('/', userRoutes); 
app.use('/', storeRoutes);
app.use('/', adminRoutes);

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/'); 
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// app.get('/', async (req, res) => {
//     if(process.env.STORE==='FS'){
//         res.render('home',{datas});
//     }
//     else if(process.env.STORE==='DB'){
//         const datas= await products.find({});
//         res.render('home',{datas})
//     }
// });

// app.get('/limited',async(req,res)=>{
//         if(process.env.STORE==='FS'){
//             res.render('limited',{datas})
//         }
//         else if(process.env.STORE==='DB'){
//             const datas= await products.find({});
//             res.render('limited',{datas})
//         }
// })

// app.get('/add',isloggedIn, (req, res) => {
//     res.render('add');
// });

// app.post('/add',upload.single('image'),async (req, res) => {
//     if(process.env.STORE==='FS'){
//         const { name, price, description, quantity, product_type } = req.body;
//         const newProduct = {
//             id: uuidv4(),
//             name,
//             price,
//             description,
//             quantity,
//             product_type,
//             imagePath: req.file.path
//         };

//         datas.push(newProduct);
//         fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(datas), (err) => {
//             if (err) {
//                 console.error(err);
//             }
//             res.redirect('/');
//         });
//     }
//     else if(process.env.STORE==='DB'){
//         const product = new products({
//             name: req.body.name,
//             price: req.body.price,
//             description: req.body.description,
//             quantity: req.body.quantity,
//             product_type: req.body.product_type,
//             imagePath: req.file.path // Include the image path here
//         });
//         await product.save()
//         res.redirect(`/`)
//     }
// });

// app.get('/edit/:id',async(req,res)=>{
//     if(process.env.STORE==='FS'){
//         const { id } = req.params;
//         const product = datas.find(p => p.id === id);
//         if (!product) {
//             return res.send('Product not found');
//         }
//         res.render('edit', { product }); 
//     }
//     else if(process.env.STORE==='DB'){
//         const product=await products.findById(req.params.id)
//         res.render('edit',{ product });
//     }
// })

// app.put('/:id',async (req, res) => {
//     if(process.env.STORE==='FS'){
//         const { id } = req.params;
//         const { name, price, description, quantity, product_type } = req.body;
//         const productIndex = datas.findIndex(p => p.id === id);
//         // Update product details
//         datas[productIndex] = { ...datas[productIndex], name, price, description, quantity, product_type };

//         fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(datas, null, 2), (err) => {
//             if (err) {
//                 console.error('Error writing file:', err);
//                 return res.status(500).send('An error occurred');
//             }
//             res.redirect('/');
//         });
//     }
//     else if(process.env.STORE==='DB'){
//         const { id } = req.params;
//         const product= await products.findByIdAndUpdate(id, {...req.body});
//         res.redirect(`/`)
//     }
// });

// app.delete('/delete/:id',async (req, res) => {
//     if(process.env.STORE==='FS'){
//         const { id } = req.params;
//         const productIndex = datas.findIndex(p => p.id === id);

//         if (productIndex === -1) {
//             return res.status(404).send('Product not found');
//         }
//         // Remove the product from the array
//         datas.splice(productIndex, 1);

//         fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(datas), (err) => {
//             if (err) {
//                 console.error(err);
//             }
//             res.redirect('/');
//         });
//     }
//     else if(process.env.STORE==='DB'){
//         const{ id }= req.params;
//         await products.findByIdAndDelete(id);
//         res.redirect('/');
//     }
// });

// app.get('/search', async(req, res) => {
//     const { query } = req.query;
//     if(process.env.STORE==='FS'){
//         const matchedProducts = datas.filter(product => 
//             product.name.toLowerCase().includes(query.toLowerCase()));
//         res.render('searchResults', { products: matchedProducts });
//     }
//     else if(process.env.STORE==='DB'){
//         const regex = new RegExp(query, 'i');
//         const matchedProducts = await products.find({ name: regex });
//         res.render('searchResults', { product: matchedProducts });
//     }
// });

// app.get('/cart',isloggedIn,async (req, res) => {
//     if(process.env.STORE==='FS'){
//         const cartFilePath = path.join(__dirname, 'cart.json');
//         fs.readFile(cartFilePath, 'utf8', (err, data) => {
//             if (err) {
//                 console.error(err);
//                 return res.send('Unable to load cart');
//             }
//             let cart = JSON.parse(data);
//             res.render('cart', { cartlist: cart });
//         });
//     }
//     else if(process.env.STORE==='DB'){
//         const cartlist = await cartsproducts.find({}); 
//         if (!cartlist) {
//             return res.send('Cart is empty');
//         }
//         res.render('cart', { cartlist });
//     }
// });

// app.get('/cart/:id',isloggedIn,async(req,res)=>{
//     const { id } = req.params;
//     const userId = req.session.userId;
//     if(process.env.STORE==='FS'){
//         const product = datas.find(p => p.id === id);
//         if (!product) {
//             res.send('Product not found');
//         }
//         const cartFilePath = path.join(__dirname, 'cart.json');
//         fs.readFile(cartFilePath, 'utf8', (err, data) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Unable to load cart');
//             }
//             let cart = JSON.parse(data);
//             const cartItem = cart.find(item => item.id === id);
//             if (!cartItem) {
//                 cart.push({ ...product, quantity: 1 });
//             }
//             fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
//                 if (err) {
//                     console.error(err);
//                     res.send('Unable to update cart');
//                 }
//                 res.redirect('/cart');
//             });
//         });
//     }
//     else if(process.env.STORE==='DB'){
//         const product = await products.findById(id);
//         if (!product) {
//             return res.status(404).send('Product not found');
//         }
//         // Check if this product is already in the cart
//         let cartProduct = await cartsproducts.findOne({
//             user: userId, 
//             name: product.name,
//             description: product.description,
//             price: product.price,
//             product_type: product.product_type
//         });
//         if (cartProduct) {
//             // Product exists in the cart, increase the quantity
//             cartProduct.quantity += 1;
//         } else {
//             cartProduct = new cartsproducts({
//                 user: userId, 
//                 name: product.name,
//                 price: product.price,
//                 description: product.description,
//                 quantity: 1,
//                 product_type: product.product_type
//             });
//         }
//         await cartProduct.save();
//         res.redirect('/cart');
//     }
// })

// app.get('/checkout',(req,res)=>{
//     res.render('checkout');
// })

// app.post('/checkout/success',async(req,res)=>{
//     const userId = req.session.userId;
//     if(process.env.STORE==='FS'){
//            const cartData = JSON.parse(fs.readFileSync('cart.json'));
//            const orderHistory = JSON.parse(fs.readFileSync('orderhistory.json'));
//            orderHistory.push(...cartData);
//            fs.writeFileSync('orderhistory.json', JSON.stringify(orderHistory));
//            fs.writeFileSync('cart.json', JSON.stringify([]));
//            res.redirect('/checkout');
//     }
//     else if(process.env.STORE==='DB'){
//         const cartItems = await cartsproducts.find({ user: userId });
//         const orderHistories = cartItems.map(({ user, name, price }) => ({
//             user,
//             name,
//             price
//         }));
//         await orders.insertMany(orderHistories);
//         await cartsproducts.deleteMany({ user: userId });
//         res.redirect('/checkout');
//     }
// })

// app.get('/orderhistory',isloggedIn , async(req,res)=>{
//     if(process.env.STORE==='FS'){
//         res.render('history',{ orderHistorys });
//     }
//     else if(process.env.STORE==='DB'){
//         const orderHistory= await orders.find({});
//         res.render('history',{orderHistory})
//     }
// })

// app.get('/signin', (req, res) => {
//     res.render('signin');
// });

// app.post('/signin',async (req, res) => {
//     if(process.env.STORE==='FS'){
//         const { name,email, password } = req.body;
//         const newUser = {
//             id: uuidv4(),
//             name,
//             email,
//             password
//         };

//         Users.push(newUser);
//         fs.writeFile(path.join(__dirname, 'user.json'), JSON.stringify(Users), (err) => {
//             if (err) {
//                 console.error(err);
//             }
//             res.redirect('/');
//         });
//     }
//     else if(process.env.STORE==='DB'){
//         const { name, email, password } = req.body;
//         const existingUser = await users.findOne({ email: email });
//         if (existingUser) {
//             return res.status(400).send('User already exists');
//         }
//         const newUser = new users({
//                 id: uuidv4(), 
//                 name,
//                 email,
//                 password 
//         });
//         await newUser.save();
//         res.redirect('/');
//     }
// });

// app.get('/login',(req,res)=>{
//     res.render('login');
// })

// app.post('/login',async(req,res)=>{
//     if(process.env.STORE==='DB'){
//         const { email, password } = req.body;
//         const userIndex = Users.findIndex(p => p.email === email);
//         if (userIndex === -1) {
//             return res.send('User not found');
//         }
//         const user = Users[userIndex];
//         if (user.password === password) {
//             req.session.userId = user.id;
//             res.redirect('/');
//         }else{
//             res.redirect('/login')
//         }
//     }
//     else if(process.env.STORE==='DB'){
//         const { email, password } = req.body;
//             const user = await users.findOne({ email: email });
//             if (!user) {
//                 return res.send('User not found');
//             }
//             if (user.password === password) {
//                 req.session.userId = user.id;
//                 res.redirect('/');
//             } else {
//                 res.redirect('/login');
//             }
//     }
// })


app.listen(port, () => {
    console.log(`App listening on port 3000`)
})