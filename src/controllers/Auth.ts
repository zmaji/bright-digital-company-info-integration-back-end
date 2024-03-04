import type { User } from '../typings/User';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

import exchangeTokens from '../helpers/hubspot';

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID 
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_REDIRECT_URL = process.env.HUBSPOT_REDIRECT_URL;

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

 const authenticateUser = async (emailAddress: string, password: string): Promise<string | null> => {
    try {
      if (emailAddress && password) {
        const existingUser: User | null = await prisma.user.findUnique({
            where: {
                emailAddress: emailAddress,
            },
        });

        if (existingUser) {
          const matchedPassword = bcrypt.compareSync(password, existingUser.password);
  
          if (matchedPassword) {
            return jwt.sign({
              id: existingUser.id,
              emailAddress: existingUser.emailAddress,
              roles: existingUser.roles,
            }, existingUser.secret);
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  const authenticateHubSpotUser = async (code: string): Promise<string | null> => {
    try {
      if (code && HUBSPOT_CLIENT_ID && HUBSPOT_CLIENT_SECRET && HUBSPOT_REDIRECT_URL) {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', HUBSPOT_CLIENT_ID);
        params.append('client_secret', HUBSPOT_CLIENT_SECRET);
        params.append('redirect_uri', HUBSPOT_REDIRECT_URL);
        params.append('code', code);
      }
      const token = await exchangeTokens(null, params, client);
      console.log(`Access token is ${token}`)
      // if (token.message) {
      //   console.error(`Error while retrieving tokens: ${token.message}`)
      //   return res.redirect(`/error?msg=${token.message}`);
      // }
      // return res.redirect(`/success`);
    } catch (error) {
      throw error;
    }
  };

  const authController = {
    authenticateUser,
    authenticateHubSpotUser,
  };
  
  export default authController;
  