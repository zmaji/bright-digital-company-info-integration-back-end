
import type { User } from '../typings/User';
import type { HubToken } from '../typings/HubToken';

import { PropertyField } from '../typings/PropertyField';
import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import propertiesController from '../controllers/Properties';
import userController from '../controllers/Users';
import authController from '../controllers/Auth';
import isLoggedIn from '../middleware/IsLoggedIn';
import logger from '../utils/Logger';

const router = Router();

router.get('/hubspot', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string | undefined = req.user?.emailAddress;
      const currentUser: User | null = emailAddress? await userController.getUser(emailAddress) : null;

      if (req.query && req.query.groupName && req.query.objectType) {
        const groupName: string = req.query.groupName as string;
        const objectType: string = req.query.objectType as string;

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const properties: PropertyField[] | null = await propertiesController.getHubSpotProperties(
                hubToken.access_token, objectType);

            if (properties) {
              res
                  .status(StatusCodes.OK)
                  .json(properties);
            } else {
              res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ error: `retrieved properties from group ${groupName}` });
            }
          } else {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: `Unable to retrieve hub token` });
          }
        } else {
          res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ error: `Unauthorized` });
        }
      } else {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'No group name and object type provided' });
      }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `An error occurred retrieving properties` });
  }
});

router.post('/hubspot', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string | undefined = req.user?.emailAddress;
      const currentUser: User | null = emailAddress? await userController.getUser(emailAddress) : null;

      if (req.body && req.body.objectType && req.body.missingProperties) {
        const objectType: string = req.body.objectType;
        const missingProperties: PropertyField[] = req.body.missingProperties;

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const result = await propertiesController.createHubSpotProperties(
                hubToken.access_token, objectType, missingProperties);

            if (result) {
              res
                  .status(StatusCodes.OK)
                  .json(result);
            } else {
              res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ error: `Unable to create properties` });
            }
          } else {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: `Unable to retrieve hub token` });
          }
        } else {
          logger.info('Not logged in!');
        }
      }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred creating properties' });
  }
});

router.delete('/hubspot/:objectType/:propertyName', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress = req.user.emailAddress;
      const currentUser = emailAddress ? await userController.getUser(emailAddress) : null;

      if (req.params.objectType && req.params.propertyName) {
        const { objectType, propertyName } = req.params;

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const result = await propertiesController.deleteHubSpotProperty(hubToken.access_token, objectType, propertyName);

            if (result?.success) {
              return res.status(200).json({ message: `Property ${propertyName} deleted successfully` });
            } else {
              return res.status(500).json({ error: `Unable to delete property: ${result?.message}` });
            }
          } else {
            return res.status(500).json({ error: `Unable to retrieve hub token` });
          }
        } else {
          return res.status(401).json({ error: 'Unauthorized' });
        }
      } else {
        return res.status(400).json({ error: 'Invalid parameters' });
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error in DELETE endpoint:', error);
    return res.status(500).json({ error: `An error occurred deleting a property: ${error}` });
  }
});

router.get('/', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string | undefined = req.user?.emailAddress;
      const currentUser: User | null = emailAddress? await userController.getUser(emailAddress) : null;
      
        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const properties = await propertiesController.getProperties(currentUser.hubSpotPortalId);

            if (properties || properties === null) {
              res
                  .status(StatusCodes.OK)
                  .json(properties);
            } else {
              res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ error: `Retrieved properties from portal ${currentUser.hubSpotPortalId}` });
            }
          } else {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: `Unable to retrieve hub token` });
          }
        } else {
          res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ error: `Unauthorized` });
        }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `An error occurred retrieving properties` });
  }
});

router.post('/', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string | undefined = req.user?.emailAddress;
      const currentUser: User | null = emailAddress? await userController.getUser(emailAddress) : null

      if (req.body && req.body) {
        if (currentUser && currentUser.hubSpotPortalId && currentUser.id) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const createdProperties = propertiesController.createProperties(req.body.propertiesToCreate, currentUser.hubSpotPortalId)

            if (createdProperties) {
                res
                    .status(StatusCodes.CREATED)
                    .json(createdProperties);
              } else {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: 'Failed to create properties.' });
              }
            } else {
              res
                  .status(StatusCodes.UNAUTHORIZED)
                  .json({ error: 'Unauthorized' });
            }
          } else {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ error: 'Not logged in.' });
          }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

router.put('/', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string | undefined = req.user?.emailAddress;
      const currentUser: User | null = emailAddress? await userController.getUser(emailAddress) : null;

      if (req.body && req.body) {
        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const updatedProperties = propertiesController.updateProperties(req.body.propertiesToUpdate);

            if (updatedProperties) {
                res
                    .status(StatusCodes.CREATED)
                    .json(updatedProperties);
              } else {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: 'Failed to update properties.' });
              }
            } else {
              res
                  .status(StatusCodes.UNAUTHORIZED)
                  .json({ error: 'Unauthorized' });
            }
          } else {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ error: 'Not logged in.' });
          }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete('/:propertyId', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string | undefined = req.user?.emailAddress;
      const currentUser: User | null = emailAddress? await userController.getUser(emailAddress) : null;

      if (req.params && req.params.propertyId) {
        const propertyId = parseInt(req.params.propertyId, 10);

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const deletedProperty = propertiesController.deleteProperty(propertyId);

            if (deletedProperty) {
                res
                    .status(StatusCodes.CREATED)
                    .json(deletedProperty);
              } else {
                res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: 'Failed to update properties.' });
              }
            } else {
              res
                  .status(StatusCodes.UNAUTHORIZED)
                  .json({ error: 'Unauthorized' });
            }
          } else {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ error: 'Not logged in.' });
          }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

export default router;
