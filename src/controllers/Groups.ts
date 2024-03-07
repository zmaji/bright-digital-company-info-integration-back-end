import axios, { AxiosResponse } from 'axios';
import logger from '../utils/Logger';
import { Group } from '../typings/Group';

const getGroup = async (accessToken: string): Promise<Group[] | null> => {
  try {
    logger.info('Getting all company groups..')

    const response: AxiosResponse<Group[]> = await axios.post('https://api.hubapi.com/crm/v3/properties/company/groups', {
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
      console.error('No result received..');
      return null;
    }  
  } catch (error) {
    logger.error('Something went wrong getting company groups', error);
    throw error;
  }
};

const createGroup = async (accessToken: string): Promise<Group | null> => {
    try {
      // 401???
      const test: Group[] | null = await getGroup(accessToken);

      console.log('test')
      console.log('test')
      console.log('test')
      console.log('test')
      console.log(test)

      logger.info('Trying to create a property group..')
  
      const payload = {
        "name": "company_info_integration",
        "label": "Company.info intgeration",
        "displayOrder": -1
      }

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
        console.error('No result received');
        return null;
      }  
    } catch (error) {
      logger.error('Something went wrong creating a HubSpot company group', error);
      throw error;
    }
  };

const groupsController = {
    createGroup,
};

export default groupsController;
