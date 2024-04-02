// import usersController from '../../controllers/Users';
// import { prismaMock } from '../utils/singleton';
// import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';

// describe('Users Controller Tests', () => {
//   let hashedPassword = '';
//   let secret = '';
//   const emailAddress = 'maurice@brightdigital.com';
//   const portalId = 123;
//   const accessToken = '123';
//   const refreshToken = '123';
//   const userId = 1;

//   beforeAll(async () => {
//     hashedPassword = await bcrypt.hash('123', 12);
//     secret = uuidv4();
//   });

//   test('should create a new system user', async () => {
//     const data = {
//       emailAddress: emailAddress,
//       password: hashedPassword,
//       secret: secret,
//       roles: ['Gebruiker'],
//     };

//     prismaMock.user.create.mockResolvedValueOnce({
//       id: userId,
//       hubSpotPortalId: null,
//       ...data,
//     });

//     await expect(usersController.createUser(data)).resolves.toEqual({
//       id: userId,
//       hubSpotPortalId: null,
//       emailAddress: emailAddress,
//       password: hashedPassword,
//       secret: secret,
//       roles: ['Gebruiker'],
//     });
//   });

//   test('should handle error during user creation', async () => {
//     const data = {
//       emailAddress: emailAddress,
//       password: hashedPassword,
//       secret: secret,
//       roles: ['Gebruiker'],
//     };

//     prismaMock.user.create.mockRejectedValueOnce(new Error('Failed to create user'));

//     await expect(usersController.createUser(data)).rejects.toThrowError('Failed to create user');
//   });

//   test('should get user by email address', async () => {
//     prismaMock.user.findUnique.mockResolvedValueOnce({
//       id: 1,
//       hubSpotPortalId: null,
//       emailAddress: emailAddress,
//       password: hashedPassword,
//       secret: secret,
//       roles: ['Gebruiker'],
//     });

//     await expect(usersController.getUser(emailAddress)).resolves.toEqual({
//       id: 1,
//       hubSpotPortalId: null,
//       emailAddress: emailAddress,
//       password: hashedPassword,
//       secret: secret,
//       roles: ['Gebruiker'],
//     });
//   });

//   test('should handle error during user retrieval', async () => {
//     prismaMock.user.findUnique.mockRejectedValueOnce(new Error('Failed to find user'));

//     await expect(usersController.getUser(emailAddress)).rejects.toThrowError('Failed to find user');
//   });

//   test('should return null if user not found by email address', async () => {
//     const nonExistingEmail = 'nonexistent@brightdigital.com';

//     prismaMock.user.findUnique.mockResolvedValueOnce(null);

//     await expect(usersController.getUser(nonExistingEmail)).resolves.toBeNull();
//   });

//   test('should update user with hubSpotPortalId when token exists', async () => {
//     prismaMock.hubToken.findUnique.mockResolvedValueOnce({
//       id: 1,
//       portal_id: portalId,
//       access_token: accessToken,
//       refresh_token: refreshToken,
//       expires_in: 3600,
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     prismaMock.user.update.mockResolvedValueOnce({
//       id: userId,
//       hubSpotPortalId: portalId,
//       emailAddress: emailAddress,
//       password: hashedPassword,
//       secret: secret,
//       roles: ['Gebruiker'],
//     });

//     const result = await usersController.updateUser(accessToken, userId);

//     expect(result).toEqual({
//       id: userId,
//       hubSpotPortalId: portalId,
//       emailAddress: emailAddress,
//       password: hashedPassword,
//       secret: secret,
//       roles: ['Gebruiker'],
//     });
//   });

//   test('should return null if access token not found', async () => {
//     const accessToken = 'nonexistentAccessToken';
//     const userId = 1;

//     prismaMock.hubToken.findUnique.mockResolvedValueOnce(null);

//     await expect(usersController.updateUser(accessToken, userId)).resolves.toBeNull();
//   });

//   test('should handle error during user update', async () => {
//     prismaMock.hubToken.findUnique.mockResolvedValueOnce({
//       id: 1,
//       portal_id: portalId,
//       access_token: accessToken,
//       refresh_token: refreshToken,
//       expires_in: 3600,
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     prismaMock.user.update.mockRejectedValueOnce(new Error('Failed to update user'));

//     await expect(usersController.updateUser(accessToken, userId)).rejects.toThrowError('Failed to update user');
//   });
// });
