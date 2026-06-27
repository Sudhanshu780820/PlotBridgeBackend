const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http'); // Crucial: Required to define 'server'
const { Server } = require('socket.io'); 

const plotRoutes = require('./routes/plotRoutes');
const authRoutes = require('./routes/authRouter');
const dashboardRoutes= require('./routes/dashboardRoutes');
const conversationRoutes=require('./routes/conversationRoutes');
const messageRoutes=require('./routes/messageRoutes');
const savedRoutes=require('./routes/savedRoutes');
const aiRoutes=require('./routes/aiRoutes')
require('dotenv').config();

const app = express();

app.use(cors({
  origin: "https://plot-bridge-fontend.vercel.app", // Make sure this matches your Vercel URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// --- 1. DEFINE THE SERVER HERE ---
const server = http.createServer(app);

// --- 2. SETUP SOCKET.IO ---
const io = new Server(server, {
  cors: {
    origin: "https://plot-bridge-fontend.vercel.app", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined room: ${conversationId}`);
  });

  socket.on("send_message", (messageData) => {
    socket.to(messageData.conversationId).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages',messageRoutes);
app.use("/api/saved-properties", savedRoutes);
app.use("/api/ai",aiRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend working' });
});

// --- 3. START THE SERVER ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`PlotBridge backend is awake and listening on port ${PORT}`);
});