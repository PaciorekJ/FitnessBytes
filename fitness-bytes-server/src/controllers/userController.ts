
import { client, connectDB } from '../db';
import User from '../models/user'

connectDB();
const db = client.db('Fitness-Bytes-DB');
const usersCollection = db.collection<User>('users');

// *** Return True if addition was successful, false otherwise ***
async function addUser(user: User){
    return (await usersCollection.insertOne(user)).acknowledged;
}

// return -1 if not valid
async function getUserIDFromUsername(username: string) {
    return parseInt(((await usersCollection.findOne({username: username}))?._id || "-1").toString());
}

// Get password from cell and return "" if not valid
async function getPasswordFromUsername(username: string) {
    return (await usersCollection.findOne({username: username}))?.password || "";
}

export {addUser, getPasswordFromUsername, getUserIDFromUsername}