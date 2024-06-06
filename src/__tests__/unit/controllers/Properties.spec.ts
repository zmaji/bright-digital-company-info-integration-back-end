import type { PropertyField } from '../../../typings/PropertyField';
import type { Property } from '../../../typings/Property';

import { prismaMock } from '../../utils/singleton';
import axios, { AxiosResponse } from 'axios';
import propertiesController from '../../../controllers/Properties';
import logger from '../../../utils/Logger';

jest.mock('axios');
jest.mock('../../../utils/Logger');

describe('Properties Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const accessToken = '1234567890';
  const objectType = 'company';
  const portalId = 12345;

  const sampleHubSpotProperties = [
    { name: 'property1', type: 'string' },
    { name: 'property2', type: 'number' },
  ];

  const sampleProperties: Property[] = [
    { id: 1, name: 'property1', toSave: true, portalId },
    { id: 2, name: 'property2', toSave: false, portalId },
  ];

  const newPropertyFields: PropertyField[] = [
    {
      label: 'Email',
      name: 'email',
      type: 'string',
      fieldType: 'text',
      groupName: 'Company_info_integration',
      displayOrder: 1,
      hasUniqueValue: false,
      hidden: false,
      formField: true,
    },
    {
      label: 'Age',
      name: 'age',
      type: 'number',
      fieldType: 'number',
      groupName: 'Company_info_integration',
      displayOrder: 2,
      hasUniqueValue: false,
      hidden: false,
      formField: true,
      options: [
        { label: 'Under 18', value: 'under_18', displayOrder: 0, hidden: false },
        { label: '18-24', value: '18_24', displayOrder: 1, hidden: false },
        { label: '25+', value: '25_plus', displayOrder: 2, hidden: false },
      ],
    },
  ];

  describe('HubSpot Properties', () => {
    test('should get HubSpot properties successfully', async () => {
      (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
        data: sampleHubSpotProperties,
      } as AxiosResponse<any>);

      const result = await propertiesController.getHubSpotProperties(accessToken, objectType);

      expect(axios.get).toHaveBeenCalledWith(
          `https://api.hubapi.com/crm/v3/properties/${objectType}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
      );

      expect(result).toEqual(sampleHubSpotProperties);
      expect(logger.success).toHaveBeenCalledWith('Successfully retrieved properties');
    });

    test('should create HubSpot properties successfully', async () => {
      (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValueOnce({
        data: { results: sampleHubSpotProperties },
      } as AxiosResponse<any>);

      const result = await propertiesController.createHubSpotProperties(
          accessToken,
          objectType,
          newPropertyFields,
      );

      expect(axios.post).toHaveBeenCalledWith(
          `https://api.hubapi.com/crm/v3/properties/${objectType}/batch/create`,
          { inputs: newPropertyFields },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
      );

      expect(result).toEqual(sampleHubSpotProperties);
      expect(logger.success).toHaveBeenCalledWith('Successfully created properties');
    });

    test('should delete a HubSpot property successfully', async () => {
      const propertyName = 'property1';
      (axios.delete as jest.MockedFunction<typeof axios.delete>).mockResolvedValueOnce({
        status: 204,
      } as AxiosResponse<any>);

      const result = await propertiesController.deleteHubSpotProperty(
          accessToken,
          objectType,
          propertyName,
      );

      expect(axios.delete).toHaveBeenCalledWith(
          `https://api.hubapi.com/crm/v3/properties/${objectType}/${propertyName}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
      );

      expect(result).toEqual({ success: true });
      expect(logger.success).toHaveBeenCalledWith(
          `Successfully deleted a HubSpot property: ${propertyName}`,
      );
    });

    test('should handle error when deleting a HubSpot property', async () => {
      const propertyName = 'property1';
      const error = new Error('Failed to delete property');

      (axios.delete as jest.MockedFunction<typeof axios.delete>).mockRejectedValueOnce(error);

      await expect(
          propertiesController.deleteHubSpotProperty(
              accessToken,
              objectType,
              propertyName,
          ),
      ).rejects.toThrow(error);

      // eslint-disable-next-line
      const calledError = error.message.replace(/[\[\]]/g, '');

      expect(logger.error).toHaveBeenCalledWith(
          'An unexpected error occurred:',
          `Error: ${calledError}`,
      );
    });
  });

  describe('Properties', () => {
    test('should get properties for a given portal ID', async () => {
      // @ts-ignore
      (prismaMock.property.findMany as jest.MockedFunction<typeof prismaMock.property.findMany>).mockResolvedValueOnce(
          // @ts-ignore
          sampleProperties,
      );

      const result = await propertiesController.getProperties(portalId);

      expect(prismaMock.property.findMany).toHaveBeenCalledWith({
        where: { portalId },
      });

      expect(result).toEqual(sampleProperties);
      expect(logger.success).toHaveBeenCalledWith(
          `Successfully retrieved ${sampleProperties.length} properties for portal ID: ${portalId}`,
      );
    });

    test('should create new properties for a given portal ID', async () => {
      (prismaMock.property.create as jest.MockedFunction<typeof prismaMock.property.create>).mockResolvedValueOnce(
          // @ts-ignore
          sampleProperties[0],
      );

      const newProperties = [
        { name: 'property1', toSave: true, portalId },
        { name: 'property2', toSave: false, portalId },
      ];

      const result = await propertiesController.createProperties(newProperties, portalId);

      expect(prismaMock.property.create).toHaveBeenCalledTimes(newProperties.length);
      expect(result.length).toEqual(newProperties.length);
      expect(logger.success).toHaveBeenCalledWith('Successfully created new properties');
    });

    test('should update properties', async () => {
      (prismaMock.property.findUnique as jest.MockedFunction<typeof prismaMock.property.findUnique>).mockResolvedValueOnce({
        id: 1,
        name: 'property1',
        toSave: true,
        portalId: 12345,
      });

      (prismaMock.property.update as jest.MockedFunction<typeof prismaMock.property.update>).mockResolvedValueOnce(
          // @ts-ignore
          sampleProperties[0],
      );

      const updatedProperties: Property[] = [
        { id: 1, name: 'property1', toSave: true, portalId: 12345 },
        { id: 2, name: 'property1', toSave: true, portalId: 12345 },
      ];

      const result = await propertiesController.updateProperties(updatedProperties);

      if (result) {
        expect(prismaMock.property.update).toHaveBeenCalledTimes(1);
        expect(result.length).toEqual(updatedProperties.length);
        expect(logger.success).toHaveBeenCalledWith('Properties updated successfully');
      }
    });

    test('should delete a property by ID', async () => {
      const propertyId = 1;
      (prismaMock.property.delete as jest.MockedFunction<typeof prismaMock.property.delete>).mockResolvedValueOnce(
          // @ts-ignore
          sampleProperties[0],
      );

      const result = await propertiesController.deleteProperty(propertyId);

      expect(prismaMock.property.delete).toHaveBeenCalledWith({
        where: { id: propertyId },
      });

      expect(result).toEqual(sampleProperties[0]);
      expect(logger.success).toHaveBeenCalledWith(
          `Successfully deleted property with id ${propertyId}`,
      );
    });
  });
});
