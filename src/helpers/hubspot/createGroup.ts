import axios, { AxiosResponse } from "axios"

import logger from "../../utils/Logger"

// TODO: What kind of HubToken is being sent?
export const createGroup = async (token: string) => {
  try {
    logger.info('Trying to create a property group..')

    // TODO: Change naming
    const data = {
      "name": "company_info_plugin",
      "label": "Company.info plugin",
      "displayOrder": -1
    }
    // ??
    // data: JSON.stringify(data) 
    // TODO: type
    const response: AxiosResponse<any> = await axios.post('https://api.hubapi.com/crm/v3/properties/company/groups', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // TODO: type
    const result: any = response.data;

    if (result) {
      logger.info('Successfully created a group');
      return result;
    } else {
      console.error('No result received');
      return null;
    }  
  } catch (error) {
    logger.error('Something went wrong creating a group', error);
    throw error;
  }
};