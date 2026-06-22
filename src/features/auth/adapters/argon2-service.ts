import { AppConfig } from "../../../core/config/config";
import * as argon2 from "argon2";

const pepper: string = AppConfig.PASSWORD_PEPPER;

export const argon2Service = {
  async generateHash(password: string) {
    return await argon2.hash(password + pepper, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 2,
    });
  },
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password + pepper);
  },

  async reHash(password: string, hash: string): Promise<string | null> {
    let newHash = null;
    if (
      argon2.needsRehash(hash, {
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 2,
      })
    ) {
      newHash = await argon2.hash(password + pepper, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 2,
      });
    }
    return newHash;
  },
};
