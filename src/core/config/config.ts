import { config } from "dotenv";

config();

export const AppConfig = {
  MONGO_URL: process.env.MONGO_URL as string,
  SECRET: process.env.SECRET as string,
  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER as string,
};
