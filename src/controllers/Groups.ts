import axios, { AxiosResponse } from 'axios';
import logger from '../utils/Logger';
import { Group } from '../typings/Group';

const groupName = 'company_info_integration';

const getGroups = async (accessToken: string): Promise<Group[] | null> => {
  try {
    logger.info('Getting all company groups..');

    const response: AxiosResponse<Group[]> = await axios.get(`https://api.hubspot.com/crm/v3/properties/company/groups`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result: Group[] = response.data;

    if (result) {
      logger.info('Successfully retrieved all company groups');

      return result;
    } else {
      logger.error('No result received..');

      return null;
    }
  } catch (error) {
    logger.error('Something went wrong getting company groups', error);
    throw error;
  }
};

const searchGroup = async (groups: Group[], groupName: string): Promise<Group | null> => {
  // @ts-ignore
  const foundGroup = groups.results.find((group) => group.name === groupName);

  if (foundGroup) {
    logger.info(`Successfully found group with name ${groupName}`);

    return foundGroup;
  } else {
    logger.error(`No group with name ${groupName} found`);

    return null;
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

    const response: AxiosResponse<Group> = await axios.post('https://api.hubapi.com/crm/v3/properties/company/groups', payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result: Group = response.data;

    if (result) {
      logger.info('Successfully created a HubSpot company group');

      return result;
    } else {
      logger.error('No result received');

      return null;
    }
  } catch (error) {
    logger.error('Something went wrong creating a HubSpot company group', error);
    throw error;
  }
};

const groupsController = {
  createGroup,
  getGroups,
  searchGroup,
};

export default groupsController;
