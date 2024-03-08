import type { PropertyField } from '../typings/PropertyField';

import axios, { AxiosResponse } from 'axios';
import logger from '../utils/Logger';
import { generatePropertyFields } from '../helpers/hubspot/hubSpotProperties';

const groupName = 'company_info_integration';

const getProperties = async (accessToken: string): Promise<any | null> => {
  try {
    logger.info(`Getting HubSpot properties..`);

    // TODO: type
    const response: AxiosResponse<any> = await axios.get(
        'https://api.hubapi.com/crm/v3/properties/company/',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    // TODO: type
    const result: any = response.data.results;

    if (result) {
      logger.info('Successfully retrieved properties');

      return result;
    } else {
      console.error('No result received');

      return null;
    }
  } catch (error) {
    logger.error('Something went wrong retrieving properties', error);
    throw error;
  }
};

const createProperties = async (accessToken: string): Promise<any | null> => {
  try {
    logger.info(`Creating HubSpot properties..`);
    const propertyFields: PropertyField[] = await generatePropertyFields(groupName);

    const payload = {
      inputs: propertyFields,
    };

    // TODO: type
    const response: AxiosResponse<any> = await axios.post(
        'https://api.hubapi.com/crm/v3/properties/company/batch/create',
        payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
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

const propertiesController = {
  createProperties,
  getProperties,
};

export default propertiesController;
