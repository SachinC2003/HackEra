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
const router = require('express').Router();
exports.router = router;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const taskModel_1 = require("../models/taskModel");
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, userModel_1.registerValidate)(req.body);
        if (error) {
            const errors = error.details.reduce((acc, detail) => {
                acc[detail.context.key] = detail.message;
                return acc;
            }, {});
            return res.status(400).send({ errors, success: false });
        }
        let user = yield userModel_1.userModel.findOne({ name: req.body.name });
        if (user)
            return res.status(409).send({ errors: { name: "User with given name already exists" }, success: false });
        user = yield userModel_1.userModel.findOne({ email: req.body.email });
        if (user)
            return res.status(409).send({ errors: { email: "User with given email already exists" }, success: false });
        const salt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
        const hashPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        yield new userModel_1.userModel(Object.assign(Object.assign({}, req.body), { password: hashPassword })).save();
        const usernew = yield userModel_1.userModel.findOne({ name: req.body.name });
        if (!usernew)
            return res.status(500).send({ message: "Error creating user", success: false });
        const token = (0, userModel_1.generateAuthToken)(usernew._id);
        return res.status(201).send({ authToken: token, message: "Signed in successfully", success: true });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, userModel_1.loginValidate)(req.body);
        if (error) {
            const errors = error.details.reduce((acc, detail) => {
                acc[detail.context.key] = detail.message;
                return acc;
            }, {});
            return res.status(400).send({ errors, success: false });
        }
        const user = yield userModel_1.userModel.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ errors: { email: "User with given email does not exist" }, success: false });
        const validatePassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validatePassword)
            return res.status(401).send({ errors: { password: "Incorrect password" }, success: false });
        const token = (0, userModel_1.generateAuthToken)(user._id);
        res.status(200).send({ authToken: token, message: "Logged in successfully", success: true });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.get('/me', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.userModel.findOne({ _id: req.headers.id });
        if (!user)
            return res.status(400).send({ message: "User does not exist", success: false });
        else {
            return res.status(200).send({
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting user", error });
    }
}));
// PUT route to update user information
router.put('/:userId', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const updateFields = req.body;
        // Ensure the authenticated user can only update their own information
        if (req.headers.id !== userId) {
            return res.status(403).send({ success: false, message: 'Unauthorized: You can only update your own information' });
        }
        // Validate the update fields
        const { error } = (0, userModel_1.updateValidate)(updateFields);
        if (error) {
            const errors = error.details.reduce((acc, detail) => {
                acc[detail.context.key] = detail.message;
                return acc;
            }, {});
            return res.status(400).send({ errors, success: false });
        }
        // If updating email, check for existing email
        if (updateFields.email) {
            const existingUser = yield userModel_1.userModel.findOne({ email: updateFields.email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).send({ success: false, message: 'User with given email already exists', field: 'email' });
            }
        }
        // If updating password, verify old password and hash new password
        if (updateFields.oldPassword && updateFields.newPassword) {
            const { oldPassword, newPassword } = updateFields;
            const user = yield userModel_1.userModel.findById(userId);
            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }
            const isPasswordMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).send({ success: false, message: 'Old password is incorrect', field: 'oldPassword' });
            }
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
            updateFields.password = hashedPassword;
            delete updateFields.oldPassword;
            delete updateFields.newPassword;
        }
        const updatedUser = yield userModel_1.userModel.findByIdAndUpdate(userId, updateFields, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        return res.status(200).send({ success: true, data: updatedUser });
    }
    catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).send({ success: false, message: 'Internal server error', error });
    }
}));
router.get('/analytics', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers.id;
        const user = yield userModel_1.userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).send({ message: "User does not exist", success: false });
        }
        const tasks = yield taskModel_1.taskModel.find({
            $or: [
                { userid: userId },
                { assignedTo: user.email }
            ]
        });
        const backlogTasks = tasks.filter(task => task.type === 'backlog').length;
        const todoTasks = tasks.filter(task => task.type === 'todo').length;
        const inProgressTasks = tasks.filter(task => task.type === 'inprogress').length;
        const completedTasks = tasks.filter(task => task.type === 'done').length;
        const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
        const moderatePriorityTasks = tasks.filter(task => task.priority === 'moderate').length;
        const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
        const tasksWithDueDate = tasks.filter(task => task.dueDate).length;
        return res.status(200).send({
            success: true,
            data: {
                backlogTasks,
                todoTasks,
                inProgressTasks,
                completedTasks,
                lowPriorityTasks,
                moderatePriorityTasks,
                highPriorityTasks,
                tasksWithDueDate
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
router.get('/tasks', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers.id;
        const filter = req.query.filter;
        const boardId = req.query.boardId; // Get boardId from query params
        // Verify if the user exists
        const user = yield userModel_1.userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).send({ message: "User does not exist", success: false });
        }
        // Define the date range based on the filter
        const currentDate = new Date();
        let dateRange = {};
        switch (filter) {
            case 'today':
                dateRange = {
                    createdAt: {
                        $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
                        $lte: new Date(currentDate.setHours(23, 59, 59, 999))
                    }
                };
                break;
            case 'week':
                dateRange = {
                    createdAt: {
                        $gte: new Date(currentDate.setDate(currentDate.getDate() - 7))
                    }
                };
                break;
            case 'month':
                dateRange = {
                    createdAt: {
                        $gte: new Date(currentDate.setDate(currentDate.getDate() - 30))
                    }
                };
                break;
            default:
                break;
        }
        // Retrieve tasks for the user based on userid or assignedTo email and boardId
        const tasks = yield taskModel_1.taskModel.find(Object.assign({ $or: [
                { userid: userId },
                { assignedTo: user.email }
            ], boardId: boardId || '' }, dateRange));
        // Categorize tasks based on type
        const categorizedTasks = {
            todo: [],
            inprogress: [],
            backlog: [],
            done: []
        };
        tasks.forEach(task => {
            switch (task.type) {
                case 'todo':
                    categorizedTasks.todo.push(task);
                    break;
                case 'inprogress':
                    categorizedTasks.inprogress.push(task);
                    break;
                case 'backlog':
                    categorizedTasks.backlog.push(task);
                    break;
                case 'done':
                    categorizedTasks.done.push(task);
                    break;
                default:
                    break;
            }
        });
        return res.status(200).send({
            success: true,
            data: categorizedTasks
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting tasks", error });
    }
}));
