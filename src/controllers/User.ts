import type { User } from '../typings/User';

import { v4 as uuidv4 } from 'uuid';

const createUser = async (userData: User): Promise<User | string> => {
    try {
        const { emailAddress, password } = userData;
        // const existingUser = await 

        // if (!existingUser) {
        userData.userID = uuidv4();
        userData.secret = uuidv4();

        const newUser = userData
        return newUser;
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
  
  