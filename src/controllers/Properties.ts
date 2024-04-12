import type { PropertyField } from '../typings/PropertyField';

import axios, { AxiosResponse } from 'axios';
import logger from '../utils/Logger';

const getProperties = async (accessToken: string, objectType: string): Promise<PropertyField[] | null> => {
  logger.info(`Getting HubSpot properties..`);

  try {
    const response: AxiosResponse = await axios.get(
        `https://api.hubapi.com/crm/v3/properties/${objectType}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result: PropertyField[] | null = response.data;

    if (result) {
      logger.info('Successfully retrieved properties');
      return result;
    } else {
      logger.info('No properties retrieved');
      return null;
    }
  } catch (error) {
    logger.error('Something went wrong retrieving properties', error);
    throw error;
  }
};

// eslint-disable-next-line
const createProperties = async (accessToken: string, objectType: string, missingProperties: PropertyField[]): Promise<PropertyField[] | null> => {
  logger.info(`Creating HubSpot properties..`);

  try {
    const payload = {
      inputs: missingProperties,
    };

    const response: AxiosResponse = await axios.post(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/batch/create`,
        payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result: PropertyField[] = response.data.results;

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

// eslint-disable-next-line
const deleteProperty = async (accessToken: string, propertyName: string, objectType: string): Promise<PropertyField[] | null> => {
  try {
    logger.info(`Trying to delete property: ${propertyName}..`);

    const response: AxiosResponse = await axios.delete(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/${propertyName}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result: PropertyField[] = response.data;

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
