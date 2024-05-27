import usersController from '../../../controllers/Users';
import logger from '../../../utils/Logger';
import { prismaMock } from '../../utils/singleton';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../../utils/Logger');

describe('Users Controller Tests', () => {
  let hashedPassword = '';
  const password = '123';
  const emailAddress = 'maurice@brightdigital1.com';
  const userId = 1;
  const secret = uuidv4();
  const activationCode = '12345';
  const nonExistingActivationCode = '324213';

  const data = {
    firstName: 'Maurice',
    lastName: 'ten Teije',
    emailAddress: emailAddress,
    password: hashedPassword,
    secret: secret,
    roles: ['Gebruiker'],
    isActive: false,
    activationToken: activationCode,
  };

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(password, 12);
  });

  test('should create a new system user', async () => {
    // @ts-ignore
    prismaMock.user.create.mockResolvedValueOnce({
      id: userId,
      hubSpotPortalId: null,
      domain: null,
      companyInfoUserName: null,
      companyInfoPassword: null,
      ...data,
    });

    await expect(usersController.createUser(data)).resolves.toEqual({
      id: userId,
      hubSpotPortalId: null,
      domain: null,
      companyInfoUserName: null,
      companyInfoPassword: null,
      ...data,
    });
  });

  test('should handle error during user creation', async () => {
    prismaMock.user.create.mockRejectedValueOnce(new Error('Failed to create user'));

    await expect(usersController.createUser(data)).rejects.toThrow('Failed to create user');
  });

  test('should get user by email address', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: userId,
      hubSpotPortalId: null,
      domain: null,
      companyInfoUserName: null,
      companyInfoPassword: null,
      ...data,
    });

    await expect(usersController.getUser(emailAddress)).resolves.toEqual({
      id: userId,
      hubSpotPortalId: null,
      domain: null,
      companyInfoUserName: null,
      companyInfoPassword: null,
      ...data,
    });
  });

  test('should handle error during user retrieval', async () => {
    prismaMock.user.findUnique.mockRejectedValueOnce(new Error('Failed to find user'));

    await expect(usersController.getUser(emailAddress)).rejects.toThrow('Failed to find user');
  });

  test('should handle null if user not found by email address', async () => {
    const nonExistingEmail = 'nonexistent@brightdigital.com';

    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    await expect(usersController.getUser(nonExistingEmail)).resolves.toBeNull();
  });

  test('should update user with specified fields', async () => {
    const updateFields = {
      firstName: 'NewFirstName',
    };

    const updatedUserMock = {
      id: userId,
      ...updateFields,
    };

    // @ts-ignore
    prismaMock.user.update.mockResolvedValueOnce(updatedUserMock);

    const expectedResponse = {
      id: userId,
      ...updateFields,
    };

    await expect(usersController.updateUser(userId, updateFields)).resolves.toEqual(expectedResponse);
  });

  test('should handle error during user update', async () => {
    const updateFields = {
      firstName: 'NewFirstName',
    };

    prismaMock.user.update.mockRejectedValueOnce(new Error('Failed to update user'));

    await expect(usersController.updateUser(userId, updateFields)).rejects.toThrow('Failed to update user');
  });

  test('should return true if matching activation token is found', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: userId,
      hubSpotPortalId: null,
      domain: null,
      companyInfoUserName: null,
      companyInfoPassword: null,
      ...data,
    });

    const result = await usersController.verifyUser(userId, activationCode);

    expect(result).toBe(true);
    expect(logger.info).toHaveBeenCalledWith('Matching activation token found found!');
  });

  test('should return false if no matching activation token is found', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const result = await usersController.verifyUser(userId, nonExistingActivationCode);

    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalledWith('No matching token!');
  });

  test('should handle error when retrieving activation token', async () => {
    const error = new Error('Failed to retrieve activation token');

    prismaMock.user.findUnique.mockRejectedValueOnce(error);

    await expect(usersController.verifyUser(userId, activationCode)).rejects.toThrow(error);
    expect(logger.fatal).toHaveBeenCalledWith('Something went wrong retrieving an activation token');
  });
});
