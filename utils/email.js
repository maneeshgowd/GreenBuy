const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url, otp) {
    this.to = user.email;
    this.userName = user.name;
    this.url = url;
    this.OTP = otp;
    this.from = `GreenBuy <${process.env.EMAIL_FROM}>`;
  }

  newCreateTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PROT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      userName: this.userName,
      url: this.url,
      otp: this.OTP,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    await this.newCreateTransport().sendMail(mailOptions);
  }

  async sendOTP() {
    await this.send("welcome", "Welcome to the GreenBuy family!");
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Your password reset token (valid for only 10 minutes)");
  }
};
