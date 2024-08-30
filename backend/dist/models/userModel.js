"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidate = exports.passwordValidate = exports.registerValidate = exports.loginValidate = exports.generateAuthToken = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
exports.userModel = mongoose_1.default.model("users", userSchema);
const generateAuthToken = function (id) {
    const token = jsonwebtoken_1.default.sign({ id }, process.env.JWTPRIVATEKEY);
    return token;
};
exports.generateAuthToken = generateAuthToken;
const loginValidate = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .required()
            .label("Email")
            .messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: (0, joi_password_complexity_1.default)()
            .required()
            .label("Password")
            .messages({
            'string.pattern.base': 'Password must meet complexity requirements',
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
    });
    return schema.validate(data, { abortEarly: false });
};
exports.loginValidate = loginValidate;
const registerValidate = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string()
            .required()
            .label("Name")
            .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
        email: joi_1.default.string()
            .email()
            .required()
            .label("Email")
            .messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: (0, joi_password_complexity_1.default)()
            .required()
            .label("Password")
            .messages({
            'string.pattern.base': 'Password must meet complexity requirements',
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        }),
        confirmPassword: joi_1.default.string()
            .required()
            .valid(joi_1.default.ref('password'))
            .label("Confirm Password")
            .messages({
            'any.only': 'Confirm Password does not match Password',
            'string.empty': 'Confirm Password is required',
            'any.required': 'Confirm Password is required'
        })
    });
    return schema.validate(data, { abortEarly: false });
};
exports.registerValidate = registerValidate;
const passwordValidate = (data) => {
    const schema = joi_1.default.object({
        password: (0, joi_password_complexity_1.default)()
            .required()
            .label("Password")
            .messages({
            'string.pattern.base': 'Password must meet complexity requirements',
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        }),
    });
    return schema.validate(data, { abortEarly: false });
};
exports.passwordValidate = passwordValidate;
const updateValidate = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().label("Name"),
        email: joi_1.default.string().email().label("Email"),
        oldPassword: joi_1.default.string().label("Old Password"),
        newPassword: joi_1.default.string().label("New Password")
    }).or('name', 'email', 'oldPassword', 'newPassword');
    return schema.validate(data, { abortEarly: false });
};
exports.updateValidate = updateValidate;
