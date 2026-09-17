"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.BACKEND_PORT || 7000;
app.use(express_1.default.json());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
