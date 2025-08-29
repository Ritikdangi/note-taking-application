import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Ensure env vars are loaded before creating the transporter
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS is not set in environment");
  }

  await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`,
    to,
    subject,
    text,
  });
};
