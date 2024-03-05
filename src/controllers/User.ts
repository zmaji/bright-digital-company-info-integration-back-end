import type { User } from '../typings/User';

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const createUser = async (userData: User): Promise<User | string> => {
  try {
    const { emailAddress, password } = userData;

    const existingUser = await prisma.user.findUnique({
      where: {
        emailAddress: emailAddress,
      },
    });

    if (existingUser) {
      return 'This email address is already in use';
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
        accessToken: accessToken,
      },
    });
    
    if (existingToken) {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          portalId: existingToken.portalId,
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

const userController = {
  createUser,
  updateUser,
};

export default userController;
