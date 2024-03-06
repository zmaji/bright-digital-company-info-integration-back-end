import axios, { AxiosResponse } from 'axios';

import logger from '../../utils/Logger';
import { propertyOverview } from './propertyOverview';

// TODO: What kind of HubToken is being sent?
export const createProperties = async (token: string): Promise<any | null> => {
  try {
    logger.info(`Trying to create properties`);

      // TODO: Why is token being sent?
      // inputs: await propertyOverview(token),
    const propertyFields = await propertyOverview();

    const data = {
      inputs: propertyFields
    };

    // TODO: type
    const response: AxiosResponse<any> = await axios.post('https://api.hubapi.com/crm/v3/properties/company/batch/create', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    // TODO: type
    const result: any = response.data.results;

    if (result) {
      logger.info('Successfully created properties');
      return result;
    } else {
      console.error('No result received');
      return null;
    }
  } catch (error) {
    logger.error('Something went wrong creating properties', error);
    throw error;
  }
};
