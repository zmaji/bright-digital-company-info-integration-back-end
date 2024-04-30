import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import isLoggedIn from '../middleware/IsLoggedIn';
import { User } from '../typings/User';
import usersController from '../controllers/Users';
import { HubToken } from '../typings/HubToken';
import authController from '../controllers/Auth';
import filesController from '../controllers/Files';

const router = Router();

router.get('/hubspot', isLoggedIn, async (req: Request, res: Response) => {
    try {
      if (req.user && req.user.emailAddress) {
        const emailAddress: string = req.user.emailAddress;
        const currentUser: User | null = await usersController.getUser(emailAddress);
  
        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);
  
          if (hubToken && req.body) {
              const result = await filesController.getFiles(hubToken);
  
              if (result) {
                res
                    .status(StatusCodes.OK)
                    .json(result);
              } else {
                res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: `Unable to retrieve files` });
              }
            } else {
              res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ error: 'No data provided' });
            }
          }
      }
    } catch {
      res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'An error occurred retrieving files' });
    }
  });

router.post('/hubspot', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user.emailAddress;
      const currentUser: User | null = await usersController.getUser(emailAddress);

      if (currentUser && currentUser.hubSpotPortalId) {
        const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

        if (hubToken && req.body) {
          const title = req.body.title;

          if (title) {
            const result = await filesController.createFile(hubToken, title);

            if (result) {
              res
                  .status(StatusCodes.OK)
                  .json(result);
            } else {
              res
                  .status(StatusCodes.NOT_FOUND)
                  .json({ error: `Unable to create a file` });
            }
          } else {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'No data provided' });
          }
        }
      }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred creating a file' });
  }
});

export default router;
