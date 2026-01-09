import { AppConfig } from "../../../core/config/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ id: userId }, AppConfig.SECRET, { expiresIn: "5m" });
  },

  async verifyToken(token: string): Promise<{ id: string } | null> {
    try {
      return jwt.verify(token, AppConfig.SECRET) as { id: string }; //WTF UserID and id????
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async decodeToken(token: string): Promise<string | JwtPayload | null> {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
