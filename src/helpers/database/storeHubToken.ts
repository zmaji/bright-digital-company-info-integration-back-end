import type { HubToken } from '../../typings/HubToken';

import prisma from '../../database/Client';
import logger from '../../utils/Logger';

export const storeHubTokens = async (tokens: HubToken, portalId: number): Promise<HubToken | null> => {
  logger.info('Checking if portal ID is already present..');
  try {
    const existingToken = await prisma.hubToken.findUnique({
      where: {
        portal_id: portalId,
      },
    });

    if (existingToken) {
      logger.info(`Record with portal ID ${portalId} already exists, updating record instead..`);
      const updatedToken = await prisma.hubToken.update({
        where: {
          id: existingToken.id,
        },
        data: {
          portal_id: portalId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: tokens.expires_in,
          updated_at: new Date(),
        },
      });
      logger.info('Tokens updated successfully!');

      return updatedToken;
    } else {
      logger.info('Record not found, creating a new record..');
      const newToken = await prisma.hubToken.create({
        data: {
          portal_id: portalId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: tokens.expires_in,
          updated_at: new Date(),
        },
      });

      logger.info('New tokens created successfully!');

      return newToken;
    }
  } catch (error) {
    logger.error('Error while storing tokens:', error);

    return null;
  }
};

