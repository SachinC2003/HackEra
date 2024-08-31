"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatToken = exports.initializeChat = void 0;
const stream_chat_1 = require("stream-chat");
const boardModel_1 = require("../models/boardModel");
const userModel_1 = require("../models/userModel");
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, apiSecret);
const sanitizeUserId = (userId) => {
    return userId.replace(/\./g, '_').replace(/@/g, '_');
};
const initializeChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId } = req.body;
        const userId = req.headers.id;
        const user = yield userModel_1.userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const sanitizedUserId = sanitizeUserId(user.email);
        const board = yield boardModel_1.boardModel.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        console.log(board.boardMembers);
        console.log(sanitizedUserId);
        const sanitizedMembers = board.boardMembers.map((em) => sanitizeUserId(em));
        if (!sanitizedMembers.includes(sanitizedUserId) && board.userid !== user.id) {
            return res.status(403).json({ message: 'User is not a member of this board' });
        }
        let channelId = board.chatChannelId;
        if (!channelId) {
            const channel = serverClient.channel('messaging', `board-${boardId}`, {
                name: `Chat for ${board.name}`,
                members: [...board.boardMembers, sanitizedUserId],
                permissions: {
                    read: ['user'],
                    write: ['user']
                }
            });
            yield channel.create();
            channelId = channel.id;
            board.chatChannelId = channelId;
            yield board.save();
        }
        res.json({ channelId });
    }
    catch (error) {
        res.status(500).json({ message: 'Error initializing chat', error });
    }
});
exports.initializeChat = initializeChat;
const getChatToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers.id;
        const user = yield userModel_1.userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const sanitizedUserId = sanitizeUserId(user.email);
        const token = serverClient.createToken(sanitizedUserId);
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error generating chat token', error });
    }
});
exports.getChatToken = getChatToken;
