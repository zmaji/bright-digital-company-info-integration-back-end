import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import authController from '../controllers/Auth';
import { HubToken } from '../typings/HubToken';
import logger from '../utils/Logger';
// import isLoggedIn from '../middleware/IsLoggedIn';
import userController from '../controllers/Users';
// import { User } from '../typings/User';
import dotenv from 'dotenv';

dotenv.config();

const frontEndBaseUrl = process.env.FRONT_END_BASE_URL

const router = Router();

router.post('', async (req: Request, res: Response) => {
  try {
    const { emailAddress, password } = req.body;

    const result = await authController.authenticateUser(emailAddress, password);

    if (typeof result === 'string' && result === 'Email address and password did not match.') {
      res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Authentication failed: wrong email address and/or password' });
    } else if (typeof result === 'string' && result === `User with email address ${emailAddress} does not exist.`) {
      res
          .status(StatusCodes.CONFLICT)
          .json({ error: 'Email address does not exists' });
    } else {
      res
          .status(StatusCodes.OK)
          .json({ result });
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

    // eslint-disable-next-line
    // const userId: number | undefined = req.user?.id;
    const userId: number = 5;

    if (hubSpotCode) {
      const hubToken: HubToken | null = await authController.authenticateHubSpotUser(hubSpotCode);

      if (hubToken && hubToken.message) {
        logger.error(`Error while retrieving tokens: ${hubToken.message}`);

        return res.redirect(`/error?msg=${hubToken.message}`);
      }

      if (hubToken && userId) {
        await userController.updateUser(hubToken.access_token, userId);

        return res.redirect(`${frontEndBaseUrl}/overview`);
      } else {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'Authentication failed' });
      }
    } else {
      res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Code parameter missing or invalid' });
    }
  } catch (error) {
    logger.error(`An error occurred: ${error}`);

    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
  }
});

export default router;

