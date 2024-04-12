import axios, { AxiosResponse } from 'axios';
import propertiesController from '../../controllers/Properties';
import logger from '../../utils/Logger';
import type { PropertyField } from '../../typings/PropertyField';

jest.mock('axios');
jest.mock('../../utils/Logger');

describe('Properties Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const accessToken = '1234567890';
  const objectType = 'company';

  const responseData = [
    { name: 'property1', type: 'string' },
    { name: 'property2', type: 'number' },
  ];

  const missingProperties: PropertyField[] = [
    {
      label: "Email",
      name: "email",
      type: "string",
      fieldType: "text",
      groupName: "Company_info_integration",
      hidden: false,
      displayOrder: 1,
      hasUniqueValue: false,
      formField: true
    },
    {
      label: "Age",
      name: "age",
      type: "number",
      fieldType: "number",
      groupName: "ompany_info_integration",
      hidden: false,
      displayOrder: 2,
      hasUniqueValue: false,
      formField: true,
      options: [
        { label: "Under 18", value: "under_18", displayOrder: 0, hidden: false },
        { label: "18-24", value: "18_24", displayOrder: 1, hidden: false },
        { label: "25+", value: "25_plus", displayOrder: 2, hidden: false }
      ]
    }
  ];

  test('should get properties successfully', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({ data: responseData } as AxiosResponse<any>);

    const result = await propertiesController.getProperties(accessToken, objectType);

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.hubapi.com/crm/v3/properties/${objectType}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual(responseData);
    expect(logger.info).toHaveBeenCalledWith('Successfully retrieved properties');
  });

  test('should handle error when getting properties', async () => {
    const error = new Error('Failed to get properties');

    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValueOnce(error);

    await expect(propertiesController.getProperties(accessToken, objectType)).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith('Something went wrong retrieving properties', error);
  });

  test('should create properties successfully', async () => {
    (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValueOnce({ data: { results: responseData } } as AxiosResponse<any>);

    const result = await propertiesController.createProperties(accessToken, objectType, missingProperties);

    expect(axios.post).toHaveBeenCalledWith(
      `https://api.hubapi.com/crm/v3/properties/${objectType}/batch/create`,
      { inputs: missingProperties },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual(responseData);
    expect(logger.info).toHaveBeenCalledWith('Successfully created properties');
  });

  test('should handle error when creating properties', async () => {
    const error = new Error('Failed to create properties');

    (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValueOnce(error);

    await expect(propertiesController.createProperties(accessToken, objectType, missingProperties)).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith('Something went wrong creating properties', error);
  });

  test('should delete a property successfully', async () => {
    const propertyName = 'property1';

    (axios.delete as jest.MockedFunction<typeof axios.delete>).mockResolvedValueOnce({ data: responseData } as AxiosResponse<any>);

    const result = await propertiesController.deleteProperty(accessToken, propertyName, objectType);

    expect(axios.delete).toHaveBeenCalledWith(
      `https://api.hubapi.com/crm/v3/properties/${objectType}/${propertyName}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual(responseData);
    expect(logger.info).toHaveBeenCalledWith(`Successfully deleted a HubSpot property: ${propertyName}`);
  });

  test('should handle error when deleting a property', async () => {
    const propertyName = 'property1';
    const error = new Error('Failed to delete property');

    (axios.delete as jest.MockedFunction<typeof axios.delete>).mockRejectedValueOnce(error);

    await expect(propertiesController.deleteProperty(accessToken, propertyName, objectType)).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith(`Something went wrong deleting a HubSpot property: ${propertyName}`, error);
  });
});
