const request = require('supertest');
const express = require('express');
const session = require('express-session');
import { Request, Response, NextFunction } from "express";


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));

const isLoggedInMock = (req: Request, res: Response, next: NextFunction) => {
  req.session.userId = 1; 
  next();
};

app.get("/", async (req: Request,res: Response) => {
  res.status(200).json({ message: "Welcome!" });
});

app.post('/register', async (req: Request,res: Response) => {
  const { name } = req.body;
  if (name) {
    res.status(200).json({ message: `User ${name} registered` });
  } else {
    res.status(400).json({ message: "Missing name" });
  }
});

describe('GET /', () => {
  it('responds with welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Welcome!" });
  });
});

describe('POST /register', () => {
  it('registers a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "User Test User registered" });
  });

});

