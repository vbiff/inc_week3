"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setup_app_1 = require("./setup-app");
const mongo_db_1 = require("./db/mongo.db");
const http_statuses_1 = require("./core/types/http-statuses");
const app = (0, express_1.default)();
let dbConnectPromise = null;
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dbConnectPromise) {
        dbConnectPromise = (0, mongo_db_1.runDb)();
    }
    try {
        yield dbConnectPromise;
    }
    catch (error) {
        // Reset so the next request (possibly a retry) attempts a fresh
        // connection instead of being stuck forever on this warm serverless
        // instance, since a failed connect used to resolve silently and never
        // get retried.
        dbConnectPromise = null;
        console.error("Database connection failed:", error);
        res.sendStatus(http_statuses_1.HttpStatuses.SERVERERROR_500);
        return;
    }
    next();
}));
(0, setup_app_1.setupApp)(app);
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}
exports.default = app;
