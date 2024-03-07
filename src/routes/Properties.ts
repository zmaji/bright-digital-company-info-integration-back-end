
import type { User } from '../typings/User';

import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import propertiesController from '../controllers/Properties';
import usersController from '../controllers/Users';
import groupsController from '../controllers/Groups';
import authController from '../controllers/Auth';
import isLoggedIn from '../middleware/IsLoggedIn';
import { HubToken } from '@prisma/client';

const router = Router();

// router.post('', isLoggedIn async (req: Request, res: Response) => {
router.post('', async (req: Request, res: Response) => {
  try {
    // TODO: Change to retrieving logged in user from request
    // const currentUser: User = req.user;
    const userId: number = 4;
    const currentUser = await usersController.getUser(userId);

    if (currentUser && currentUser.hubSpotPortalId) {
      const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

      if (hubToken) {
        // Type
        const companyGroup = await groupsController.createGroup(hubToken.access_token);

        if (companyGroup) {
          // Type
          const result = await propertiesController.createProperties(hubToken.access_token);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: `Unable to update HubSpot Company` });
        }
      }
    } else {
      res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Trade name has not been provided' });
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving a company' });
  }
});

export default router;
