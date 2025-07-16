import nodemailer from 'nodemailer';
import { emailTemplate } from './emailTemplate.js';
import dotenv from 'dotenv'
import { resetPasswordEmailTemplate } from './resetEmailTemplate.js';
dotenv.config({})
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail or another email provider
  auth: {
    user: process.env.SEND_EMAIL_ADDRESS , 
    pass: process.env.SEND_EMAIL_PASSWORD ,
    
  },
  tls: {
    rejectUnauthorized: false // Allow unauthorized access to the server
  },
});

// Send an email
async function sendEmail(email, subject, url, type = "confirm",  name = "User") {
  try {
    const template =
      type === "reset" ? resetPasswordEmailTemplate(url, name) : emailTemplate(url, name);

    const info = await transporter.sendMail({
      from: 'Final Proj ITI',
      to: email,
      subject: subject,
      text: '',
      html: template,
    });

    console.log('📧 Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Error occurred while sending email:', error);
  }
}
export { sendEmail };

