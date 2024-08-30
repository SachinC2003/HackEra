"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatejwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticatejwt = (req, res, next) => {
    var _a;
    try {
        console.log("hiii");
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).send({ success: false, error: new Error("No token exists"), message: "No token exists" });
        const { id } = jsonwebtoken_1.default.verify(token, process.env.JWTPRIVATEKEY);
        req.headers.id = id;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).send({ success: false, error: err, message: "Authentication failed" });
    }
};
exports.authenticatejwt = authenticatejwt;
