require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./utils/db.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes.js');
const auctionRoutes = require('./routes/auctionRoutes.js');
const bidRoutes = require('./routes/bidRoutes.js');
const { errorHandler } = require('./handler/errorHandler.js');
const socketHandler = require('./handler/socketHandler.js');

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.CORS_ORIGINS;

//Server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const PORT = process.env.PORT || '7777';
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port:${PORT}`);
});

// Connect to DB
connectDB()
  .then(() => console.log('Connect to MongoDB'))
  .catch((err) => console.log(err.message));

// IO instance available through express app via req.app.get('io')
app.set('io', io);

socketHandler(io);

//Middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(express.static('static'));

// All Routes
// app.get('/hello', (req, res) => {
//   return res.status(200).json({ message: 'ok' });
// });
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auction', auctionRoutes);
app.use('/api/v1/bid', bidRoutes);

// Error handle middleware
app.use(errorHandler);
