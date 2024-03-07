import axios, { AxiosResponse } from 'axios';
import logger from '../utils/Logger';

// type
const createGroup = async (accessToken: string): Promise<any | null> => {
    try {
      logger.info('Trying to create a property group..')
  
      const payload = {
        "name": "company_info_integration",
        "label": "Company.info intgeration",
        "displayOrder": -1
      }
      const data = JSON.stringify(payload); 
      // TODO: type
      const response: AxiosResponse<any> = await axios.post('https://api.hubapi.com/crm/v3/properties/company/groups', data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      // TODO: type
      const result: any = response.data;
  
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
