import bcrypt from 'bcrypt';
import UserModel from '../models/User';

const SECREYKEY = process.env.SECRETKEY!;

export const validatePassword = async (username: string, password: string): Promise<boolean> => {
    
    // Retrieve the hashed password from the database
    const user = await UserModel.findOne({ username: username }).select('password');
    const retrievedPassword = user?.password;
    if (!retrievedPassword) return false;

    // Compare the entered password with the hashed password
    const passwordMatch = await bcrypt.compare(password, retrievedPassword);
    return passwordMatch;
}