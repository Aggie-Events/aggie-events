// server.js
import express from 'express';
import { db } from './database';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const cors = require("cors");
app.use(cors());

export { app };