import type { PropertyField } from '../typings/PropertyField';

import axios, { AxiosResponse } from 'axios';
import logger from '../utils/Logger';
import { hubSpotProperties } from '../data/hubSpotProperties';

const getPropertyFields = async (): Promise<PropertyField[]> => {
    const propertyFields: PropertyField[] = hubSpotProperties
    return propertyFields;
}

const createProperties = async (accessToken: string): Promise<any | null> => {
    try {
      logger.info(`Creating HubSpot properties..`);
      const propertyFields: PropertyField[] = await getPropertyFields();
  
      const payload = {
        inputs: propertyFields
      };
  
      // TODO: type
      const response: AxiosResponse<any> = await axios.post('https://api.hubapi.com/crm/v3/properties/company/batch/create', payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      // TODO: type
      const result: any = response.data.results;

      console.log('BATCH CREATE RESULT');
      console.log('BATCH CREATE RESULT');
      console.log('BATCH CREATE RESULT');
      console.log('BATCH CREATE RESULT');
      console.log(result);
  
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
};

export default propertiesController;
