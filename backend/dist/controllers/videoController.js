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
exports.videoChat = void 0;
const stream_chat_1 = require("stream-chat");
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const serverClient = stream_chat_1.StreamChat.getInstance(apiKey, apiSecret);
const sanitizeUserId = (userId) => {
    return userId.replace(/\./g, '_').replace(/@/g, '_');
};
const videoChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const token = serverClient.createToken(userId);
    res.json({ token });
});
exports.videoChat = videoChat;
