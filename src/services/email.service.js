import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Your E-Commerce <onboarding@resend.dev>",
      to: [to],
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent:", data?.id);

    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};