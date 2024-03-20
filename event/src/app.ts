const express = require('express');
const { getRepository } = require("typeorm");
const ejsMate = require('ejs-mate');
const path = require("path");
const PORT = 3000;
import "reflect-metadata";
import dotenv from "dotenv";
import { connectDatabase } from "./database/db";
import { Event } from "./models/eventlist";
import session from 'express-session';
const cronjob = require('./utils/cronjob');
// const {userRouter} = require("./routes/user");
// const {eventRouter} = require("./routes/event");
import userRoute from "./routes/user";
import eventRoute from "./routes/event";


const app = express();

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
    // Define custom properties here
    userId?: number; // Optional property; use "number" or whatever type suits your needs
  }
}

connectDatabase()
  .then(() => {
    const eventRepository = getRepository(Event);
  app.use('/',userRoute);
  app.use('/',eventRoute);

  app.listen(PORT, () => {
       console.log(`CONNECTED TO DB AND SERVER START ON ${PORT}`);
  });
    cronjob();
  }).catch(error => console.log(error));

