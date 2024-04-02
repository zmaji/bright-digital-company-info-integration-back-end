
import type { User } from '../typings/User';
import type { Group } from '../typings/Group';
import type { HubToken } from '../typings/HubToken';

import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import groupController from '../controllers/Groups';
import userController from '../controllers/Users';
import authController from '../controllers/Auth';
import isLoggedIn from '../middleware/IsLoggedIn';

const router = Router();

router.get('', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user.emailAddress;
      const currentUser: User | null = await userController.getUser(emailAddress);

      if (req.query && req.query.groupName && req.query.objectType) {
        const groupName: string = req.query.groupName as string;
        const objectType: string = req.query.objectType as string;

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const result: Group | null = await groupController.getGroup(hubToken.access_token, groupName, objectType);

            if (result) {
              res
                  .status(StatusCodes.OK)
                  .json(result);
            } else {
              res
                  .status(StatusCodes.NOT_FOUND)
                  .json({ error: `Unable to find group with name ${groupName}` });
            }
          }
        } else {
          res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Unauthorized' });
        }
      } else {
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'No group name and object type provided' });
      }
    }
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving a group' });
  }
});

router.post('', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user?.emailAddress;
      const currentUser: User | null = await userController.getUser(emailAddress);

      if (req.body && req.body.groupName && req.body.objectType) {
        const groupName: string = req.body?.groupName;
        const objectType: string = req.body?.objectType;

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
              const result: Group | null = await groupController.createGroup(hubToken.access_token, groupName, objectType);

              if (result) {
                res
                    .status(StatusCodes.OK)
                    .json(result);
              } else {
                res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: `Unable to create group with name ${groupName}` });
              }
          }
        }
      }
    }
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred creating a group' });
  }
});

router.delete('', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string | undefined = req.user?.emailAddress;
      const currentUser: User | null = await userController.getUser(emailAddress);

      if (req.body && req.body.groupName && req.body.objectType) {
        const groupName: string = req.body?.groupName;
        const objectType: string = req.body?.objectType;

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const result = await groupController.deleteGroup(hubToken.access_token, groupName, objectType);

            if (result) {
              res
                  .sendStatus(StatusCodes.NO_CONTENT)
                  .json(`Successfully deleted group with name ${groupName}`);
            } else {
              res
                  .status(StatusCodes.NOT_FOUND)
                  .json({ error: `Unable to find group with name ${groupName}` });
            }
          }
        }
      }
    }
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

export default router;
