import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import userController from '../controllers/Users';
import isLoggedIn from '../middleware/IsLoggedIn';
import { User } from '../typings/User';
import logger from '../utils/Logger';

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
            .json({ error: `Unable to get user with identifier ${emailAddress}` });
      }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving a user' });
  }
});

router.get('/:userId', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user) {
      console.log('req.params.userId')
      console.log('req.params.userId')
      console.log('req.params.userId')
      console.log('req.params.userId')
      console.log(req.params.userId)
      const userId: number | undefined = req.params.userId ? parseInt(req.params.userId, 10) : undefined;

      if (userId === undefined || isNaN(userId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Invalid user ID' });
      }

      const result = await userController.getUserById(userId);

      if (result) {
        res
          .status(StatusCodes.OK)
          .json(result);
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: `Unable to get user with ID ${userId}` });
      }
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'User not authenticated' });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'An error occurred retrieving a user' });
  }
});


router.get('/all', isLoggedIn, async (req: Request, res: Response) => {
  logger.info('entered all users route');

  try {
    const users = await userController.getUsers();

    logger.info('users')
    logger.info(users)

    if (users) {
      res
        .status(StatusCodes.OK)
        .json(users);
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving all users' });
  }
});

router.get('/verify', async (req: Request, res: Response) => {
  try {
    if (req && req.query && req.query.activationCode && req.query.userId) {
      const activationCode: string | undefined = req.query.activationCode as string;
      const userId: string | undefined = req.query.userId as string;
      const userIdNumber: number | undefined = userId ? parseInt(userId, 10) : undefined;

      if (userIdNumber) {
        const result: boolean | null = await userController.verifyUser(userIdNumber, activationCode);

        if (result) {
          const updateFields = {
            isActive: true,
          };

          const updatedUser = await userController.updateUser(userIdNumber, updateFields);

          if (updatedUser) {
            res
                .status(StatusCodes.OK)
                .json('Successfully entered activation code');
          } else {
            res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: 'Wrong activation code entered' });
          }
        }
      }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred verifying a user' });
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
  logger.info('Updating a user..');

  try {
    if (req.user && req.user.id && req.body.updateFields) {
      const updateFields = req.body.updateFields;

      if (updateFields.hubSpotPortalId) {
        updateFields.hubSpotPortalId = parseInt(updateFields.hubSpotPortalId);
      }

      if (updateFields) {
        const result: User | null = await userController.updateUser(req.user.id, updateFields);

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
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred updating a user' });
  }
});

export default router;
