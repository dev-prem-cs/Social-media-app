import express from 'express';
import dotenv from 'dotenv';
import connectdb from './config/db.js';
import { createClient } from 'redis';
import { userRouter } from './routes/user.router.js';
import { connectRabbitMQ } from './config/rabbitMQ.js';
dotenv.config();
connectdb();

const app = express();
const PORT = process.env.PORT || 5000;
const redisUrl= process.env.REDIS_URL || '';

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.connect().then(()=>{
  console.log('Connected to Redis');
  }).catch((err)=>{
  console.error('Error connecting to Redis:', err);
});

connectRabbitMQ();

app.use(express.json());
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
