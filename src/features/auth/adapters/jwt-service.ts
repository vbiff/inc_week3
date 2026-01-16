import { AppConfig } from "../../../core/config/config";
import jwt from "jsonwebtoken";

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ id: userId }, AppConfig.SECRET, { expiresIn: "10s" });
  },

  async createRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ id: userId }, AppConfig.REFRESH_SECRET, {
      expiresIn: "20s",
    });
  },

  async verifyAccessToken(token: string): Promise<{ id: string } | null> {
    try {
      return jwt.verify(token, AppConfig.SECRET) as { id: string }; //WTF UserID and id????
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async verifyRefreshToken(token: string): Promise<{ id: string } | null> {
    try {
      return jwt.verify(token, AppConfig.REFRESH_SECRET) as { id: string };
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
