"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardValidation = exports.boardModel = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const boardSchema = new mongoose_1.default.Schema({
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
    }
}, {
    timestamps: true
});
exports.boardModel = mongoose_1.default.model("boards", boardSchema);
const boardValidation = (data) => {
    const schema = joi_1.default.object({
        userid: joi_1.default.string().required().messages({
            'string.base': 'User ID should be a type of string',
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        }),
        name: joi_1.default.string().required().messages({
            'string.base': 'Board name should be a type of string',
            'string.empty': 'Board name is required',
            'any.required': 'Board name is required'
        }),
        boardMembers: joi_1.default.array().items(joi_1.default.string()).messages({
            'array.base': 'Board members should be an array of strings'
        })
    });
    return schema.validate(data);
};
exports.boardValidation = boardValidation;
