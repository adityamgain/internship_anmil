const nodemailer = require("nodemailer");
const { getRepository } = require("typeorm");
const { Between } = require("typeorm"); 
import { Event } from "./models/eventlist";
const cron = require("node-cron");
const mjml2html = require("mjml");


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

function createEmailBody(events: Event[]) {
  const eventItems = events.map(event => `
    <mj-section>
      <mj-column>
        <mj-text font-size="20px">${event.title}</mj-text>
        <mj-text>${event.description}</mj-text>
      </mj-column>
    </mj-section>
  `).join('');

  const mjmlTemplate = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
          <mj-divider border-color="#F45E43"></mj-divider>
            <mj-text font-size="24px">Today's Event List</mj-text>
          </mj-column>
        </mj-section>
        ${eventItems}
      </mj-body>
    </mjml>
  `;

  const htmlOutput = mjml2html(mjmlTemplate);
  return htmlOutput.html;
}

// 0 8 * * *
cron.schedule("0 8 * * *", async () => {
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

