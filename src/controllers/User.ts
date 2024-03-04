import type { User } from '../typings/User';

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import connectClient from '../database/Client';

const createUser = async (userData: User): Promise<User | string> => {
    try {
        const client = await connectClient();
        const { emailAddress, password } = userData;
        // const existingUser = await 

        // if (!existingUser) {
        userData.userID = uuidv4();
        userData.secret = uuidv4();

        const newUser = userData
        newUser.password = bcrypt.hashSync(userData.password, 12);
        newUser.roles = ['Gebruiker'];

        const query = 'INSERT INTO users (userID, emailAddress, password, roles) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [userData.userID, userData.emailAddress, userData.password, userData.roles];

        const result = await client.query(query, values);
        client.release();

        return result.rows[0];
        // } else {
        //     return 'This username is already in use';
        // }
    } catch (error) {
        throw error;
    }
}

const userController = {
    createUser,
  };
  
export default userController;
  
  