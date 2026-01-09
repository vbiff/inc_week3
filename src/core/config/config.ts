import { config } from "dotenv";

config();

export const AppConfig = {
  MONGO_URL: process.env.MONGO_URL as string,
  SECRET: process.env.SECRET as string,
  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER as string,
  EMAIL_LOGIN: process.env.EMAIL_LOGIN as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
};
