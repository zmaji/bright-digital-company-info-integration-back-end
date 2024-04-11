import usersController from '../../controllers/Users';
import { prismaMock } from '../utils/singleton';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

describe('Users Controller Tests', () => {
  let hashedPassword = '';
  const password = '123';
  const emailAddress = 'maurice@brightdigital.com';
  const userId = 1;
  const secret = uuidv4();
  const activationToken = uuidv4();

  const data = {
    firstName: 'Maurice',
    lastName: 'ten Teije',
    emailAddress: emailAddress,
    password: hashedPassword,
    secret: secret,
    roles: ['Gebruiker'],
    isActive: false,
    activationToken: activationToken,
  };

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(password, 12);
  });

  test('should create a new system user', async () => {
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

    await expect(usersController.updateUser(userId, updateFields)).rejects.toThrowError('Failed to update user');
  });
});
