import type { HubToken } from '../../typings/HubToken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const storeTokens = async (tokens: HubToken, portalId: number): Promise<HubToken | false> => {
  console.log('Checking if portal ID is already present..');
  try {
    const existingToken = await prisma.hubToken.findUnique({
      where: {
        portal_id: portalId,
      },
    });

    if (existingToken) {
      console.log(`Record with portal ID ${portalId} already exists, updating record instead..`);
      const updatedToken: HubToken = await prisma.hubToken.update({
        where: {
          id: existingToken.id,
        },
        data: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: tokens.expires_in,
          updated_at: new Date(),
        },
      });
      console.log('Tokens updated successfully!');

      return updatedToken;
    } else {
      console.log('Record not found, creating a new record..');
      const newToken: HubToken = await prisma.hubToken.create({
        data: {
          portal_id: portalId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: tokens.expires_in,
        },
      });
      console.log('New tokens created successfully!');

      return newToken;
    }
  } catch (error) {
    console.error('Error while storing tokens:', error);

    return false;
  }
};

