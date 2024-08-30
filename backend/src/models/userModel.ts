import mongoose, { ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';
const userSchema =new mongoose.Schema({
    name:
    {
        type:String , 
        required: true
    },
    email:
    {
        type:String ,
        required: true
    },
    password:{
        type:String ,
        required: true
    },
},{
    timestamps:true
});


export const userModel = mongoose.model("users",userSchema);
export const generateAuthToken = function(id:any){
    const token = jwt.sign({id}, process.env.JWTPRIVATEKEY!);
    return token;
}

export const loginValidate = (data:any) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .label("Email")
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),
        password: passwordComplexity()
            .required()
            .label("Password")
            .messages({
                'string.pattern.base': 'Password must meet complexity requirements',
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            })
    });

    return schema.validate(data , { abortEarly: false });
}

export const registerValidate = (data:any) => {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .label("Name")
            .messages({
                'string.empty': 'Name is required',
                'any.required': 'Name is required'
            }),
        email: Joi.string()
            .email()
            .required()
            .label("Email")
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),
        password: passwordComplexity()
            .required()
            .label("Password")
            .messages({
                'string.pattern.base': 'Password must meet complexity requirements',
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            }),
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('password'))
            .label("Confirm Password")
            .messages({
                'any.only': 'Confirm Password does not match Password',
                'string.empty': 'Confirm Password is required',
                'any.required': 'Confirm Password is required'
            })
    });

    return schema.validate(data,{ abortEarly: false });
}

export const passwordValidate = (data:any) => {
    const schema = Joi.object({
        password: passwordComplexity()
            .required()
            .label("Password")
            .messages({
                'string.pattern.base': 'Password must meet complexity requirements',
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            }),
    });
    return schema.validate(data,{abortEarly:false});
}

export const updateValidate = (data: any) => {
    const schema = Joi.object({
        name: Joi.string().label("Name"),
        email: Joi.string().email().label("Email"),
        oldPassword: Joi.string().label("Old Password"),
        newPassword: Joi.string().label("New Password")
    }).or('name', 'email', 'oldPassword', 'newPassword');

    return schema.validate(data, { abortEarly: false });
};
