import bcrypt from 'bcryptjs';
import UserModel from '../models/User';

export const validatePassword = async (username: string, password: string): Promise<boolean> => {
    // Retrieve the hashed password from the database.
    const user = await UserModel.findOne({ username }).select('password');
    const retrievedPassword = user?.password;
    if (!retrievedPassword) return false;

    // Compare the entered password with the stored hash.
    return bcrypt.compare(password, retrievedPassword);
};
