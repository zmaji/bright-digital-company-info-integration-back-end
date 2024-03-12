import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import userController from '../controllers/Users';
import isLoggedIn from '../middleware/IsLoggedIn';

const router = Router();

// router.get('', isLoggedIn, async (req: Request, res: Response) => {
router.get('', async (req: Request, res: Response) => {
  try {
    // const userId: number | undefined = req.user?.id;
    const userId: number = 4;
    const result = await userController.getUser(userId);

    if (result) {
      res
          .status(StatusCodes.OK)
          .json(result);
    } else {
      res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: `Unable to get user with ID ${userId}` });
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving a user' });
  }
});

router.post('', async (req: Request, res: Response) => {
  try {
    const existingUser = await userController.getUserEmail(req.body);

    if (!existingUser) {
      const result = await userController.createUser(req.body);

      if (result) {
        res
            .status(StatusCodes.CREATED)
            .json(result);
      } else {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json(result);
      }
    } else {
      res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'User already exists' });
    }
  } catch (error) {
    res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Not all registration fields were entered correctly.' });
  }
});

export default router;
