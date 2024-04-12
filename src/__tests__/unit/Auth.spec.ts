import type { User } from '../../typings/User';

import authController from '../../controllers/Auth';
// import { exchangeTokens } from '../../helpers/hubspot/exchangeTokens';
// import { storeHubTokens } from '../../helpers/database/storeHubToken';
// import { getCurrentPortal } from '../../helpers/hubspot/getCurrentPortalId';
import { prismaMock } from '../utils/singleton';

jest.mock('../../helpers/hubspot/exchangeTokens');
jest.mock('../../helpers/database/storeHubToken');
jest.mock('../../helpers/hubspot/getCurrentPortalId');

describe('authController', () => {
  const emailAddress = 'john@example.com';
  const password = 'password';
  const hubSpotPortalId = 1234;
  const refreshToken = '1234';
  //   const hubSpotCode = 'valid_code';

  const user: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: emailAddress,
    roles: ['user'],
    hubSpotPortalId: hubSpotPortalId,
    password: password,
    secret: 'secret',
    domain: 'example.com',
    activationToken: '1234',
    isActive: true,
    companyInfoUserName: 'username',
    companyInfoPassword: 'password',
  };

  //   const exchangeProof = {
  //     grant_type: 'refresh_token',
  //     client_id: 'mockClientId123',
  //     client_secret: 'mockClientSecret456',
  //     redirect_uri: 'https://example.com/redirect',
  //     refresh_token: refreshToken,
  //   };

  const hubToken = {
    id: 1,
    portal_id: hubSpotPortalId,
    access_token: 'new_access_token',
    refresh_token: refreshToken,
    expires_in: 3600,
    created_at: new Date(),
    updated_at: null,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('generateAuthToken should return a valid JWT token', () => {
    const token = authController.generateAuthToken(user);
    expect(token).toBeDefined();
  });

  //   test('refreshAccessToken should return a new token', async () => {
  //     // @ts-ignore
  //     exchangeTokens.mockResolvedValueOnce(hubToken);
  //     // @ts-ignore
  //     storeHubTokens.mockResolvedValueOnce(true);

  //     // Call the function
  //     const result = await authController.refreshAccessToken(hubSpotPortalId, refreshToken);

  //     // Assert the result
  //     expect(exchangeTokens).toHaveBeenCalledWith(exchangeProof);
  //     expect(storeHubTokens).toHaveBeenCalledWith(hubToken, hubSpotPortalId);
  //     expect(result).toEqual(hubToken);
  //   });

  test('authenticateUser should return a JWT token for valid credentials', async () => {
    // @ts-ignore
    prismaMock.user.findUnique.mockResolvedValueOnce(user);

    // Call the function
    const result = await authController.authenticateUser(emailAddress, password);

    // Assert the result
    expect(result).toBeDefined();
    // You can add more assertions here to validate the token format or content
  });

  //   test('authenticateHubSpotUser should return a new token for valid code', async () => {
  //     // Mock dependencies
  //         // @ts-ignore
  //     exchangeTokens.mockResolvedValueOnce(hubToken);
  //         // @ts-ignore
  //     getCurrentPortal.mockResolvedValueOnce(123);
  //         // @ts-ignore
  //     storeHubTokens.mockResolvedValueOnce(true);

  //     // Call the function
  //     const result = await authController.authenticateHubSpotUser(hubSpotCode);

  //     // Assert the result
  //     expect(exchangeTokens).toHaveBeenCalledWith(exchangeProof);
  //     expect(getCurrentPortal).toHaveBeenCalledWith(hubToken.access_token);
  //     expect(storeHubTokens).toHaveBeenCalledWith(hubToken, 123);
  //     expect(result).toEqual(hubToken);
  //   });

  test('retrieveHubToken should return a valid token for existing portal ID', async () => {
    // Mock database response
    prismaMock.hubToken.findUnique.mockResolvedValueOnce(hubToken);

    // Mock isTokenExpired to return false
    jest.spyOn(authController, 'isTokenExpired').mockReturnValueOnce(false);

    // Call the function
    const result = await authController.retrieveHubToken(hubSpotPortalId);

    // Assert the result
    expect(result).toEqual(hubToken);
  });

  //   test('isTokenExpired should return false for valid token', () => {
  //     const result = authController.isTokenExpired(hubToken);
  //     expect(result).toBe(false);
  //   });

  test('authenticateUser should return error message for invalid email', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const result = await authController.authenticateUser(emailAddress, password);

    expect(result).toContain('does not exist');
  });

  test('authenticateUser should return error message for invalid password', async () => {
    // @ts-ignore
    prismaMock.user.findUnique.mockResolvedValueOnce(user);

    const result = await authController.authenticateUser(emailAddress, password);

    expect(result).toContain('did not match');
  });

  test('retrieveHubToken should return null for non-existing portal ID', async () => {
    jest.spyOn(prismaMock.hubToken, 'findUnique').mockResolvedValueOnce(null);

    const result = await authController.retrieveHubToken(hubSpotPortalId);

    expect(result).toBeNull();
  });

  //   test('retrieveHubToken should return null for expired token', async () => {
  //     prismaMock.hubToken.findUnique.mockResolvedValueOnce(hubToken);
  //     jest.spyOn(authController, 'isTokenExpired').mockReturnValueOnce(true);

  //     const result = await authController.retrieveHubToken(hubSpotPortalId);

//     expect(result).toBeNull();
//   });
});
