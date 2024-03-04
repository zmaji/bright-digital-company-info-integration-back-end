import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import authController from '../controllers/Auth';

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
      const { code } = req.query;
      const token = await authController.authenticateHubSpotUser(code);
  
      if (token) {
        res
            .status(StatusCodes.OK)
            .json({ token });
      } else {
        res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'Authentication failed' });
      }
    } catch (error) {
      res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'An error occurred' });
    }
  });
  
  export default router;
  
  