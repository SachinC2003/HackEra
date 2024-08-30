import express, { Request, Response } from 'express';
import joi from 'joi';
import { authenticatejwt } from './middlewares/authMiddleware';
import { boardModel, boardValidation } from '../models/boardModel';

const router = express.Router();

// Validation schema for email
const emailValidation = (data: { email: string }) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'string.email': 'Email must be a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        })
    });
    return schema.validate(data);
};

router.post('/add-member', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        req.body.userid = req.headers.id;
        const { error } = emailValidation({ email });
        if (error) return res.status(400).send({ success: false, message: error.details[0].message });

        let board = await boardModel.findOne({ userid: req.headers.id });

        if (!board) {
            // Create a new board if it doesn't exist
            board = new boardModel({
                userid: req.headers.id,
                boardMembers: [email]
            });
        } else {
            if (board.boardMembers.includes(email)) {
                return res.status(400).send({ success: false, message: "Email already added to board members" });
            }
            board.boardMembers.push(email);
        }

        await board.save();

        return res.status(200).send({ success: true, data: board });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

router.get('/board-members', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers.id;
        const board = await boardModel.findOne({ userid: userId });

        if (!board) {
            return res.status(200).send({ success: true, data: [] });
        }

        return res.status(200).send({ success: true, data: board.boardMembers });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

router.post('/create-board', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const userId = req.headers.id as string;

        const { error } = boardValidation({ userid: userId, name });
        if (error) return res.status(400).send({ success: false, message: error.details[0].message });

        const newBoard = new boardModel({
            userid: userId,
            name,
            boardMembers: []
        });

        await newBoard.save();

        return res.status(201).send({ success: true, data: newBoard });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

// Route to get all boards for a user
router.get('/boards', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers.id as string;
        const boards = await boardModel.find({ userid: userId });

        return res.status(200).send({ success: true, data: boards });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

// Route to edit a board
router.put('/edit-board/:boardId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { boardId } = req.params;
        const { name } = req.body;
        const userId = req.headers.id as string;

        const { error } = boardValidation({ userid: userId, name });
        if (error) return res.status(400).send({ success: false, message: error.details[0].message });

        const updatedBoard = await boardModel.findOneAndUpdate(
            { _id: boardId, userid: userId },
            { $set: { name } },
            { new: true }
        );

        if (!updatedBoard) {
            return res.status(404).send({ success: false, message: "Board not found or you don't have permission to edit it" });
        }

        return res.status(200).send({ success: true, data: updatedBoard });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

// Route to delete a board
router.delete('/delete-board/:boardId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { boardId } = req.params;
        const userId = req.headers.id as string;

        const deletedBoard = await boardModel.findOneAndDelete({ _id: boardId, userid: userId });

        if (!deletedBoard) {
            return res.status(404).send({ success: false, message: "Board not found or you don't have permission to delete it" });
        }

        return res.status(200).send({ success: true, message: "Board deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

export { router };
