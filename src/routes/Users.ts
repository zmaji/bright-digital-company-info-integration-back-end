import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import userController from '../controllers/Users';
import isLoggedIn from '../middleware/IsLoggedIn';
import { User } from '../typings/User';

const router = Router();

router.get('', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string | undefined = req.user?.emailAddress;
      const result: User | null = await userController.getUser(emailAddress);
      if (result) {
        res
            .status(StatusCodes.OK)
            .json(result);
      } else {
        res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: `Unable to get user with ID ${emailAddress}` });
      }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving a user' });
  }
});

router.post('', async (req: Request, res: Response) => {
  try {
    const { emailAddress, password } = req.body;

    if (emailAddress && password) {
      const existingUser: User | null = await userController.getUser(emailAddress);

      if (!existingUser) {
        const newUser: User | null = await userController.createUser(req.body);

        if (newUser) {
          res
              .status(StatusCodes.CREATED)
              .json(newUser);
        } else {
          res
              .status(StatusCodes.BAD_REQUEST)
              .json({ error: 'Failed to create a new user.' });
        }
      } else {
        res
            .status(StatusCodes.CONFLICT)
            .json({ error: 'User already exists' });
      }
    } else {
      res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Not all registration fields were entered correctly.' });
    }
  } catch (error) {
    console.error(error);
  }
});

router.put('', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.id && req.portalId) {
      const result: User | null = await userController.updateUser(req.user.id, req.portalId);
      if (result) {
        res
            .status(StatusCodes.OK)
            .json(result);
      } else {
        res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: `Unable to update user with ID ${req.user.id}` });
      }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving a user' });
  }
});

export default router;
