const { getRepository } = require("typeorm");
const express = require('express');
const router = express.Router();
import { Request, Response } from "express";
import "reflect-metadata";
const nodemailer = require("nodemailer");
import dotenv from "dotenv";
import { UserList } from "../models/userlist";
const bcrypt = require('bcryptjs');
const mjml2html = require ('mjml');
const app = express();
const userController= require("../controller/user")

router.get('/register',userController.registerpege);
router.post('/register',userController.register);
router.get('/login',userController.loginpege);
router.post('/login',userController.login);

export default router;