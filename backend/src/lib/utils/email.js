import nodemailer from 'nodemailer';
import { env } from '@/lib/config.js';
import { mainLogger } from '@/lib/logger/winston.js';

let transporter;

export const initializeEmailTransporter = async () => {
  try {
    if (env.NODE_ENV === 'production' && env.SMTP_HOST && env.SMTP_PORT) {
      transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT),
        secure: env.SMTP_SECURE === 'true',
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }
  } catch (error) {
    mainLogger.error('Failed to initialize email transporter:', error);
    throw error;
  }
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} - Nodemailer info object
 */

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!transporter) {
      await initializeEmailTransporter();
    }

    const mailOptions = {
      from: env.EMAIL_FROM || '"Flexxy App" <noreply@flexxy.com>',
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (env.NODE_ENV !== 'production') {
      mainLogger.info(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    mainLogger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send a password reset email
 * @param {string} to - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Nodemailer info object
 */

export const sendPasswordResetEmail = async (to, resetToken, name) => {
  const resetUrl = `${env.CLIENT_BASE_URL}/reset-password/${resetToken}`;
  
  const subject = 'Password Reset Request';
  
  const text = `Hello ${name},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nRegards,\nThe Flexxy Team`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested a password reset. Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
      </div>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Regards,<br>The Flexxy Team</p>
    </div>
  `;
  
  return sendEmail({ to, subject, text, html });
};