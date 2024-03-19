const express = require('express');
import { Router } from "express";
import "reflect-metadata";
import { isLoggedIn } from "../utils/middleware";
// import { eventController } from "../controller/event";
const eventController = require("../controller/event")

const router = Router();


/**
 * @swagger
 * /:
 *   get:
 *     summary: View the main page
 *     responses:
 *       200:
 *         description: Returns the main page.
 */
router.get('/',eventController.view);

/**
 * @swagger
 * /add/events:
 *   get:
 *     summary: Form to add new events (Requires Login)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Returns the form for adding new events.
 *   post:
 *     summary: Add a new event (Requires Login)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *                 description: Name of the event.
 *               eventDate:
 *                 type: string
 *                 description: Date of the event.
 *     responses:
 *       200:
 *         description: New event added successfully.
 */
router.get('/add/events',isLoggedIn,eventController.addevent);
router.post('/add/events',isLoggedIn,eventController.addevents);

/**
 * @swagger
 * /success:
 *   post:
 *     summary: Endpoint called upon successful event addition (Requires Login)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Success message.
 */
router.post('/success',isLoggedIn,eventController.success);

/**
 * @swagger
 * /list:
 *   get:
 *     summary: List all events
 *     responses:
 *       200:
 *         description: Returns a list of all events.
 */
router.get('/list',eventController.list);

export default router;