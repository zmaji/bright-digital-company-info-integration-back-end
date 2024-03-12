
import type { User } from '../typings/User';
import type { Group } from '../typings/Group';
import type { HubToken } from '../typings/HubToken';

import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import groupsController from '../controllers/Groups';
import usersController from '../controllers/Users';
import authController from '../controllers/Auth';
import isLoggedIn from '../middleware/IsLoggedIn';

const router = Router();

// router.get('', isLoggedIn async (req: Request, res: Response) => {
router.get('', async (req: Request, res: Response) => {
  try {
        // TODO: Change to retrieving logged in user from request
    // const currentUser: User = req.user;
    const userId: number = 1;
    const currentUser: User | null = await usersController.getUser(userId);

    if (currentUser && currentUser.hubSpotPortalId) {
      const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

      if (hubToken) {
        const result: Group | null = await groupsController.getGroup(hubToken.access_token);
    if (result) {
      res
          .status(StatusCodes.OK)
          .json(result);
    } else {
      res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `No group has been found` });
    }
  }
}
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
  }
});


// router.post('', isLoggedIn async (req: Request, res: Response) => {
router.post('', async (req: Request, res: Response) => {
  try {
    // TODO: Change to retrieving logged in user from request
    // const currentUser: User = req.user;
    const userId: number = 1;
    const currentUser: User | null = await usersController.getUser(userId);

    if (currentUser && currentUser.hubSpotPortalId) {
      const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

      if (hubToken) {
        const existingGroup: Group | null = await groupsController.getGroup(hubToken.access_token);

          if (!existingGroup) {
            const result: Group | null = await groupsController.createGroup(hubToken.access_token);

            if (result) {
              res
                  .status(StatusCodes.OK)
                  .json(result);
            } else {
              res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ error: `Unable to create group` });
            }
          } else {
            res
                .status(StatusCodes.OK)
                .json({ message: 'Group already exists', group: existingGroup });
          }
        }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred creating a group' });
  }
});

// router.delete('', isLoggedIn async (req: Request, res: Response) => {
  router.delete('', async (req: Request, res: Response) => {
  try {
        // TODO: Change to retrieving logged in user from request
    // const currentUser: User = req.user;
    const userId: number = 1;
    const currentUser: User | null = await usersController.getUser(userId);

    if (currentUser && currentUser.hubSpotPortalId) {
      const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

      if (hubToken) {
        const result = await groupsController.deleteGroup(hubToken.access_token);

    if (result) {
      res
          .sendStatus(StatusCodes.NO_CONTENT)
          .json(`Successfully deleted group`);
    } else {
      res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: `Unable to find group` });
    }
  }
}
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});


export default router;
