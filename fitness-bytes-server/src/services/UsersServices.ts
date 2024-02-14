
import { ObjectId } from "mongoose";
import UserModel, { IUser } from '../models/User';

// *** Return True if addition was successful, false otherwise ***
async function addUser(user: Partial<IUser>): Promise<boolean> {
    try {
        await UserModel.create(user);
        return true;
    } catch (error) {
        console.error("Error adding user:", error);
        return false;
    }
}

// Return undefined if not valid
async function getUserIDFromUsername(username: string): Promise<ObjectId | undefined> {
    const user = await UserModel.findOne({ username: username }).select('_id');
    return user?._id;
}

// Get password from username and return "" if not valid
async function getPasswordFromUsername(username: string): Promise<string> {
    const user = await UserModel.findOne({ username: username }).select('password');
    return user?.password || "";
}

export { addUser, getPasswordFromUsername, getUserIDFromUsername };

