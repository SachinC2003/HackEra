import express from 'express';
import cors, { CorsOptions } from 'cors'; 
import dotenv from 'dotenv';
dotenv.config();
import './config/dbconfig';
import { router as userRouter } from './routes/userRoutes';
import { router as taskRouter } from './routes/taskRoutes'
import { router as boardRouter } from './routes/boardRoutes'
import { StreamChat } from 'stream-chat';
import { chatRouter } from './routes/chatRoutes';

const app = express();
const port = process.env.PORT || 7000;
const apiKey = '7bcxwk7s8xjv';
const tokenEndpoint = 'https://pronto.getstream.io/api/auth/create-token';

export const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

const corsOptions: CorsOptions = {
  origin: '*', 
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  credentials: true,
};



app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);
app.use('/api/board', boardRouter);
app.use('/api/chat', chatRouter);
app.options('*', cors(corsOptions)); // Handle preflight requests
app.post('/token', async (req, res) => {
  const { userId } = req.body;
  console.log("hello");
  

  try {
    // const response = await fetch(`${tokenEndpoint}?api_key=${apiKey}&user_id=${userId}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    const token = streamClient.createToken(userId);
    //const data = await response.json();
    //console.log(data); // Log the response to check its content
    //const { token } = data;
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});
app.get('/',(req,res)=>{
    res.json("server is running")
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
