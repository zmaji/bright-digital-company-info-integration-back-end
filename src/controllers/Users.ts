import type { User } from '../typings/User';

import prisma from '../database/Client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import logger from '../utils/Logger';

const getUser = async (emailAddress: string): Promise<User | null> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        emailAddress: emailAddress,
      },
    });

    if (existingUser) {
      logger.info(`User with emailaddress: ${emailAddress} found!`);

      return existingUser;
    } else {
      logger.warn(`Could not find an existing user with email: ${emailAddress}`);

      return null;
    }
  } catch (error) {
    logger.fatal('Something went wrong getting a user');
    throw error;
  }
};

const createUser = async (userData: User): Promise<User | null> => {
  try {
    const { firstName, lastName, emailAddress, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser: User = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: hashedPassword,
        secret: uuidv4(),
        roles: ['Gebruiker'],
      },
    });

    if (newUser) {
      logger.success('Successfully created a new user');

      return newUser;
    } else {
      logger.error('Something went wrong creating a new user');

      return null;
    }
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId: number, portalId: number): Promise<User | null> => {
  try {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hubSpotPortalId: portalId,
        },
      });

      return updatedUser;
  } catch (error) {
    throw error;
  }
};

const usersController = {
  getUser,
  createUser,
  updateUser,
};

export default usersController;
