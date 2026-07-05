import nodemailer from "nodemailer";
import { AppConfig } from "../../../../core/config/config";

export class NodemailerService {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "Yandex",
      auth: {
        user: AppConfig.EMAIL_LOGIN,
        pass: AppConfig.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"Mikhail" <m.bog.inc@yandex.com>',
      to: email,
      subject: "Registration letter",
      html: template(code),
    });
    console.log(info);
  }
}
