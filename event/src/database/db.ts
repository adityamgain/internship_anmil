import { createConnection } from "typeorm";
import { Event } from "../models/eventlist";
import { UserList } from "../models/userlist";
import { Applicants } from "../models/applicant";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DB_PASSWORD);

export const connectDatabase = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "adityaamgain",
      password: "aytida",
      database: "event",
      synchronize: true,
      entities: [Event, UserList, Applicants],
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};