import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendContactNotification = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'Ohenekobi98@gmail.com';

  const mailOptions = {
    from: `"Scanty's Closet" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Transmission: ${data.subject}`,
    text: `You have received a new message from ${data.name} (${data.email}):\n\nSubject: ${data.subject}\n\nMessage: ${data.message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #111; color: #fff; padding: 20px; border-radius: 20px; border: 1px solid #dc2626;">
        <h2 style="color: #dc2626; text-transform: uppercase; font-style: italic;">New Transmission Detected</h2>
        <p style="color: #999; font-size: 12px; text-transform: uppercase;">Sender Information</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-transform: uppercase;">Message Details</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Content:</strong></p>
        <div style="background-color: #222; padding: 15px; border-radius: 10px; border-left: 4px solid #dc2626;">
          ${data.message.replace(/\n/g, '<br />')}
        </div>
        <p style="margin-top: 30px; font-size: 10px; color: #555; text-align: center;">Scanty's Closet — Punctuality is the soul of business.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // We don't throw here to avoid blocking the DB save, but we log it.
    return null;
  }
};
