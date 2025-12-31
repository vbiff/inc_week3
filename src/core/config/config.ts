import { config } from "dotenv";

config();

export const AppConfig = {
  MONGO_URL: process.env.MONGODB_URI as string,
  SECRET: process.env.SECRET as string,
};
