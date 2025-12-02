import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  try {
    if (!config.email.user || !config.email.password) {
      console.log("⚠️ Email credentials not configured. Skipping email.");
      return;
    }

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Welcome to CourseMaster!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome to CourseMaster!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for joining CourseMaster, your gateway to professional learning and development.</p>
          <p>Get started by browsing our course catalog and enrolling in courses that interest you.</p>
          <p>Happy Learning!</p>
          <p style="color: #6B7280; font-size: 14px;">
            Best regards,<br>
            The CourseMaster Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendEnrollmentEmail = async (
  email: string,
  name: string,
  courseTitle: string
): Promise<void> => {
  try {
    if (!config.email.user || !config.email.password) {
      return;
    }

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: `Enrollment Confirmation - ${courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Enrollment Confirmed!</h1>
          <p>Hi ${name},</p>
          <p>You have successfully enrolled in <strong>${courseTitle}</strong>.</p>
          <p>Access your course from your dashboard and start learning today!</p>
          <p style="color: #6B7280; font-size: 14px;">
            Best regards,<br>
            The CourseMaster Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Enrollment email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
