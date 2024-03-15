const express = require('express');
const router = express.Router();
import "reflect-metadata";
import { isLoggedIn } from "../middleware";
// import { eventController } from "../controller/event";
const eventController = require("../controller/event")

router.get('/',eventController.view);
router.get('/add/events',isLoggedIn,eventController.addevent);
router.post('/add/events',isLoggedIn,eventController.addevents);
router.post('/success',isLoggedIn,eventController.success);
router.get('/list',eventController.list);

export default router;