import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import authController from '../controllers/Auth';
import { HubToken } from '../typings/HubToken';
import logger from '../utils/Logger';
import dotenv from 'dotenv';
import { getCurrentPortal } from '../helpers/hubspot/getCurrentPortalId';

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

router.get('/oauth-callback', async (req, res) => {
  try {
    logger.info('User has been prompted to install the integration..');
    const hubSpotCode: string | undefined = typeof req.query.code === 'string' ? req.query.code : undefined;

    if (hubSpotCode) {
      const hubToken: HubToken | null = await authController.authenticateHubSpotUser(hubSpotCode);

      if (hubToken) {
        const hubSpotPortalId: number | null = await getCurrentPortal(hubToken.access_token);

        if (hubSpotPortalId) {
          return res.redirect(`${frontEndBaseUrl}/thank-you?hubSpotPortalId=${hubSpotPortalId}`);
        } else {
          res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Portal id missing or invalid' });
        }
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

