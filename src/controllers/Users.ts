import type { User } from '../typings/User';

import prisma from '../database/Client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import logger from '../utils/Logger';
import { sendActivationEmail } from '../helpers/sendActivationEmail';

const getUser = async (identifier: string | number): Promise<User | null> => {
  try {
    let query = {};

    if (typeof identifier === 'string') {
      query = { emailAddress: identifier };
    } else if (typeof identifier === 'number') {
      query = { hubSpotPortalId: identifier };
    } else {
      throw new Error('Either emailAddress (string) or portalId (number) must be provided');
    }

    const existingUser = await prisma.user.findUnique({
      // @ts-expect-error QUERY
      where: query,
    });

    if (existingUser) {
      // eslint-disable-next-line
      logger.info(`User with ${typeof identifier === 'string' ? `email: ${identifier}` : `portalId: ${identifier}`} found!`);

      return existingUser;
    } else {
      // eslint-disable-next-line
      logger.warn(`Could not find an existing user with ${typeof identifier === 'string' ? `email: ${identifier}` : `portalId: ${identifier}`}`);

      return null;
    }
  } catch (error) {
    logger.error('Something went wrong getting a user', error);
    throw error;
  }
};

const verifyUser = async (userId: number, activationCode: string): Promise<boolean> => {
  logger.info('Verifying activation code');

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (existingUser && existingUser.activationToken === activationCode) {
      logger.info(`Matching activation token found found!`);

      return true;
    } else {
      logger.error('No matching token!');

      return false;
    }
  } catch (error) {
    logger.fatal('Something went wrong retrieving an activation token');
    throw error;
  }
};

const createUser = async (userData: User): Promise<User | null> => {
  try {
    const { firstName, lastName, emailAddress, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    const activationToken = uuidv4();

    await sendActivationEmail(firstName, lastName, emailAddress, activationToken);

    const newUser: User = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: hashedPassword,
        secret: uuidv4(),
        roles: ['Gebruiker'],
        isActive: false,
        activationToken: activationToken,
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

const updateUser = async (userId: number, updateFields: Partial<User>): Promise<User | null> => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateFields,
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
  verifyUser,
};

export default usersController;
