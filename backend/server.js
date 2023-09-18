const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv').config();
const cors = require('cors');
const db = require('./db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http'); // Import http module, not createServer() yet
const io = require('socket.io'); // Import socket.io module, not createServer() yet

const app = express();
const server = http.createServer(app); // Create an HTTP server

const socketServer = io(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with the origin of your frontend
  },
});

app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with the origin of your frontend
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use((req, res, next) => {
  req.io = socketServer; // Attach the `io` instance to the request object
  next();
});
app.use('/burger', require('./routes/userRoutes'));
app.use('/burger', require('./routes/menuRoutes'));
app.use('/burger', require('./routes/categoryRoutes'));
app.use('/burger', require('./routes/orderRoutes'));
app.use('/burger', require('./routes/contactRoutes'));


app.get('/', (req, res) => res.json('Server is running'));

socketServer.on('connection', (socket) => {
  console.log('A client connected.');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});

server.listen(8000, () => {
  console.log('Server and WebSocket server listening on port 8000');
});
