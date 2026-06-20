const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const plotRoutes = require('./routes/plotRoutes');
const authRoutes = require('./routes/authRouter');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/plots', plotRoutes);
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend working' });
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`PlotBridge backend is awake and listening on port ${PORT}`);
});