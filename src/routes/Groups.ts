
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

// router.post('', isLoggedIn async (req: Request, res: Response) => {
router.post('', async (req: Request, res: Response): Promise<any | null> => {
  try {
    // TODO: Change to retrieving logged in user from request
    // const currentUser: User = req.user;
    const userId: number = 4;
    const currentUser: User | null = await usersController.getUser(userId);
    const groupName = 'company_info_integration';

    if (currentUser && currentUser.hubSpotPortalId) {
      const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

      if (hubToken) {
        const hubSpotGroups = await groupsController.getGroups(hubToken.access_token);

        if (hubSpotGroups) {
            const existingGroup = await groupsController.searchGroup(hubSpotGroups, groupName);

            if (!existingGroup) {
                const result = await groupsController.createGroup(hubToken.access_token);

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
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred creating a group' });
  }
});

export default router;
