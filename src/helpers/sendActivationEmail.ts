// import logger from '../utils/Logger';
// import SparkPost from 'sparkpost';
// import dotenv from 'dotenv';

// dotenv.config();

// const SPARKPOST_API_KEY = process.env.SPARKPOST_API_KEY;
// const sparkpostClient = new SparkPost(SPARKPOST_API_KEY, { origin: "https://api.eu.sparkpost.com:443" });

// export const sendActivationEmail = async (email: string, activationToken: string) => {
//   logger.info(`Sending activation email to ${email}`);

//   try {
//     await sparkpostClient.transmissions.send({
//       content: {
//         from: 'noreply@brightdigital.dev',
//         subject: 'Activate Your Account',
//         html: `<p>Your activation code is: ${activationToken}</p>`,
//       },
//       recipients: [{ address: email }],
//     });
//   } catch (error) {
//     logger.error('Error sending email verification:', error);
//     throw error;
//   }
// };
