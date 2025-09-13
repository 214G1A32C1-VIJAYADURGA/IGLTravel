"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectDb_1 = __importDefault(require("./utils/connectDb"));
const app_1 = __importDefault(require("./app"));
const PORT = Number(process.env.PORT) || 8080;
(0, connectDb_1.default)().then(() => {
    app_1.default.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
