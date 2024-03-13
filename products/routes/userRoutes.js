const express = require('express');
const router = express.Router();
const usersController = require('../controller/userController'); // Make sure to export your functions from wherever they are defined


// router.get('/signin', usersController.signin);
// router.post('/signin', usersController.signinUsers);
// router.get('/login', usersController.login);
// router.post('/login', usersController.loginUsers);

// module.exports = router;

/**
 * @swagger
 * /users/signin:
 *  get:
 *    summary: Sign in page
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: Display sign in page
 */
 router.get('/signin', usersController.signin);

 /**
  * @swagger
  * /users/signin:
  *  post:
  *    summary: Sign in a user
  *    tags: [Users]
  *    requestBody:
  *      required: true
  *      content:
  *        application/json:
  *          schema:
  *            type: object
  *            required:
  *              - email
  *              - name
  *              - password
  *            properties:
  *              email:
  *                type: string
  *              name:
  *                type: string
  *              password:
  *                type: string
  *    responses:
  *      200:
  *        description: User signed in successfully
  *      401:
  *        description: Unauthorized
  */
 router.post('/signin', usersController.signinUsers);
 
 /**
  * @swagger
  * /users/login:
  *  get:
  *    summary: Login page
  *    tags: [Users]
  *    responses:
  *      200:
  *        description: Display login page
  */
 router.get('/login', usersController.login);
 
 /**
  * @swagger
  * /users/login:
  *  post:
  *    summary: Login a user
  *    tags: [Users]
  *    requestBody:
  *      required: true
  *      content:
  *        application/json:
  *          schema:
  *            type: object
  *            required:
  *              - email
  *              - password
  *            properties:
  *              email:
  *                type: string
  *              password:
  *                type: string
  *    responses:
  *      200:
  *        description: User logged in successfully
  *      401:
  *        description: Unauthorized
  */
 router.post('/login', usersController.loginUsers);
 
 module.exports = router;
 