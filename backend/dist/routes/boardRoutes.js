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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const boardModel_1 = require("../models/boardModel");
const router = express_1.default.Router();
exports.router = router;
// Validation schema for email
const emailValidation = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            'string.email': 'Email must be a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        })
    });
    return schema.validate(data);
};
router.post('/add-member', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        req.body.userid = req.headers.id;
        const { error } = emailValidation({ email });
        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });
        let board = yield boardModel_1.boardModel.findOne({ userid: req.headers.id });
        if (!board) {
            // Create a new board if it doesn't exist
            board = new boardModel_1.boardModel({
                userid: req.headers.id,
                boardMembers: [email]
            });
        }
        else {
            if (board.boardMembers.includes(email)) {
                return res.status(400).send({ success: false, message: "Email already added to board members" });
            }
            board.boardMembers.push(email);
        }
        yield board.save();
        return res.status(200).send({ success: true, data: board });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
router.get('/board-members', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers.id;
        const board = yield boardModel_1.boardModel.findOne({ userid: userId });
        if (!board) {
            return res.status(200).send({ success: true, data: [] });
        }
        return res.status(200).send({ success: true, data: board.boardMembers });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
router.post('/create-board', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const userId = req.headers.id;
        const { error } = (0, boardModel_1.boardValidation)({ userid: userId, name });
        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });
        const newBoard = new boardModel_1.boardModel({
            userid: userId,
            name,
            boardMembers: []
        });
        yield newBoard.save();
        return res.status(201).send({ success: true, data: newBoard });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
// Route to get all boards for a user
router.get('/boards', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers.id;
        const boards = yield boardModel_1.boardModel.find({ userid: userId });
        return res.status(200).send({ success: true, data: boards });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
// Route to edit a board
router.put('/edit-board/:boardId', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId } = req.params;
        const { name } = req.body;
        const userId = req.headers.id;
        const { error } = (0, boardModel_1.boardValidation)({ userid: userId, name });
        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });
        const updatedBoard = yield boardModel_1.boardModel.findOneAndUpdate({ _id: boardId, userid: userId }, { $set: { name } }, { new: true });
        if (!updatedBoard) {
            return res.status(404).send({ success: false, message: "Board not found or you don't have permission to edit it" });
        }
        return res.status(200).send({ success: true, data: updatedBoard });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
// Route to delete a board
router.delete('/delete-board/:boardId', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId } = req.params;
        const userId = req.headers.id;
        const deletedBoard = yield boardModel_1.boardModel.findOneAndDelete({ _id: boardId, userid: userId });
        if (!deletedBoard) {
            return res.status(404).send({ success: false, message: "Board not found or you don't have permission to delete it" });
        }
        return res.status(200).send({ success: true, message: "Board deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
