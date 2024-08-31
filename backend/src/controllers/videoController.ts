import { Request, Response } from 'express';
import { StreamChat } from 'stream-chat';
import { boardModel } from '../models/boardModel';
import { userModel } from '../models/userModel';



const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const serverClient = StreamChat.getInstance(apiKey!, apiSecret);

const sanitizeUserId = (userId: string) => {
    return userId.replace(/\./g, '_').replace(/@/g, '_');
  };

  export const videoChat = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const token = serverClient.createToken(userId);
  res.json({ token });
};


