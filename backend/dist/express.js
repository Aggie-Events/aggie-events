"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// server.js
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const cors = require("cors");
app.use(cors());
