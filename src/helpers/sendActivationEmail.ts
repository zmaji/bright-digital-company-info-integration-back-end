import logger from '../utils/Logger';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const ACTIVATION_SENDER_ADDRESS = process.env.ACTIVATION_SENDER_ADDRESS;
const ACTIVATION_SENDER_PASSWORD = process.env.ACTIVATION_SENDER_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ACTIVATION_SENDER_ADDRESS,
    pass: ACTIVATION_SENDER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendActivationEmail = async (email: string, activationToken: string) => {
  logger.info(`Sending activation email to ${email}`);

  try {
    await transporter.sendMail({
      from: 'maurice@brightdigital.com',
      to: email,
      subject: 'Activate Your Account',
      html: `<p>Your activation code is: ${activationToken}></p>`,
    });
  } catch (error) {
    logger.error('Error sending email verification:', error);
    throw error;
  }
};
