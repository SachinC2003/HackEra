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

export const initializeChat = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.body;
    const userId = req.headers.id as string;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const sanitizedUserId = sanitizeUserId(user.email);
    
    const board = await boardModel.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (!board.boardMembers.includes(sanitizedUserId) && board.userid !== user.id) {
      return res.status(403).json({ message: 'User is not a member of this board' });
    }

    let channelId = board.chatChannelId;
   

    if (!channelId) {
      const channel = serverClient.channel('messaging', `board-${boardId}`, {
        name: `Chat for ${board.name}`,
        members: [...board.boardMembers,sanitizedUserId],
      });

      await channel.create();
      channelId = channel.id!;

      board.chatChannelId = channelId;
      await board.save();
    }

    res.json({ channelId });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing chat', error });
  }
};

export const getChatToken = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.id as string;
    

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const sanitizedUserId = sanitizeUserId(user.email);

    const token = serverClient.createToken(sanitizedUserId);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error generating chat token', error });
  }
};
