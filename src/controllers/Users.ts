import type { User } from '../typings/User';

import prisma from '../database/Client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import logger from '../utils/Logger';
import { sendActivationEmail } from '../helpers/sendActivationEmail';

// This is a temporary function made for version 1
// In the next version, Company.info credentials will be saved at a HubToken in the database
const getUser = async (identifier: string | number): Promise<User | null> => {
  try {
    if (typeof identifier === 'string') {
      const existingUser = await prisma.user.findUnique({
        where: { emailAddress: identifier },
      });

      if (existingUser) {
        logger.success(`User succesfully retrieved!`);

        return existingUser;
      } else {
        logger.warn(`Could not find an existing user with email: ${identifier}`);

        return null;
      }
    } else if (typeof identifier === 'number') {
      const users = await prisma.user.findMany({
        where: { hubSpotPortalId: identifier },
      });

      const userWithCompanyInfo = users.find(
          (user) =>
            user.companyInfoUserName != null &&
          user.companyInfoUserName !== '' &&
          user.companyInfoPassword != null &&
          user.companyInfoPassword !== '',
      );

      if (userWithCompanyInfo) {
        return userWithCompanyInfo;
      } else {
        logger.warn(`No user with hubSpotPortalId: ${identifier} has both companyInfoUserName and companyInfoPassword`);

        return null;
      }
    } else {
      throw new Error('Either emailAddress (string) or hubSpotPortalId (number) must be provided');
    }
  } catch (error) {
    logger.error('Something went wrong getting a user', error);
    throw error;
  }
};

const getUsers = async (): Promise<User[] | null> => {
  try {
    const users = await prisma.user.findMany();

    if (users) {
      return users;
    } else {
      return null;
    }
  } catch (error) {
    logger.error('Something went wrong getting all users', error);
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
    const { firstName, lastName, emailAddress, password, roles } = userData;
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
  getUsers,
  createUser,
  updateUser,
  verifyUser,
};

export default usersController;
