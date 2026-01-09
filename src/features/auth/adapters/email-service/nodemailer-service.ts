import nodemailer from "nodemailer";

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      service: "Yandex",
      auth: {
        user: "m.bog.inc@yandex.com",
        pass: "hobpecwqlrldokpn",
      },
    });

    const info = await transporter.sendMail({
      from: '"Mikhail" <m.bog.inc@yandex.com>',
      to: email,
      subject: "Registration letter",
      html: template(code),
    });
    console.log(info);
    return !!info;
  },
};
