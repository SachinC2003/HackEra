import joi from 'joi';
import mongoose from 'mongoose';
import { InferSchemaType } from 'mongoose';

const taskSchema = new mongoose.Schema({
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

export const taskValidation = (data:{}) => {
    const schema = joi.object({
        userid: joi.string().required().messages({
            'string.base': 'User ID should be a type of string',
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        }),
        boardId: joi.string().allow('').messages({
            'string.base': 'Board ID should be a type of string'
        }),
        title: joi.string().required().messages({
            'string.base': 'Title should be a type of string',
            'string.empty': 'Title is required',
            'any.required': 'Title is required'
        }),
        priority: joi.string().required().messages({
            'string.base': 'Priority should be a type of string',
            'string.empty': 'Priority is required',
            'any.required': 'Priority is required'
        }),
        dueDate: joi.string().optional().messages({
            'string.base': 'Due Date should be a type of string'
        }),
        type: joi.string().required().messages({
            'string.base': 'Type should be a type of string',
            'string.empty': 'Type is required',
            'any.required': 'Type is required'
        }),
        checklist: joi.array().items(
            joi.object({
                message: joi.string().required().messages({
                    'string.base': 'Subtask message should be a type of string',
                    'string.empty': 'Subtask message is required',
                    'any.required': 'Subtask message is required'
                }),
                done: joi.boolean().required().messages({
                    'boolean.base': 'Subtask done status should be a type of boolean',
                    'any.required': 'Subtask done status is required'
                })
            })
        ).messages({
            'array.base': 'Checklist should be a type of array'
        }),
        assignedTo: joi.string().email().messages({
            'string.base': 'Assigned To should be a type of string',
            'string.email': 'Assigned To must be a valid email'
        })
    });
    return schema.validate(data);
};

export const taskModel = mongoose.model("tasks", taskSchema);
export type TaskDocument = InferSchemaType<typeof taskSchema>