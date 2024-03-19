const express = require('express');
import { Router } from "express";
import "reflect-metadata";
const userController= require("../controller/user")

const router = Router();

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Register page
 *     responses:
 *       200:
 *         description: Shows the registration page.
 */
router.get('/register',userController.registerpage);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully.
 */
router.post('/register',userController.register);

router.get('/verify-email',userController.verifyEmail);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Login page
 *     description: Renders the login page where users can enter their credentials.
 *     responses:
 *       200:
 *         description: Displays the login page.
 */
router.get('/login',userController.loginpage);

/**
 * @swagger
 * /login:
 *  post:
 *    summary: Logs in a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Successfully logged in
 *      401:
 *        description: Unauthorized
 */
router.post('/login',userController.login);

export default router;