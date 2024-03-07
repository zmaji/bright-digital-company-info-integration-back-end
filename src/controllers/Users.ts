import type { User } from '../typings/User';

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import logger from '../utils/Logger';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const getUser = async (userId: number): Promise<User | null> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (existingUser) {
      logger.info('User successfully found: ', existingUser);
      return existingUser;
    } else {
      logger.error(`Could not find an existing user with id: ${userId}`);
      return null;
    }
  } catch (error) {
    logger.error('Something went wrong getting a user');
    throw error;
  }
};


const createUser = async (userData: User): Promise<User | null> => {
  try {
    const { emailAddress, password } = userData;

    const existingUser = await prisma.user.findUnique({
      where: {
        emailAddress: emailAddress,
      },
    });

    if (existingUser) {
      logger.warn('This email address is already in use');
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser: User = await prisma.user.create({
      data: {
        emailAddress: emailAddress,
        password: hashedPassword,
        secret: uuidv4(),
        roles: ['Gebruiker'],
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (accessToken: string, userId: number): Promise<User | null> => {
  try {
    const existingToken = await prisma.hubToken.findUnique({
      where: {
        access_token: accessToken,
      },
    });
    
    if (existingToken) {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hubSpotPortalId: existingToken.portal_id,
        },
      });
      return updatedUser;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

const usersController = {
  getUser,
  createUser,
  updateUser,
};

export default usersController;
