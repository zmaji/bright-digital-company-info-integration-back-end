import axios, { AxiosResponse } from 'axios';
import groupsController from '../../controllers/Groups';
import logger from '../../utils/Logger';

jest.mock('axios');
jest.mock('../../utils/Logger');

describe('Groups Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const accessToken = '1234567890';
  const groupName = 'testGroup';
  const objectType = 'company';

  const responseData = {
    archived: true,
    name: groupName,
    displayOrder: -1,
    label: 'Company.info integration',
  };

  test('should get a group successfully', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({ data: responseData } as AxiosResponse<any>);

    const result = await groupsController.getGroup(accessToken, groupName, objectType);

    expect(axios.get).toHaveBeenCalledWith(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/groups/${groupName}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
    );

    expect(result).toEqual(responseData);
    expect(logger.info).toHaveBeenCalledWith(`Successfully retrieved ${objectType} group with name ${groupName}`);
  });

  test('should handle error when getting a group', async () => {
    const error = new Error('Failed to get group');

    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValueOnce(error);

    await expect(groupsController.getGroup(accessToken, groupName, objectType)).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith(`Something went wrong getting a ${objectType} group with name ${groupName}`, error);
  });

  test('should create a group successfully', async () => {
    (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValueOnce({ data: responseData } as AxiosResponse<any>);

    const result = await groupsController.createGroup(accessToken, groupName, objectType);

    expect(axios.post).toHaveBeenCalledWith(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/groups`,
        {
          name: groupName,
          label: 'Company.info integration',
          displayOrder: -1,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
    );

    expect(result).toEqual(responseData);
    expect(logger.info).toHaveBeenCalledWith(`Successfully created a ${objectType} group`);
  });

  test('should handle error when creating a group', async () => {
    const error = new Error('Failed to create group');

    (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValueOnce(error);

    await expect(groupsController.createGroup(accessToken, groupName, objectType)).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith(`Something went wrong creating a ${objectType} group`, error);
  });
});

