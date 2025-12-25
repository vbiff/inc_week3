import bcrypt from "bcrypt";

export const bcryptService = {
  async generateHash(password: string) {
    const salt: string = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  },
};
