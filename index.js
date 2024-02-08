import express from "express";
import http from "http"; // Import the 'http' module
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

import authRoute from './routes/auth.js';

const app = express();
dotenv.config();

// Constants
const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);

// Create an http.Server instance and pass it to socket.io
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile('C:/xampp/htdocs/Webka/server/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

async function start() {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@datingapp.baurm0d.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`);

        server.listen(PORT, () => console.log(`server started on port: ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start();
