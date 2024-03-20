const { getRepository } = require("typeorm");
import { Request, Response } from "express";
import "reflect-metadata";
const nodemailer = require("nodemailer");
import dotenv from "dotenv";
import { UserList } from "../models/userlist";
// import jwt from "jsonwebtoken";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mjml2html = require ('mjml');
// import {sendVerificationEmail} from "../utils/mail_template";
import logger from "../utils/logger";

const secretKey = "password";

export const registerpage = (req: Request,res: Response)=>{
    res.render('register');
  }

export const register = async (req: Request,res: Response)=>{
    try {
      const { name, password, email } = req.body;
      const userRepository = getRepository(UserList);
      const userExists = await userRepository.findOne({ where: { email } });
      if (userExists) {
        return res.send('user exists');
      }

      // const hashedPassword = await bcrypt.hash(password, 12);
      // const refreshToken = jwt.sign({ email }, 'refreshTokenSecret', { expiresIn: '7d' });
  
      // const user = userRepository.create({
      //   name,
      //   password: hashedPassword,
      //   email,
      //   refreshtoken: refreshToken,
      //   emailVerified: false,
      // });
        // const user = new UserList();
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = userRepository.create({
        name: name,
        password: hashedPassword,
        email: email,
        emailVerified: false,
      });

      const verificationToken = jwt.sign(
        { userId: user.id, email: user.email },
        secretKey,
        { expiresIn: '24h' } // Token expires in 24 hours
      );
        user.refreshtoken= verificationToken;
      await userRepository.save(user);

      // const verificationToken = jwt.sign({ email }, 'verificationSecret', { expiresIn: '24h' });
      const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
      // await sendVerificationEmail(name, user.email, verificationUrl);
      // function sendVerificationEmail(name: string, email: string, verificationUrl: string) {
        const mjmlTemplate = `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-divider border-color="#F45E43"></mj-divider>
                <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hi ${name},</mj-text>
                <mj-text>Please click the link below to verify your email address and complete your registration:</mj-text>
                <mj-button href="${verificationUrl}">Verify Email</mj-button>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
        `;
        const htmlOutput = mjml2html(mjmlTemplate).html;
      
        const transporter = nodemailer.createTransport({
          secure: true,
          service: 'gmail',
          auth: {
            user: "amgainaditya@gmail.com",
            pass: "mvijkryuemhwfsfy",
          },
        });
      
        transporter.sendMail({
          from: '"Event Handler 👻" <amgainaditya@gmail.com>',
          to: email,
          subject: "Email Verification Required",
          html: htmlOutput,
        });
      // }
      logger.info(`Verification Mail send successfully to: ${user.email}`);
    } catch (error) {
      logger.error(`Error occurred: ${error}`);
      console.error("Failed to add event:", error);
      return res.status(500).send("An error occurred while adding the event.");
    }
  }

  export const verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.query;      
      if (!token) {
        return res.status(400).send('Verification failed. No token provided.');
      }
    //   const expired = await isTokenExpired(token);
    //   if (verifyExpiration(token)) {
    //     db.authToken.destroy({ where: { id: token.id } });
    //     res.status(403).send("Refresh token was expired. Please make a new sign in request");
    // }
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userId;
      const userRepository = getRepository(UserList);
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).send('User not found.');
      }
      user.verifyEmail = true;
      await userRepository.save(user);
      res.redirect('/')
    } catch (error) {
      logger.error(`Error occurred: ${error}`);
      return res.send('An error occurred during email verification.');
    }
  };
  
  export const loginpage = (req: Request,res: Response)=>{
    res.render('login');
  }

  export const login = async (req: Request,res: Response)=>{
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
        logger.info(`Logged In successfully: ${user.email}`);
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      logger.error(`Error occurred: ${error}`);
      console.error('Error during login:', error);
    }
  }




