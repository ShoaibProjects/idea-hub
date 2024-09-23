// backend/server.js
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// MongoDB connection
connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the MERN CRUD app!');
});

import ideaRouter from './routes/idea.js';
app.use('/idea', ideaRouter);

import UserRouter from './routes/user.js';
app.use('/user', UserRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
