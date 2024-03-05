import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import authController from '../controllers/Auth';
import { HubToken } from '../typings/HubToken';

import logger from '../utils/Logger';
import isLoggedIn from '../middleware/IsLoggedIn';
import userController from '../controllers/User';
import { User } from '../typings/User';

const router = Router();

router.post('', async (req: Request, res: Response) => {
  try {
    const { emailAddress, password } = req.body;
    const token = await authController.authenticateUser(emailAddress, password);

    if (token) {
      res
          .status(StatusCodes.OK)
          .json({ token });
    } else {
      res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Authentication failed: wrong email address and/or password' });
    }
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
  }
});

// router.get('/oauth-callback', isLoggedIn, async (req, res) => {
router.get('/oauth-callback', async (req, res) => {
  try {
    logger.info('User has been prompted to install the integration..');
    const hubSpotCode: string | undefined = typeof req.query.code === 'string' ? req.query.code : undefined;
    // @ts-ignore
    // const userId: number | undefined = req.user?.id;
    const userId: number | undefined = 2

    if (!hubSpotCode) {
      return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Code parameter missing or invalid' });
    }

    const hubToken: HubToken | null = await authController.authenticateHubSpotUser(hubSpotCode);

    if (hubToken && hubToken.message) {
      logger.error(`Error while retrieving tokens: ${hubToken.message}`);

      return res.redirect(`/error?msg=${hubToken.message}`);
    }

    if (hubToken && userId) {
      await userController.updateUser(hubToken.access_token, userId);

      return res.redirect(`/success`);
    } else {
      return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Authentication failed' });
    }``
  } catch (error) {
    logger.error(`An error occurred: ${error}`);

    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
  }
});

export default router;

