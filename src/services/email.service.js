import nodemailer from "nodemailer";
import { google } from "googleapis";
import config from "../config/config.js";

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: config.GOOGLE_REFRESH_TOKEN,
});

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email connection error:", error);
  } else {
    console.log("Email server is ready");
  }
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    transporter.set("oauth2", {
      user: config.GOOGLE_USER,
      accessToken: accessToken.token,
    });

    const info = await transporter.sendMail({
      from: `"Your E-Commerce" <${config.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);

    return info;

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};