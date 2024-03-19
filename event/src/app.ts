const express = require('express');
const { getRepository } = require("typeorm");
import "reflect-metadata";
import dotenv from "dotenv";
import { connectDatabase } from "./database/db";
import { Event } from "./models/eventlist";
import session from 'express-session';
const runcron = require('./utils/cronjob');
import  userRouter  from "./routes/user";
import  eventRouter  from "./routes/event";
const ejsMate = require('ejs-mate');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require("path");
const PORT = 3000;

const app = express();

// Swagger definition
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
  apis: ['./src/routes/*.ts'], // files containing annotations as above
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
  },
}));

declare module 'express-session' {
  export interface SessionData {
    userId?: number; 
  }
}

connectDatabase()
  .then(() => {
    const eventRepository = getRepository(Event);
    app.use('/', userRouter);
    app.use('/', eventRouter);
    app.listen(PORT, () => {
        console.log(`CONNECTED TO DB AND SERVER START ON ${PORT}`);
    });
    // running cronjob function
    runcron();
  }).catch(error => console.log(error));

