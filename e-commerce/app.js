const express= require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();
const session = require('express-session');
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
  release();
});


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
  apis: ['./routes/*.js'], 
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
app.use('/', cartRoutes); 
app.use('/', userRoutes); 
app.use('/', storeRoutes);
app.use('/', adminRoutes);

app.listen(port, () => {
    console.log(`App listening on port 3000`)
})