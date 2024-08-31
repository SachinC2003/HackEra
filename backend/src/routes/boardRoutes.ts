import express, { Request, Response } from 'express';
import joi from 'joi';
import { authenticatejwt } from './middlewares/authMiddleware';
import { boardModel, boardValidation } from '../models/boardModel';
import { streamClient } from '..';
import { userModel } from '../models/userModel';
const router = express.Router();
// Initialize Stream Chat client


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

        // Create a new Stream Chat channel
        const channel = streamClient.channel('messaging', `board-${Date.now()}`, {
            name: name,
            created_by_id: userId,
        });

        await channel.create();

        const newBoard = new boardModel({
            userid: userId,
            name,
            boardMembers: [],
            chatChannelId: channel.id
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

        if (!userId) {
            return res.status(400).send({ success: false, message: "User ID is required" });
        }

        // Find boards by userId
        let boards = await boardModel.find({ userid: userId });

        // If no boards are found, check the user table
        if (boards.length === 0) {
            const user = await userModel.findOne({ _id: userId }).select('email');
            if (user) {
                const email = user.email;
                // Find boards where email is in boardMembers array
                boards = await boardModel.find({ boardMembers: email });
            }
        }

        // Check if any boards were found
        if (boards.length === 0) {
            return res.status(404).send({ success: false, message: "No boards found for this user" });
        }

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

        // Update the Stream Chat channel name
        if (updatedBoard.chatChannelId) {
            const channel = streamClient.channel('messaging', updatedBoard.chatChannelId);
            await channel.update({ name: name }, { text: `Board name updated to "${name}"` });
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

        // Delete the associated Stream Chat channel
        if (deletedBoard.chatChannelId) {
            const channel = streamClient.channel('messaging', deletedBoard.chatChannelId);
            await channel.delete();
        }

        return res.status(200).send({ success: true, message: "Board and associated chat channel deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

// New route to add a member to a board and chat channel
router.post('/add-board-member/:boardId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { boardId } = req.params;
        const { email } = req.body;
        const userId = req.headers.id as string;

        const { error } = emailValidation({ email });
        if (error) return res.status(400).send({ success: false, message: error.details[0].message });

        const board = await boardModel.findOne({ _id: boardId, userid: userId });

        if (!board) {
            return res.status(404).send({ success: false, message: "Board not found or you don't have permission to edit it" });
        }

        if (board.boardMembers.includes(email)) {
            return res.status(400).send({ success: false, message: "Email already added to board members" });
        }

        board.boardMembers.push(email);
        await board.save();

        // Add the member to the Stream Chat channel
        if (board.chatChannelId) {
            const channel = streamClient.channel('messaging', board.chatChannelId);
            await channel.addMembers([email]);
        }

        return res.status(200).send({ success: true, data: board });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

export { router };
