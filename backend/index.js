import express from 'express';
import { createServer } from 'node:http';
import 'dotenv/config';
import connectDB from './config/db.js';
import mainRouter from './routes/server.routes.js';
import cors from 'cors';
import { Server } from 'socket.io';

connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.set('io', io);

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('A user connected:' + socket.id);

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on('sendMessage', ({ chatId, senderId, content }) => {
    const message = { chatId, senderId, content };

    io.to(chatId).emit('recieveMessage', message);
  });

  socket.on('joinUserNotifications', (userId) => {
    socket.join(`user-${userId}`);
    console.log(
      `User ${socket.id} joined personal notification channel for user ${userId}`
    );
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Server working');
});

app.use('/api', mainRouter);
app.use(
  '/uploads/profile-pictures',
  express.static('uploads/profile-pictures')
); // Serve static files to acess the photos
app.use('/uploads/id-pictures', express.static('uploads/id-pictures'));
app.all('*', (req, res) => {
  return res.status(404).send('API route not found');
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
