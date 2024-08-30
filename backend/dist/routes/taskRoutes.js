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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const taskModel_1 = require("../models/taskModel");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const userModel_1 = require("../models/userModel");
const router = require('express').Router();
exports.router = router;
router.post('/tasks', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.userid = req.headers.id;
        const { error } = (0, taskModel_1.taskValidation)(req.body);
        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });
        const _a = req.body, { checklist, boardId } = _a, rest = __rest(_a, ["checklist", "boardId"]);
        if (!checklist || checklist.length === 0) {
            return res.status(400).send({ success: false, message: 'Checklist must have at least one element' });
        }
        const newTask = new taskModel_1.taskModel(Object.assign(Object.assign({}, rest), { checklist, boardId }));
        yield newTask.save();
        return res.status(201).send({ success: true, data: newTask });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
router.get('/:taskId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        const task = yield taskModel_1.taskModel.findById(taskId);
        if (!task) {
            return res.status(404).send({ success: false, message: 'Task not found' });
        }
        return res.status(200).send({ success: true, data: task });
    }
    catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).send({ success: false, message: 'Internal server error', error });
    }
}));
router.put('/:taskId', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const updateFields = req.body;
        const userId = req.headers.id;
        const user = yield userModel_1.userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        const task = yield taskModel_1.taskModel.findById(taskId);
        if (!task) {
            return res.status(404).send({ success: false, message: "Task not found" });
        }
        if (task.userid.toString() !== userId && updateFields.assignedTo && updateFields.assignedTo !== task.assignedTo) {
            return res.status(403).send({ success: false, message: "You are not authorized to change this field" });
        }
        if (task.userid.toString() !== userId && task.assignedTo !== user.email) {
            return res.status(403).send({ success: false, message: "You are not authorized to edit this task" });
        }
        const updatedTask = yield taskModel_1.taskModel.findByIdAndUpdate(taskId, updateFields, { new: true });
        if (!updatedTask) {
            return res.status(404).send({ success: false, message: "Task not found" });
        }
        return res.status(200).send({ success: true, data: updatedTask });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
router.delete('/:taskId', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const userId = req.headers.id;
        const user = yield userModel_1.userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }
        const task = yield taskModel_1.taskModel.findById(taskId);
        if (!task) {
            return res.status(404).send({ success: false, message: "Task not found" });
        }
        // Check if the user ID matches the task's user ID
        if (task.userid.toString() !== userId && task.assignedTo.toString() !== user.email) {
            return res.status(403).send({ success: false, message: "You are not authorized to delete this task" });
        }
        // Delete the task
        const deletedTask = yield taskModel_1.taskModel.findByIdAndDelete(taskId);
        return res.status(200).send({ success: true, message: "Task deleted successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
