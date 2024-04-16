import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prismaMock } from '../../utils/singleton';
import jwt from 'jsonwebtoken';
import isLoggedIn from '../../../middleware/IsLoggedIn';

jest.mock('jsonwebtoken');

describe('isLoggedIn middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next() if user is authenticated', async () => {
    const token = 'valid_token';
    req.headers = { authorization: `Bearer ${token}` };
    const payload = { id: 1 };

    (jwt.decode as jest.Mock).mockReturnValueOnce(payload);
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1, secret: 'user_secret' });
    (jwt.verify as jest.Mock).mockReturnValueOnce(payload);

    await isLoggedIn(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(payload);
  });

  it('should send UNAUTHORIZED if token is missing', async () => {
    await isLoggedIn(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.send).toHaveBeenCalledWith({ error: 'Authentication required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should send UNAUTHORIZED if token is invalid', async () => {
    const token = 'invalid_token';
    req.headers = { authorization: `Bearer ${token}` };

    (jwt.decode as jest.Mock).mockReturnValueOnce({ id: 1 });
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    await isLoggedIn(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.send).toHaveBeenCalledWith({ error: 'Authentication required' });
    expect(next).not.toHaveBeenCalled();
  });
});
