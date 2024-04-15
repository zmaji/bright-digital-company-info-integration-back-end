import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../../typings/User';
import { HubToken } from '../../../typings/HubToken';
import { prismaMock } from '../../utils/singleton';
import { exchangeTokens } from '../../../helpers/hubspot/exchangeTokens';
import { storeHubTokens } from '../../../helpers/database/storeHubToken';
import { getCurrentPortal } from '../../../helpers/hubspot/getCurrentPortalId';
import authController from '../../../controllers/Auth';
import logger from '../../../utils/Logger';

jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../../helpers/hubspot/exchangeTokens');
jest.mock('../../../helpers/database/storeHubToken');
jest.mock('../../../helpers/hubspot/getCurrentPortalId');
jest.mock('../../../utils/Logger');

const hubSpotCode = 'hubspot_code';

const user: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'john@example.com',
  password: 'hashed_password',
  roles: ['user'],
  hubSpotPortalId: 123,
  secret: 'secret_key',
  activationToken: '123',
  isActive: true,
};

const hubToken: HubToken = {
  id: 1,
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  expires_in: 3600,
  updated_at: new Date(),
  created_at: new Date(),
  portal_id: user.hubSpotPortalId || null,
};

const expiredHubToken: HubToken = {
  id: 1,
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  expires_in: 0,
  updated_at: new Date(),
  created_at: new Date(),
  portal_id: user.hubSpotPortalId || null,
};

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('generateAuthToken', () => {
    it('should generate a token for a given user', () => {
      jwt.sign = jest.fn().mockReturnValue('user_token');

      const token = authController.generateAuthToken(user);

      expect(jwt.sign).toHaveBeenCalledWith({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        roles: user.roles,
        hubSpotPortalId: user.hubSpotPortalId,
      }, user.secret);

      expect(token).toEqual('user_token');
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user successfully', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(user);
      bcrypt.compareSync = jest.fn().mockReturnValue(true);
      jwt.sign = jest.fn().mockReturnValue('user_token');

      const result = await authController.authenticateUser(user.emailAddress, 'valid_password');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { emailAddress: user.emailAddress },
      });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('valid_password', user.password);
      expect(jwt.sign).toHaveBeenCalledWith(expect.any(Object), user.secret);
      expect(result).toEqual('user_token');
      expect(logger.info).toHaveBeenCalledWith('User authenticated successfully');
    });

    it('should return error message if password does not match', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(user);

      bcrypt.compareSync = jest.fn().mockReturnValue(false);

      const result = await authController.authenticateUser(user.emailAddress, 'invalid_password');

      expect(result).toEqual('Email address and password did not match.');
      expect(logger.error).toHaveBeenCalledWith('Wrong password provided');
    });

    it('should return error message if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await authController.authenticateUser('nonexistent@example.com', 'valid_password');

      expect(result).toEqual('User with email address nonexistent@example.com does not exist.');
      expect(logger.error).toHaveBeenCalledWith('No user with email address nonexistent@example.com found');
    });

    it('should return error message if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await authController.authenticateUser('nonexistent@example.com', 'valid_password');

      expect(result).toEqual('User with email address nonexistent@example.com does not exist.');
    });
  });

  describe('authenticateHubSpotUser', () => {
    it('should authenticate a HubSpot user successfully', async () => {
      (exchangeTokens as jest.Mock).mockResolvedValue(hubToken);
      (getCurrentPortal as jest.Mock).mockResolvedValue(user.hubSpotPortalId);

      const result = await authController.authenticateHubSpotUser(hubSpotCode);

      expect(exchangeTokens).toHaveBeenCalled();
      expect(storeHubTokens).toHaveBeenCalledWith(hubToken, user.hubSpotPortalId);
      expect(result).toEqual(hubToken);
    });

    it('should return null if HubSpot authentication fails', async () => {
      (exchangeTokens as jest.Mock).mockResolvedValue(null);

      const result = await authController.authenticateHubSpotUser(hubSpotCode);

      expect(result).toBeNull();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh the access token', async () => {
      (exchangeTokens as jest.Mock).mockResolvedValue(hubToken);
      (storeHubTokens as jest.Mock).mockResolvedValue(hubToken);

      if (user.hubSpotPortalId !== undefined && user.hubSpotPortalId !== null) {
        const result = await authController.refreshAccessToken(user.hubSpotPortalId, 'refresh_token');

        expect(exchangeTokens).toHaveBeenCalled();
        expect(storeHubTokens).toHaveBeenCalledWith(hubToken, user.hubSpotPortalId);
        expect(result).toEqual(hubToken);
      }
    });

    it('should return null if token exchange fails', async () => {
      (exchangeTokens as jest.Mock).mockResolvedValue(null);

      if (user.hubSpotPortalId !== undefined && user.hubSpotPortalId !== null) {
        const result = await authController.refreshAccessToken(user.hubSpotPortalId, 'refresh_token');
        expect(result).toBeNull();
      }
    });
  });

  describe('retrieveHubToken', () => {
    it('should retrieve HubSpot token for a given portal ID', async () => {
      prismaMock.hubToken.findUnique.mockResolvedValue(hubToken);

      if (user.hubSpotPortalId !== undefined && user.hubSpotPortalId !== null) {
        const result = await authController.retrieveHubToken(user.hubSpotPortalId);

        expect(prismaMock.hubToken.findUnique).toHaveBeenCalledWith({
          where: { portal_id: user.hubSpotPortalId },
        });
        expect(result).toEqual(hubToken);
      }
    });
  });

  describe('isTokenExpired', () => {
    it('should return true if token is expired', async () => {
      const result = await authController.isTokenExpired(expiredHubToken);

      if (expiredHubToken.updated_at !== null) {
        expect(result).toBe(Date.now() >= Date.parse(expiredHubToken.updated_at.toString()) + Number(hubToken.expires_in) * 1000);
      }
    });

    it('should return false if token is not expired', async () => {
      const result = await authController.isTokenExpired(hubToken);

      expect(result).toBe(false);
    });
  });
});

