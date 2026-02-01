import nodemailer from 'nodemailer';
import { mailConfig } from '@/config/mail';
import { otpTemplate } from './templates/otp.template';

const transporter = nodemailer.createTransport(mailConfig);

export const mailService = {
  async sendOTP(email: string, otp: string, type: 'RESET' | 'VERIFY') {
    const isReset = type === 'RESET';
    const subject = isReset ? "Reset Your Password" : "Verify Your Email";
    
    // Get the HTML from our template function
    const html = otpTemplate(otp, isReset);

    await transporter.sendMail({
      from: mailConfig.from,
      to: email,
      subject,
      html,
    });
  },
};