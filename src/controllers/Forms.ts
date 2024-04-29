import type { HubToken } from '../typings/HubToken';

import axios, { AxiosError } from 'axios';
import logger from '../utils/Logger';

const createForm = async (hubToken: HubToken, formData: any) => {
    logger.info('Trying to create a HubSpot form');
  
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.hubapi.com/forms/v2/forms',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hubToken.access_token}`,
        },
        data: JSON.stringify(formData),
      });
  
      logger.info('HTTP Status:', response.status);
  
      if (response && response.data) {
        logger.info('HubSpot form has successfully been created');
        logger.info('Result:', response.data);
  
        return response.data;
      } else {
        logger.error('HubSpot form was not created');
  
        return null;
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response) {
          logger.error(`Error while creating a form - Status: ${error.response.status}, Message: ${error.response.statusText}, Data: ${JSON.stringify(error.response.data)}`);
        } else {
          logger.error(`Error while creating a form - Message: ${error.message}`);
        }
      } else {
        logger.error('An unexpected error occurred:', error.toString());
      }
  
      return null;
    }
  };

const formsController = {
    createForm,
};

export default formsController;
