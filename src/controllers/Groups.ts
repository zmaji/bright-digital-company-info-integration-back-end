import axios, { AxiosResponse } from 'axios';
import logger from '../utils/Logger';
import { Group } from '../typings/Group';

const groupName = 'company_info_integration';
const objectType = 'company';

const getGroup = async (accessToken: string): Promise<Group | null> => {
  try {
    logger.info(`Getting a ${objectType} group with name ${groupName}..`);

    const response: AxiosResponse<Group> = await axios.delete(
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
      logger.error('No result received..');
      return null;
    }
  } catch (error) {
    logger.error(`Something went wrong getting ${objectType} group with name ${groupName}`, error);
    throw error;
  }
};

const createGroup = async (accessToken: string): Promise<Group | null> => {
  try {
    logger.info('Trying to create a property group..');

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
      logger.info(`Successfully created a HubSpot ${objectType} group`);

      return result;
    } else {
      logger.error('No result received');

      return null;
    }
  } catch (error) {
    logger.error(`Something went wrong creating a HubSpot ${objectType} group`, error);
    throw error;
  }
};

const deleteGroup = async (accessToken: string): Promise<Group | null> => {
  try {
    logger.info('Trying to delete a property group..'); 

    const response: AxiosResponse<Group> = await axios.post(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/groups/${groupName}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result: Group = response.data;

    if (result) {
      logger.info(`Successfully deleted a HubSpot ${objectType} group`);

      return result;
    } else {
      logger.error('No result received');

      return null;
    }
  } catch (error) {
    logger.error(`Something went wrong creating a HubSpot ${objectType} group`, error);
    throw error;
  }
};

const groupsController = {
  createGroup,
  getGroup,
};

export default groupsController;
