import type { HubToken } from '../../../typings/HubToken';

import filesController from '../../../controllers/Files';
import axios from 'axios';
import logger from '../../../utils/Logger';

jest.mock('axios');
jest.mock('../../../utils/Logger');
jest.mock('fs');
jest.mock('path');

describe('filesController Tests', () => {
  const hubToken: HubToken = {
    id: 1,
    portal_id: null,
    access_token: 'token123',
    refresh_token: 'refreshTokenXYZ',
    expires_in: 3600,
    created_at: new Date(),
    updated_at: null,
  };

  // const mockFileData = {
  //   total: 1,
  //   results: [
  //     {
  //       id: 'file-id-123',
  //       name: 'TestFile.txt',
  //       folderPath: '/scripts',
  //     },
  //   ],
  // };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFiles', () => {
  //   test('should retrieve files successfully', async () => {
  //     // @ts-ignore
  //     axios.mockResolvedValue({ status: 200, data: mockFileData });

  //     const result = await filesController.getFiles(hubToken);

  //     expect(result).toEqual(mockFileData);
  //     expect(axios).toHaveBeenCalledWith({
  //       method: 'get',
  //       url: 'https://api.hubapi.com/files/v3/files/search/',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${hubToken.access_token}`,
  //       },
  //     });
  //     expect(logger.info).toHaveBeenCalledWith('Trying to retrieve HubSpot files');
  //     expect(logger.info).toHaveBeenCalledWith('HTTP Status:', 200);
  //     expect(logger.info).toHaveBeenCalledWith('HubSpot files have successfully been retrieved');
  //     expect(logger.info).toHaveBeenCalledWith('Result:', mockFileData);
  //   });

    test('should handle no files found', async () => {
      // @ts-ignore
      axios.mockResolvedValue({ status: 200, data: null });

      const result = await filesController.getFiles(hubToken);

      expect(result).toBeNull();
      expect(axios).toHaveBeenCalledWith({
        method: 'get',
        url: 'https://api.hubapi.com/files/v3/files/search/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hubToken.access_token}`,
        },
      });
      expect(logger.error).toHaveBeenCalledWith('HubSpot files were not retrieved');
    });

    test('should handle error during file retrieval', async () => {
      const errorMessage = 'Network error';
      const axiosError = new Error(errorMessage);
      // @ts-ignore
      axios.mockRejectedValue(axiosError);

      const result = await filesController.getFiles(hubToken);

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith('An unexpected error occurred:', axiosError.toString());
    });

    test('should handle AxiosError with response', async () => {
      const axiosError = new Error('Request failed');
      // @ts-ignore
      axiosError.response = { status: 404, statusText: 'Not Found', data: { message: 'File not found' } };
      // @ts-ignore
      axios.mockRejectedValue(axiosError);

      const result = await filesController.getFiles(hubToken);

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith('An unexpected error occurred:', axiosError.toString());
    });
  });
});
