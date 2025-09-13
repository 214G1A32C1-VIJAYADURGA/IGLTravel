import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async (options: EmailOptions) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials not configured");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_USER.includes("ethereal.email") ? "smtp.ethereal.email" : "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
    tls: {
      rejectUnauthorized: true,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}: ${info.messageId}`);
    if (process.env.EMAIL_USER.includes("ethereal.email")) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (error: unknown) {
    console.error("Email sending error:", error);
    throw new Error(`Failed to send email: ${(error as Error).message}`);
  }
};

export default sendEmail;