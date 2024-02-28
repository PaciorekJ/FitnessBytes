import bcrypt from 'bcrypt';
import { getPasswordFromUsername } from "../services/UsersServices";

const SECREYKEY = process.env.SECRETKEY!;



export const validatePassword = async (username: string, password: string): Promise<boolean> => {
    // Retrieve the hashed password from the database
    const retrievedPassword = await getPasswordFromUsername(username);
    
    if (!retrievedPassword) return false;

    // Compare the entered password with the hashed password
    const passwordMatch = await bcrypt.compare(password, retrievedPassword);
    return passwordMatch;
}