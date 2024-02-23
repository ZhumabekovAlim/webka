import express from "express";
import http from "http"; // Import the 'http' module
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import jwt from "jsonwebtoken"

import authRoute from './routes/auth.js';
import Message from './models/Message.js';
import User from './models/User.js';

const app = express();
dotenv.config();
const { ObjectId } = mongoose.Types;

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

// Create server and io 
const server = http.createServer(app);
const io = new Server(server);

// Routes
app.get('/register', (req, res) => {
    res.sendFile('register.html');
});

app.get('/login', (req, res) => {
    res.sendFile('login.html');
});
app.get('/:receiverId', (req, res) => {
    const receiverId = req.params.receiverId;

    res.sendFile('index.html', { receiverId });
});

function getUserFromToken(token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
}

// io connection
io.on('connection', (socket) => {
    socket.on('chat message', async (data) => {
      try {
        const userToken = data.token;
        const user = getUserFromToken(userToken);
  
        if (user) {
          const receiverUserId = data.receiverId || extractReceiverIdFromURL(socket.handshake.headers.referer);
  
          const receiverUser = await User.findById(receiverUserId);
           
          if (receiverUser) {
            const newMessage = new Message({
              sender:  user.id,
              receiver: receiverUser._id,
              content: data.text,
            });

            await newMessage.save();
            io.emit('chat message', { text: data.text, user: user, receiver: receiverUser.username });
          } else {
            console.error('Receiver user not found:', receiverUserId);
          }
        } else {
          console.error('Invalid user object. User:', user, 'Token:', userToken);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    });
  
  });

  function extractReceiverIdFromURL(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }


  // DB func
async function start() {
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@datingapp.baurm0d.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`);

        server.listen(PORT, () => console.log(`server started on port: ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start();
