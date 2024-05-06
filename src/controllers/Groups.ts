import axios, { AxiosError, AxiosResponse } from 'axios';
import logger from '../utils/Logger';
import { Group } from '../typings/Group';

const getGroup = async (accessToken: string, groupName: string, objectType: string): Promise<Group | null> => {
  logger.info(`Getting a ${objectType} group with name ${groupName}..`);

  try {
    const response: AxiosResponse<Group> = await axios.get(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/groups/${groupName}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result: Group = response.data;

    if (result) {
      logger.info(`Successfully retrieved ${objectType} group with name ${groupName}`);

      return result;
    } else {
      logger.info(`No group retrieved with name ${groupName}`);

      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.status === 404) {
        logger.warn(`No existing ${objectType} group with name ${groupName} found..`);

        return null;
      }
    }
    logger.error(`Something went wrong getting a ${objectType} group with name ${groupName}`, error);
    throw error;
  }
};

const createGroup = async (accessToken: string, groupName: string, objectType: string): Promise<Group | null> => {
  logger.info(`Trying to create a ${objectType} group with name ${groupName}..`);

  try {
    const payload = {
      'name': groupName,
      'label': 'Company.info integration',
      'displayOrder': -1,
    };

    const response: AxiosResponse<Group> = await axios.post(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/groups`,
        payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result: Group = response.data;

    if (result) {
      logger.info(`Successfully created a ${objectType} group`);

      return result;
    } else {
      logger.error('No result received');

      return null;
    }
  } catch (error) {
    logger.error(`Something went wrong creating a ${objectType} group`, error);
    throw error;
  }
};

// const deleteGroup = async (accessToken: string, groupName: string, objectType: string): Promise<Group | null> => {
//   try {
//     logger.info(`Trying to delete a ${objectType} group with name ${groupName}..`);

//     const existingProperties = await propertiesController.getProperties(accessToken, objectType);

//     if (existingProperties) {
//       // eslint-disable-next-line
//       await Promise.all(existingProperties.map((property: any) =>
//         propertiesController.deleteProperty(accessToken, property.name, objectType),
//       ));
//     }

//     const response: AxiosResponse<Group> = await axios.delete(
//         `https://api.hubapi.com/crm/v3/properties/${objectType}/${groupName}`, {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//           },
//         });

//     const result: Group = response.data;

//     if (result) {
//       logger.info(`Successfully deleted a ${objectType} group with name ${groupName}`);

//       return result;
//     } else {
//       logger.error('No result received');

//       return null;
//     }
//   } catch (error) {
//     logger.error(`Something went wrong deleting a ${objectType} group with name ${groupName}`, error);
//     throw error;
//   }
// };

const groupsController = {
  createGroup,
  getGroup,
  // deleteGroup,
};

export default groupsController;
