import type { User } from '../typings/User';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export const authenticateUser = async (emailAddress: string, password: string): Promise<string | null> => {
    try {
      if (emailAddress && password) {
        const existingUser: User | null = await prisma.user.findUnique({
            where: {
                emailAddress: emailAddress,
            },
        });

        if (existingUser) {
          const matchedPassword = bcrypt.compareSync(password, existingUser.password);
  
          if (matchedPassword) {
            return jwt.sign({
              id: existingUser.id,
              emailAddress: existingUser.emailAddress,
              roles: existingUser.roles,
            }, existingUser.secret);
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };
  
  const authController = {
    authenticateUser,
  };
  
  export default authController;
  