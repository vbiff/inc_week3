"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.AppConfig = {
    MONGO_URL: process.env.MONGO_URL,
    SECRET: process.env.SECRET,
    PASSWORD_PEPPER: process.env.PASSWORD_PEPPER,
    EMAIL_LOGIN: process.env.EMAIL_LOGIN,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
};
