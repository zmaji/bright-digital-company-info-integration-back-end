import usersController from '../controllers/Users';
import { prismaMock } from './utils/singleton';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

test('should create new user', async () => {
  const password = '123';
  const hashedPassword = await bcrypt.hash(password, 12);
  const secret = uuidv4();

  const data = {
    emailAddress: 'maurice@brightdigital.com',
    password: hashedPassword,
    secret: secret,
    roles: ['Gebruiker'],
  };

  prismaMock.user.create.mockResolvedValueOnce({
    id: 1,
    hubSpotPortalId: null,
    ...data,
  });

  await expect(usersController.createUser(data)).resolves.toEqual({
    id: 1,
    hubSpotPortalId: null,
    emailAddress: 'maurice@brightdigital.com',
    password: hashedPassword,
    secret: secret,
    roles: ['Gebruiker'],
  });
});
