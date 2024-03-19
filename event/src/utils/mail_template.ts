import { Event } from "../models/eventlist";
const cron = require("node-cron");
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
