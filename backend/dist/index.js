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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamClient = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./config/dbconfig");
const userRoutes_1 = require("./routes/userRoutes");
const taskRoutes_1 = require("./routes/taskRoutes");
const boardRoutes_1 = require("./routes/boardRoutes");
const stream_chat_1 = require("stream-chat");
const chatRoutes_1 = require("./routes/chatRoutes");
const app = (0, express_1.default)();
const port = process.env.PORT || 7000;
const apiKey = '7bcxwk7s8xjv';
const tokenEndpoint = 'https://pronto.getstream.io/api/auth/create-token';
exports.streamClient = stream_chat_1.StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
const corsOptions = {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/api/user', userRoutes_1.router);
app.use('/api/task', taskRoutes_1.router);
app.use('/api/board', boardRoutes_1.router);
app.use('/api/chat', chatRoutes_1.chatRouter);
app.options('*', (0, cors_1.default)(corsOptions)); // Handle preflight requests
app.post('/token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    console.log("hello");
    try {
        // const response = await fetch(`${tokenEndpoint}?api_key=${apiKey}&user_id=${userId}`, {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        const token = exports.streamClient.createToken(userId);
        //const data = await response.json();
        //console.log(data); // Log the response to check its content
        //const { token } = data;
        res.json({ token });
    }
    catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
}));
app.get('/', (req, res) => {
    res.json("server is running");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
