import axios, { AxiosResponse } from 'axios';
import logger from '../utils/Logger';
import { Group } from '../typings/Group';
import propertiesController from './Properties';

const getGroup = async (accessToken: string, groupName: string, objectType: string): Promise<Group | null> => {
  try {
    logger.info(`Getting a ${objectType} group with name ${groupName}..`);

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
      logger.warn(`No existing ${objectType} group with name ${groupName} found..`);

      return null;
    }
  } catch (error) {
    logger.error(`Something went wrong getting a ${objectType} group with name ${groupName}`, error);
    throw error;
  }
};

const createGroup = async (accessToken: string, groupName: string, objectType: string): Promise<Group | null> => {
  try {
    logger.info(`Trying to create a ${objectType} group with name ${groupName}..`);

    const existingGroup = await getGroup(accessToken, groupName, objectType);

    if (!existingGroup) {
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
    } else {
      return null;
    }
  } catch (error) {
    logger.error(`Something went wrong creating a ${objectType} group`, error);
    throw error;
  }
};

const deleteGroup = async (accessToken: string, groupName: string, objectType: string): Promise<Group | null> => {
  try {
    logger.info(`Trying to delete a ${objectType} group with name ${groupName}..`);
    
    const existingProperties = await propertiesController.getProperties(accessToken);

    if (existingProperties) {
      // eslint-disable-next-line
      await Promise.all(existingProperties.map((property: any) =>
        propertiesController.deleteProperty(accessToken, property.name),
      ));
    }

    const response: AxiosResponse<Group> = await axios.delete(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/${groupName}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result: Group = response.data;

    if (result) {
      logger.info(`Successfully deleted a ${objectType} group with name ${groupName}`);

      return result;
    } else {
      logger.error('No result received');

      return null;
    }
  } catch (error) {
    logger.error(`Something went wrong deleting a ${objectType} group with name ${groupName}`, error);
    throw error;
  }
};

const groupsController = {
  createGroup,
  getGroup,
  deleteGroup,
};

export default groupsController;
