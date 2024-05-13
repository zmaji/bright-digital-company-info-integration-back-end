import type { HubToken } from '../typings/HubToken';

import path from 'path';
import fs from 'fs';
import axios, { AxiosError } from 'axios';
import logger from '../utils/Logger';

const getFiles = async (hubToken: HubToken) => {
  logger.info('Trying to retrieve HubSpot files');

  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.hubapi.com/files/v3/files/search/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubToken.access_token}`,
      },
    });

    logger.info('HTTP Status:', response.status);

    if (response && response.data) {
      logger.success('HubSpot files have successfully been retrieved');
      logger.info('Result:', response.data);

      return response.data;
    } else {
      logger.error('HubSpot files were not retrieved');

      return null;
    }
    // eslint-disable-next-line
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // eslint-disable-next-line
        logger.error(`Error while retrieving files - Status: ${error.response.status}, Message: ${error.response.statusText}, Data: ${JSON.stringify(error.response.data)}`);
      } else {
        logger.error(`Error while retrieving files - Message: ${error.message}`);
      }
    } else {
      logger.error('An unexpected error occurred:', error.toString());
    }

    return null;
  }
};

const createFile = async (hubToken: HubToken, title: string) => {
  try {
    const filePath = path.join(__dirname, '../data', title);
    const fileContent = fs.createReadStream(filePath);

    const fileOptions = {
      access: 'PUBLIC_INDEXABLE',
      ttl: 'P3M',
      overwrite: false,
      duplicateValidationStrategy: 'NONE',
      duplicateValidationScope: 'ENTIRE_PORTAL',
    };

    const formData = {
      file: fileContent,
      options: JSON.stringify(fileOptions),
      folderPath: 'scripts',
    };

    const response = await axios({
      method: 'post',
      url: 'https://api.hubapi.com/files/v3/files',
      headers: {
        'Authorization': `Bearer ${hubToken.access_token}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Failed to create the file');

      return null;
    }
    // eslint-disable-next-line
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
            // eslint-disable-next-line
            `Error creating file - Status: ${error.response.status}, Message: ${error.response.statusText}, Data: ${JSON.stringify(error.response.data)}`,
        );
      } else {
        console.error(`Error creating file - Message: ${error.message}`);
      }
    } else {
      console.error('An unexpected error occurred:', error.toString());
    }

    return null;
  }
};

const filesController = {
  createFile,
  getFiles,
};

export default filesController;
