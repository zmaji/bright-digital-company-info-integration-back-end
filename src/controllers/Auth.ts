import type { User } from '../typings/User';
import type { ExchangeProof } from '../typings/ExchangeProof';
import type { HubToken } from '../typings/HubToken';

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { exchangeTokens } from '../helpers/hubspot/exchangeTokens';
import { storeTokens } from '../helpers/database/storeTokens';
import { getCurrentPortal } from '../helpers/hubspot/getCurrentPortalId';
import logger from '../utils/Logger';

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_REDIRECT_URL = process.env.HUBSPOT_REDIRECT_URL;

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const generateAuthToken = (user: User): string => {
  return jwt.sign({
    id: user.id,
    emailAddress: user.emailAddress,
    roles: user.roles,
  }, user.secret);
}

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
          return generateAuthToken(existingUser);
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

const authenticateHubSpotUser = async (hubSpotCode: string): Promise<HubToken | null> => {
  try {
    if (HUBSPOT_CLIENT_ID && HUBSPOT_CLIENT_SECRET && HUBSPOT_REDIRECT_URL) {
      const params: ExchangeProof = {
        grant_type: 'authorization_code',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: HUBSPOT_REDIRECT_URL,
        code: hubSpotCode,
      };
      const hubToken: HubToken | null = await exchangeTokens(params);

      if (hubToken) {
        const portalId: number | null = await getCurrentPortal(hubToken.access_token);

        if (portalId) {
          await storeTokens(hubToken, portalId);
        } else {
          logger.error('Could not store Hubtoken, no portal ID available');
        }
      } else {
        logger.error('Could not retrieve HubToken');
      }

      return hubToken;
    } else {
      logger.error('App environment variables are missing or incorrect');

      return null;
    }
  } catch (error) {
    throw error;
  }
};

const authController = {
  authenticateUser,
  authenticateHubSpotUser,
};

export default authController;
