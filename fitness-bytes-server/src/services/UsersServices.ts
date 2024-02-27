
import mongoose from "mongoose";
import UserModel, { IUser } from '../models/user';

// *** Return True if addition was successful, false otherwise ***
async function addUser(user: Partial<IUser>): Promise<boolean> {
    try {
        await UserModel.create(user);
        return true;
    } catch (error) {
        return false;
    }
}

// Return undefined if not valid
async function getUserIDFromUsername(username: string): Promise<mongoose.Types.ObjectId | undefined> {
    const user = await UserModel.findOne({ username: username }).select('_id');
    return user?._id;
}

// Get password from username and return "" if not valid
async function getPasswordFromUsername(username: string): Promise<string> {
    const user = await UserModel.findOne({ username: username }).select('password');
    return user?.password || "";
}

export { addUser, getPasswordFromUsername, getUserIDFromUsername };

