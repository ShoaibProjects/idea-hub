// backend/server.js
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import dotenv from 'dotenv'; 

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  // origin: 'https://idea-hub-project.vercel.app',
  credentials: true,                // Allow cookies
}));
app.use(json());
app.use(cookieParser());

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

// // Export the app instead of starting the server
// export default app;