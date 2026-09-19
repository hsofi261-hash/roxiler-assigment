"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthControll_1 = require("../controller/AuthControll");
const router = express_1.default.Router();
// Signup route
router.post('/signup', AuthControll_1.signup);
router.post('/login', AuthControll_1.login);
router.post('/logout', AuthControll_1.verifyToken, AuthControll_1.logout);
router.put('/password', AuthControll_1.verifyToken, AuthControll_1.updatePassword);
router.get('/check', AuthControll_1.verifyToken, AuthControll_1.checkAuth);
exports.default = router;
