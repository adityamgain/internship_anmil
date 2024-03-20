const nodemailer = require("nodemailer");
const { getRepository } = require("typeorm");
const { Between } = require("typeorm"); 
import { Event } from "../models/eventlist";
const cron = require("node-cron");
const mjml2html = require("mjml");
import {createEmailBody} from "./mail_template";


const transporter = nodemailer.createTransport({
  secure: true,
  service: 'gmail', // Use the correct email service provider
  auth: {
    user: "amgainaditya@gmail.com",
    pass: "mvijkryuemhwfsfy",
  },
});

async function getTodaysEvents() {
  const eventRepository = getRepository(Event);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const events = await eventRepository.find({
    where: {
      date: Between(todayStart, todayEnd),
    },
  });
  return events;
}

// 0 8 * * *
// */5 * * * *

export async function cronjob() {
cron.schedule("*/5 * * * *", async () => {
  const todaysEvents = await getTodaysEvents();
  if (todaysEvents.length > 0) {
    const emailBody = createEmailBody(todaysEvents);
    // const eventList = todaysEvents.map((event: Event) => `${event.title}: ${event.description}`).join('\n\n');
    try {
      const info = await transporter.sendMail({
        from: '"Event Scheduler 👻" <amgainaditya@gmail.com>', // sender address
        to: 'amgainaditya@gmail.com', // list of receivers
        subject: "Today's Event List",
        html: emailBody,
      });
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  } else {
    console.log("No events for today.");
  }
});
}
