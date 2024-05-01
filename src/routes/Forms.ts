import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import formsController from '../controllers/Forms';
import isLoggedIn from '../middleware/IsLoggedIn';
import { User } from '../typings/User';
import usersController from '../controllers/Users';
import { HubToken } from '../typings/HubToken';
import authController from '../controllers/Auth';

const router = Router();

router.get('/', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user.emailAddress;
      const currentUser: User | null = await usersController.getUser(emailAddress);

      if (currentUser && currentUser.hubSpotPortalId) {
        const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

        if (hubToken && req.body) {
          const result = await formsController.getForms(hubToken);

          if (result) {
            res
                .status(StatusCodes.OK)
                .json(result);
          } else {
            res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: `Unable to retrieve forms` });
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
        .json({ error: 'An error occurred retrieving forms' });
  }
});

router.post('/', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user.emailAddress;
      const currentUser: User | null = await usersController.getUser(emailAddress);

      if (currentUser && currentUser.hubSpotPortalId) {
        const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

        if (hubToken && req.body) {
          const formData = req.body;

          if (formData) {
            const result = await formsController.createForm(hubToken, formData);

            if (result) {
              res
                  .status(StatusCodes.OK)
                  .json(result);
            } else {
              res
                  .status(StatusCodes.NOT_FOUND)
                  .json({ error: `Unable to create a form` });
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
        .json({ error: 'An error occurred creating a form' });
  }
});

export default router;
