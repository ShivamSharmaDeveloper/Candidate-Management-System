/**
 * Email Service — Nodemailer
 * Sends activation emails to candidates
 */

const nodemailer = require('nodemailer');

// ─── Transporter ─────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send candidate activation email
 * @param {string} toEmail - Recipient email
 * @param {string} firstName - Candidate first name
 * @param {string} activationToken - UUID token
 */
const sendActivationEmail = async (toEmail, firstName, activationToken) => {
  const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;

  const mailOptions = {
    from: `"Candidate Management System" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Activate Your Candidate Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: #1976d2; padding: 30px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 24px; }
          .body { padding: 30px; }
          .body p { color: #444; line-height: 1.6; }
          .btn { display: inline-block; margin: 20px 0; padding: 14px 32px; background: #1976d2; color: #fff !important; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; }
          .footer { padding: 20px 30px; background: #f9f9f9; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Candidate Management System</h1>
          </div>
          <div class="body">
            <p>Hi <strong>${firstName}</strong>,</p>
            <p>Thank you for registering! Please click the button below to activate your account:</p>
            <a href="${activationLink}" class="btn">Activate My Account</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #1976d2;">${activationLink}</p>
            <p>This link will expire in <strong>24 hours</strong>.</p>
            <p>If you did not register, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Candidate Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendActivationEmail };
