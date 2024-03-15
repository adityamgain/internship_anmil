const { getRepository } = require("typeorm");
const express = require('express');
import { Request, Response } from "express";
import "reflect-metadata";
const nodemailer = require("nodemailer");
import dotenv from "dotenv";
import { UserList } from "../models/userlist";
const bcrypt = require('bcryptjs');
const mjml2html = require ('mjml');
const app = express();

export const registerpege = (req: Request,res: Response)=>{
    res.render('register');
  }

export const register = async(req: Request,res: Response)=>{
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
  }
  
  export const loginpage = (req: Request,res: Response)=>{
    res.render('login');
  }

  export const login = async(req: Request,res: Response)=>{
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
  }




