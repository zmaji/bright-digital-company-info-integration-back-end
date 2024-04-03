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
      console.error('No result received');

      return null;
    }
  } catch (error) {
    logger.error('Something went wrong retrieving properties', error);
    throw error;
  }
};

const createProperties = async (accessToken: string, objectType: string, missingProperties: PropertyField[]): Promise<PropertyField[] | null> => {
  logger.info(`Creating HubSpot properties..`);

  console.log(missingProperties);

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

// const createProperties = async (accessToken: string, objectType: string, missingProperties: PropertyField[]): Promise<PropertyField[] | null> => {
//   logger.info(`Creating HubSpot properties..`);

//   const data = {
//     inputs: missingProperties,
//   }

//   return axios({
// 		method: 'post',
// 		url: `https://api.hubapi.com/crm/v3/properties/${objectType}/batch/create`,
// 		headers: {
// 			'Authorization': `Bearer ${accessToken}`,
//       'Content-Type': 'application/json'
// 		},
//     data: data
// 	}).then((response) => {
//     console.log(`Succesfully created properties`)
//     if (response.data) {
//       return response.data.results
//     }
//   }).catch((error) => {
//       console.log(`Error while creating properties: ${error}`)
//       if (error.response) {
//         console.log('Server responded with status code:', error.response.status);
//         console.log('Response data:', error.response.data);
//       } else if (error.request) {
//         console.log('No response received:', error.request);
//       } else {
//         console.log('Error creating request:', error.message);
//       }
//       return false
//   })
// }

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