const { getRepository } = require("typeorm");
const ejsMate = require('ejs-mate');
const path = require("path");
const PORT = 3000;

const express = require('express');
import { Request, Response } from "express";
import "reflect-metadata";
const nodemailer = require("nodemailer");
import dotenv from "dotenv";
import { connectDatabase } from "./database/db";
import { Event } from "./models/eventlist";
import { UserList } from "./models/userlist";
import { Applicants } from "./models/applicant";
const bcrypt = require('bcryptjs');
import { isLoggedIn } from "./utils/middleware";
import session from 'express-session';
const mjml2html = require ('mjml');
const runcron = require('./utils/cronjob');
// const userRouter = require("./routes/user");
// const eventRouter = require("./routes/event");


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


// createConnection()
//     .then(async () => {
//         const eventRepository = connection.getRepository(events);
//         app.listen(PORT, () => {
//             console.log(`CONNECTED TO DB AND SERVER START ON ${PORT}`);
//       });
//   })
// .catch((error) => console.log(error));

connectDatabase()
  .then(() => {
    const eventRepository = getRepository(Event);


    // app.use('/', userRouter);
    // app.use('/', eventRouter);
    app.get("/", async (req: Request,res: Response) => {
      const eventRepository = getRepository(Event);
      const events = await eventRepository.find();
      res.render('view',{events});
  });
  
  app.get("/add/events",isLoggedIn, (req: Request,res: Response) => {
      res.render('event');
  });
  
  app.post('/add/events',isLoggedIn, async (req: Request,res: Response) => {
      try {
        const { title, description, seats, price } = req.body;
  
        // Creating a new event instance
        const event = new Event();
        event.title = title;
        event.description = description;
        event.seats = parseInt(seats, 10); 
        event.price = parseFloat(price); 
        event.date = new Date();
  
        // Saving the event in the database
        await eventRepository.save(event);
  
        // Redirect or respond as needed
        return res.redirect('/'); // For example, redirect to home
      } catch (error) {
        console.error("Failed to add event:", error);
        return res.status(500).send("An error occurred while adding the event.");
      }
    });


  app.post('/success',isLoggedIn,async (req: Request,res: Response)=>{
    const { eventId } = req.body; // Assuming eventId is directly accessible
    const userId = req.session.userId;
    if (!userId) return res.status(403).send("Not authenticated");

    const userRepository = getRepository(UserList);
    const eventRepository = getRepository(Event);
    const applicationRepository = getRepository(Applicants);

    const user = await userRepository.findOneBy({ id: userId });
    const event = await eventRepository.findOneBy({ id: eventId });

    if (!user || !event) {
      return res.status(404).send("User or event not found");
    }

    const application = new Applicants();
    application.name = user.name;
    application.event = event.title;
    application.nameId = userId;
    application.eventId = eventId;

    await applicationRepository.save(application);

    res.redirect('/');      
  })

  app.get('/list',async(req: Request,res: Response)=>{
    const applicantRepository = getRepository(Applicants);
    const applicants = await applicantRepository.find();
    res.render('list',{applicants})
  })

  app.get('/register',(req: Request,res: Response)=>{
    res.render('register');
  })  

  app.post('/register',async(req: Request,res: Response)=>{
    try {
      const { name, password, email } = req.body;
      const userRepository = getRepository(UserList);
      const userExists = await userRepository.findOne({ where: { email } });
      if (userExists) {
        return res.send('user exists');
      }
      const user = new UserList();
      const hashedPassword = await bcrypt.hash(password, 12);
      user.name = name;
      user.password = hashedPassword;
      user.email = email;
      await userRepository.save(user);
      
      const mjmlTemplate = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-divider border-color="#F45E43"></mj-divider>
              <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hi ${name},</mj-text>
              <mj-text>You have successfully been registered into our server. You will be receiving all the exciting event details and our announcements. Thank you for being a part of our family.</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
      `;
    
      const htmlOutput = mjml2html(mjmlTemplate).html;

      const transporter = nodemailer.createTransport({
        secure: true,
        service: 'gmail', // Use the correct email service provider
        auth: {
          user: "amgainaditya@gmail.com",
          pass: "mvijkryuemhwfsfy",
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Event Handler 👻" <amgainaditya@gmail.com>', // sender address
          to: user.email, // list of receivers
          subject: "Successfully Registered ✔", // Subject line
          html: htmlOutput,
        });
      }
      main().catch(console.error);
      return res.redirect('/'); 
    } catch (error) {
      console.error("Failed to add event:", error);
      return res.status(500).send("An error occurred while adding the event.");
    }
  })  
  
  app.get('/login',(req: Request,res: Response)=>{
    res.render('login');
  })

  app.post('/login',async(req: Request,res: Response)=>{
    const { email, password } = req.body;
      try {
        const userRepository = getRepository(UserList);
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            res.redirect('/register');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          if (req.session) {
            req.session.userId = user.id;
        }
        res.redirect('/');
      } else {
          res.redirect('/login');
      }
    } catch (error) {
        console.error('Error during login:', error);
    }
  })

  app.listen(PORT, () => {
       console.log(`CONNECTED TO DB AND SERVER START ON ${PORT}`);
  });
    runcron();
  }).catch(error => console.log(error));

