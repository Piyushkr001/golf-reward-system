import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, token: string) {
  const verifyLink = `${APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"PlayLance" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <h2>Welcome to PlayLance!</h2>
      <p>Click the button below to verify your email address:</p>
      <a href="${verifyLink}" style="display:inline-block;padding:12px 24px;background-color:#7C3AED;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">Verify Email</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"PlayLance Security" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your PlayLance password. This link will expire in 1 hour.</p>
      <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background-color:#EF4444;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">Reset Password</a>
      <p>If you didn't request a password reset, please ignore this email or contact support.</p>
    `,
  });
}
