import joi from 'joi';
import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    boardMembers: {
        type: [String],
        default: []
    },
    chatChannelId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

export const boardModel = mongoose.model("boards", boardSchema);

export const boardValidation = (data: {}) => {
    const schema = joi.object({
        userid: joi.string().required().messages({
            'string.base': 'User ID should be a type of string',
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        }),
        name: joi.string().required().messages({
            'string.base': 'Board name should be a type of string',
            'string.empty': 'Board name is required',
            'any.required': 'Board name is required'
        }),
        boardMembers: joi.array().items(joi.string()).messages({
            'array.base': 'Board members should be an array of strings'
        }),
        chatChannelId: joi.string().allow(null)
    });
    return schema.validate(data);
};