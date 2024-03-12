import type { PropertyField } from '../typings/PropertyField';

import axios, { AxiosResponse } from 'axios';
import logger from '../utils/Logger';
import { generatePropertyFields } from '../helpers/hubspot/hubSpotProperties';

const groupName = 'company_info_integration';
const objectType = 'company';

// TODO: Type
const getProperties = async (accessToken: string): Promise<any | null> => {
  try {
    logger.info(`Getting HubSpot properties..`);

    // TODO: type
    const response: AxiosResponse<any> = await axios.get(
        `https://api.hubapi.com/crm/v3/properties/${objectType}`,
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
        `https://api.hubapi.com/crm/v3/properties/${objectType}/batch/create`,
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


// TODO: READ ONLY PROPERTIES
// TODO: type
const deleteProperty = async (accessToken: string, propertyName: string): Promise<any | null> => {
  try {
    logger.info(`Trying to delete property: ${propertyName}..`); 

    // TODO: type
    const response: AxiosResponse<any> = await axios.delete(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/${propertyName}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result = response.data;

    if (result) {
      logger.info(`Successfully deleted a HubSpot property: ${propertyName}`);

      return result;
    } else {
      logger.error('No result received');

      return null;
    }
  } catch (error) {
    logger.error(`Something went wrong deleting a HubSpot property: ${propertyName}`, error);
    throw error;
  }
};

const propertiesController = {
  createProperties,
  getProperties,
  deleteProperty,
};

export default propertiesController;
