const { getRepository } = require("typeorm");
const express = require('express');
import { Request, Response } from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import { Event } from "../models/eventlist";
import { UserList } from "../models/userlist";
import { Applicants } from "../models/applicant";

const app = express();


export const view = async (req: Request,res: Response) => {
    const eventRepository = getRepository(Event);
    const events = await eventRepository.find();
    res.render('view',{events});
};

export const addevent = (req: Request,res: Response) => {
    res.render('event');
};

export const addevents = async (req: Request,res: Response) => {
    try {
    const eventRepository = getRepository(Event);
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
  };


export const success = async (req: Request,res: Response)=>{
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
}

export const list = async(req: Request,res: Response)=>{
  const applicantRepository = getRepository(Applicants);
  const applicants = await applicantRepository.find();
  res.render('list',{applicants})
}
