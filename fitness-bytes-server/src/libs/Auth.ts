import bcrypt from 'bcrypt';
import UserModel from '../models/User';

export const validatePassword = async (username: string, password: string): Promise<boolean> => {
    const user = await UserModel.findOne({ username }).select('password');
    const storedHash = user?.password;
    if (!storedHash) return false;

    return bcrypt.compare(password, storedHash);
};
