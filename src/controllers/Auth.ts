import type { User } from '../typings/User';
import type { ExchangeProof } from '../typings/ExchangeProof';
import type { HubToken } from '../typings/HubToken';

import prisma from '../database/Client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { exchangeTokens } from '../helpers/hubspot/exchangeTokens';
import { storeHubTokens } from '../helpers/database/storeHubToken';
import { getCurrentPortal } from '../helpers/hubspot/getCurrentPortalId';
import logger from '../utils/Logger';
import dotenv from 'dotenv';

dotenv.config();

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_REDIRECT_URL = process.env.HUBSPOT_REDIRECT_URL;

const generateAuthToken = (user: User): string => {
  return jwt.sign({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    roles: user.roles,
    hubSpotPortalId: user.hubSpotPortalId,
  }, user.secret);
};

const refreshAccessToken = async (portalId: number, refreshToken: string): Promise<HubToken | null> => {
  try {
    if (HUBSPOT_CLIENT_ID && HUBSPOT_CLIENT_SECRET && HUBSPOT_REDIRECT_URL) {
      const params: ExchangeProof = {
        grant_type: 'refresh_token',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: HUBSPOT_REDIRECT_URL,
        refresh_token: refreshToken,
      };

      const hubToken: HubToken | null = await exchangeTokens(params);

      if (hubToken) {
        await storeHubTokens(hubToken, portalId);

        return hubToken;
      } else {
        logger.info('Hubtoken could not be retrieved');

        return null;
      }
    } else {
      logger.error('HubSpot client configuration is incomplete');

      return null;
    }
  } catch (error) {
    logger.error('Error refreshing access token:', error);
    throw error;
  }
};

const isTokenExpired = async (hubToken: HubToken) => {
  if (hubToken.updated_at && hubToken.expires_in) {
    return Date.now() >= Date.parse(hubToken.updated_at.toString()) + Number(hubToken.expires_in) * 1000;
  } else {
    logger.info('No hubtoken retrieved');

    return false;
  }
};

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
          logger.success('User authenticated successfully');

          return generateAuthToken(existingUser);
        } else {
          logger.error('Wrong password provided');

          return 'Email address and password did not match.';
        }
      } else {
        logger.error(`No user with email address ${emailAddress} found`);

        return `User with email address ${emailAddress} does not exist.`;
      }
    } else {
      logger.error('Email address or password not provided');

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
          await storeHubTokens(hubToken, portalId);
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

export const retrieveHubToken = async (portalId: number): Promise<HubToken | null> => {
  logger.info('Retrieving HubSpot user linked to current user..');
  try {
    const hubToken: HubToken | null = await prisma.hubToken.findUnique({
      where: {
        portal_id: portalId,
      },
    });

    if (hubToken) {
      logger.success(`Retrieved HubToken from user with portal id ${portalId}`);

      if (await isTokenExpired(hubToken)) {
        const newToken: HubToken | null = await refreshAccessToken(portalId, hubToken.refresh_token);

        if (newToken && newToken.access_token) {
          logger.success('Successfully refreshed access token..');

          return newToken;
        }
      }
    }

    return hubToken;
  } catch (error) {
    logger.error('Error while retrieving HubSpot token:', error);

    return null;
  }
};

const authController = {
  generateAuthToken,
  authenticateUser,
  authenticateHubSpotUser,
  retrieveHubToken,
  refreshAccessToken,
  isTokenExpired,
};

export default authController;
