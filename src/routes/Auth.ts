import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import authController from '../controllers/Auth';
import { HubToken } from '../typings/HubToken';

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

router.get('/oauth-callback', async (req, res) => {
  try {
    console.log('User has been prompted to install the integration..');
    const hubSpotCode: string | undefined = typeof req.query.code === 'string' ? req.query.code : undefined;

    if (!hubSpotCode) {
      return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Code parameter missing or invalid' });
    }

    const hubToken: HubToken | null = await authController.authenticateHubSpotUser(hubSpotCode);

    if (hubToken && hubToken.message) {
      console.error(`Error while retrieving tokens: ${hubToken.message}`);

      return res.redirect(`/error?msg=${hubToken.message}`);
    }

    if (hubToken) {
      return res.redirect(`/success`);
    } else {
      return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);

    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
  }
});

export default router;

