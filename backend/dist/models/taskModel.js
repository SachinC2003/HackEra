"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskModel = exports.taskValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    userid: {
        type: String,
        required: true
    },
    boardId: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    checklist: {
        type: [{ message: String, done: Boolean }],
        default: []
    },
    dueDate: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});
const taskValidation = (data) => {
    const schema = joi_1.default.object({
        userid: joi_1.default.string().required().messages({
            'string.base': 'User ID should be a type of string',
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        }),
        boardId: joi_1.default.string().allow('').messages({
            'string.base': 'Board ID should be a type of string'
        }),
        title: joi_1.default.string().required().messages({
            'string.base': 'Title should be a type of string',
            'string.empty': 'Title is required',
            'any.required': 'Title is required'
        }),
        priority: joi_1.default.string().required().messages({
            'string.base': 'Priority should be a type of string',
            'string.empty': 'Priority is required',
            'any.required': 'Priority is required'
        }),
        dueDate: joi_1.default.string().optional().messages({
            'string.base': 'Due Date should be a type of string'
        }),
        type: joi_1.default.string().required().messages({
            'string.base': 'Type should be a type of string',
            'string.empty': 'Type is required',
            'any.required': 'Type is required'
        }),
        checklist: joi_1.default.array().items(joi_1.default.object({
            message: joi_1.default.string().required().messages({
                'string.base': 'Subtask message should be a type of string',
                'string.empty': 'Subtask message is required',
                'any.required': 'Subtask message is required'
            }),
            done: joi_1.default.boolean().required().messages({
                'boolean.base': 'Subtask done status should be a type of boolean',
                'any.required': 'Subtask done status is required'
            })
        })).messages({
            'array.base': 'Checklist should be a type of array'
        }),
        assignedTo: joi_1.default.string().email().messages({
            'string.base': 'Assigned To should be a type of string',
            'string.email': 'Assigned To must be a valid email'
        })
    });
    return schema.validate(data);
};
exports.taskValidation = taskValidation;
exports.taskModel = mongoose_1.default.model("tasks", taskSchema);
