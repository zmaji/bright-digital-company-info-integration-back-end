import type { HubToken } from '../../typings/HubToken';

import { PrismaClient } from '@prisma/client';
import logger from '../../utils/Logger';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const storeTokens = async (tokens: HubToken, portalId: number): Promise<any> => {
  logger.info('Checking if portal ID is already present..');
  try {
    const existingToken = await prisma.hubToken.findUnique({
      where: {
        portalId: portalId,
      },
    });

    if (existingToken) {
      logger.info(`Record with portal ID ${portalId} already exists, updating record instead..`);
      const updatedToken = await prisma.hubToken.update({
        where: {
          id: existingToken.id,
        },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
          updatedAt: new Date(),
        },
      });
      logger.info('Tokens updated successfully!');

      return updatedToken;
    } else {
      logger.info('Record not found, creating a new record..');
      const newToken = await prisma.hubToken.create({
        data: {
          portalId: portalId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
        },
      });
      
      logger.info('New tokens created successfully!');

      return newToken;
    }
  } catch (error) {
    logger.error('Error while storing tokens:', error);

    return false;
  }
};

