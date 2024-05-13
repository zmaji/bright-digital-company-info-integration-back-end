import axios, { AxiosResponse } from 'axios';
import logger from '../../utils/Logger';

export const getCurrentPortal = async (accessToken: string): Promise<number | null> => {
  logger.info(`Retrieving portal ID based on access token..`);
  try {
    const response: AxiosResponse = await axios.get(`https://api.hubapi.com/integrations/v1/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const portalId: number = response.data.portalId;
    logger.success(`Successfully retrieved portal ID: ${portalId}`);

    return portalId;
  } catch (error) {
    logger.info(`Could not get Portal ID: ${error}..`);

    return null;
  }
};
