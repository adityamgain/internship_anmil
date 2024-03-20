import { Event } from "../models/eventlist";
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mjml2html = require("mjml");

export function createEmailBody(events: Event[]) {
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


  export function sendVerificationEmail(name: string, email: string, verificationUrl: string) {
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
  }