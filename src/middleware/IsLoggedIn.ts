import type { User } from '../typings/User';

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const userToken = getTokenFromRequest(req);

  if (userToken) {
    const payload = await verifyToken(userToken);

    if (payload) {
    // @ts-ignore
      req.user = payload as User;

      return next();
    }
  }
  res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ error: 'Authentication required' });
};

const getTokenFromRequest = (req: Request) => {
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    return authHeader.split(' ')[1];
  }

  return false;
};

const verifyToken = async (userToken: string) => {
  const tokenPayload = jwt.decode(userToken) as { id: number } | null;

  if (tokenPayload) {
    try {
      const user: User | null = await prisma.user.findUnique({
        where: {
          id: tokenPayload.id,
        },
      });

      if (user) {
        try {
          return jwt.verify(userToken, user.secret);
        } catch (error) {
          console.error('Something went wrong returning the token', error);

          return null;
        }
      }
    } catch (error) {
      console.error('Something went wrong retrieving the user', error);

      return null;
    }
  }

  return null;
};

export default isLoggedIn;
