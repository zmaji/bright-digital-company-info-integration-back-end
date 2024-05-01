import type { PropertyField } from '../typings/PropertyField';

import axios, { AxiosError, AxiosResponse } from 'axios';
import logger from '../utils/Logger';
import { Property } from '../typings/Property';
import prisma from '../database/Client';

const getHubSpotProperties = async (accessToken: string, objectType: string): Promise<PropertyField[] | null> => {
  logger.info(`Getting HubSpot properties..`);

  try {
    const response: AxiosResponse = await axios.get(
        `https://api.hubapi.com/crm/v3/properties/${objectType}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result: PropertyField[] | null = response.data;

    if (result) {
      logger.info('Successfully retrieved properties');

      return result;
    } else {
      logger.info('No properties retrieved');

      return null;
    }
  } catch (error) {
    logger.error('Something went wrong retrieving properties', error);
    throw error;
  }
};

// eslint-disable-next-line
const createHubSpotProperties = async (accessToken: string, objectType: string, missingProperties: PropertyField[]): Promise<PropertyField[] | null> => {
  logger.info(`Creating HubSpot properties..`);

  try {
    const payload = {
      inputs: missingProperties,
    };

    const response: AxiosResponse = await axios.post(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/batch/create`,
        payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result: PropertyField[] = response.data.results;

    if (result) {
      logger.info('Successfully created properties');

      return result;
    } else {
      console.error('No result received');

      return null;
    }
  } catch (error) {
    logger.error('Something went wrong creating properties', error);
    throw error;
  }
};

// eslint-disable-next-line
const deleteHubSpotProperty = async (accessToken: string, objectType: string, propertyName: string) => {
  try {
    logger.info(`Trying to delete property: ${propertyName}..`);

    const response = await axios.delete(
        `https://api.hubapi.com/crm/v3/properties/${objectType}/${propertyName}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
    );

    if (response.status === 204) {
      logger.info(`Successfully deleted a HubSpot property: ${propertyName}`);

      return { success: true };
    } else {
      logger.error(`Unexpected status code while deleting property: ${response.status}`);

      return { success: false, message: `Unexpected status code: ${response.status}` };
    }
    // eslint-disable-next-line
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // eslint-disable-next-line
        logger.error(`Error while deleting a HubSpot property - Status: ${error.response.status}, Message: ${error.response.statusText}, Data: ${JSON.stringify(error.response.data)}`);
      } else {
        logger.error(`Error while deleting a HubSpot property - Message: ${error.message}`);
      }
    } else {
      logger.error('An unexpected error occurred:', error.toString());
    }
  }
};

const getProperties = async (portalId: number) => {
  logger.info('Retrieving all properties for portal ID:', portalId);

  try {
    const userProperties = await prisma.property.findMany({
      where: {
        portalId: portalId,
      },
    });

    if (userProperties.length === 0) {
      logger.info(`No properties found for portal ID: ${portalId}`);

      return null;
    }

    logger.success(`Successfully retrieved ${userProperties.length} properties for portal ID: ${portalId}`);

    return userProperties;
  } catch (error) {
    logger.error('Error retrieving properties for portal ID:', portalId, error);
    throw error;
  }
};

const createProperties = async (properties: Property[], portalId: number) => {
  logger.info('Creating properties...');
  try {
    const newProperties = await Promise.all(
        properties.map(async (property) => {
          const newProperty: Property = await prisma.property.create({
            data: {
              name: property.name,
              toSave: property.toSave,
              portalId: portalId,
            },
          });

          return newProperty;
        }),
    );

    logger.success('Successfully created new properties');

    return newProperties;
  } catch (error) {
    logger.error('Error creating properties', error);
    throw error;
  }
};

const updateProperties = async (properties: Property[]) => {
  logger.info('Updating properties...');

  try {
    const updatedProperties = await Promise.all(
        properties.map(async (property) => {
          const currentProperty = await prisma.property.findUnique({
            where: { id: property.id },
            select: { toSave: true },
          });

          if (currentProperty?.toSave !== property.toSave) {
            const updatedProperty = await prisma.property.update({
              where: { id: property.id },
              data: { toSave: property.toSave },
            });

            return updatedProperty;
          }

          return property;
        }),
    );

    logger.success('Properties updated successfully');

    return updatedProperties;
    // eslint-disable-next-line
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // eslint-disable-next-line
        logger.error(`Error while updating a property - Status: ${error.response.status}, Message: ${error.response.statusText}, Data: ${JSON.stringify(error.response.data)}`);
      } else {
        logger.error(`Error while updating a property - Message: ${error.message}`);
      }
    } else {
      logger.error('An unexpected error occurred:', error.toString());
    }
  }
};

const deleteProperty = async (propertyId: number) => {
  logger.info(`Deleting a property with id ${propertyId}...`);

  try {
    const deletedProperty = await prisma.property.delete({
      where: { id: propertyId },
    });

    logger.success(`Successfully deleted property with id ${propertyId}`);

    return deletedProperty;
  } catch (error) {
    logger.error(`Error deleting property with id ${propertyId}`, error);
    throw error;
  }
};

const propertiesController = {
  getHubSpotProperties,
  createHubSpotProperties,
  deleteHubSpotProperty,
  getProperties,
  createProperties,
  updateProperties,
  deleteProperty,
};

export default propertiesController;
