"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = __importDefault(require("express"));
const chatControler_1 = require("../controllers/chatControler");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const router = express_1.default.Router();
exports.chatRouter = router;
router.post('/initialize', authMiddleware_1.authenticatejwt, chatControler_1.initializeChat);
router.get('/token', authMiddleware_1.authenticatejwt, chatControler_1.getChatToken);
