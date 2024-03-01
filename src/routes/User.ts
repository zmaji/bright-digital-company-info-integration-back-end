import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import userController from '../controllers/User';

const router = Router();

router.post('', async (req: Request, res: Response) => {
    try {
      const result = await userController.createUser(req.body);
  
      if (typeof result !== 'string') {
        res
            .status(StatusCodes.CREATED)
            .json(result);
      } else {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json(result);
      }
    } catch (error) {
      res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Not all registration fields were entered correctly.' });
    }
  });
  
  export default router;