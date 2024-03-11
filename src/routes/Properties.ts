
import type { User } from '../typings/User';
import type { Group } from '../typings/Group';
import type { HubToken } from '../typings/HubToken';

import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import propertiesController from '../controllers/Properties';
import usersController from '../controllers/Users';
import authController from '../controllers/Auth';
import isLoggedIn from '../middleware/IsLoggedIn';
import { generatePropertyFields } from '../helpers/hubspot/hubSpotProperties';
import { compareProperties } from '../helpers/hubspot/compareProperties';
import logger from '../utils/Logger';

const groupName = 'company_info_integration';

const router = Router();

// router.post('', isLoggedIn async (req: Request, res: Response) => {
router.post('', async (req: Request, res: Response): Promise<any | null> => {
  try {
    // TODO: Change to retrieving logged in user from request
    // const currentUser: User = req.user;
    const userId: number = 4;
    const currentUser: User | null = await usersController.getUser(userId);

    if (currentUser && currentUser.hubSpotPortalId) {
      const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

      if (hubToken) {
        const currentProperties = await propertiesController.getProperties(hubToken.access_token);

        if (currentProperties) {
          const propertyFields = await generatePropertyFields(groupName);
          await compareProperties(currentProperties, propertyFields);
        } else {
          const result = await propertiesController.createProperties(hubToken.access_token);
        }

        const result = await propertiesController.createProperties(hubToken.access_token);

        if (result) {
          res
              .status(StatusCodes.OK)
              .json('Successfully created properties');
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
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred creating properties' });
  }
});

export default router;
