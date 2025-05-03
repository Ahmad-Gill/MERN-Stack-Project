const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const WebSocket = require('ws');
const http = require('http'); // ✅ You forgot this

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ✅ Use this to support WebSocket and Express together

// ✅ Set up WebSocket server
const wss = new WebSocket.Server({ server, path: '/ws' });
wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
  ws.send('Hello from backend WebSocket!');
});

app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const flightRoutes = require('./routes/flightRout');
const userDetailRoutes = require('./routes/userDetailRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.get('/', (req, res) => res.send('API is running...'));

app.use('/user', userRoutes);
app.use('/user_details', userDetailRoutes);
app.use('/flight', flightRoutes);
app.use('/chat', chatRoutes);
app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Use `server.listen`, not `app.listen`
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
