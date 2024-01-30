import Payload from "../interfaces/Payload";
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jwt-simple';

dotenv.config();
const SECREYKEY = process.env.SECRETKEY || "";

function authMiddleware(req: Request & {user?: string}, res: Response, next: any) {
    const token = req.headers.authorization || (req.query.token as string);

    if (!token) {
        const payload: Payload = {
            message: "Unauthorized: Token missing",
        }
        return res.status(401).json(payload);
    }

    try {
        const decoded = jwt.decode(token, SECREYKEY);

        // Attach user information to the request object
        req.user = decoded;

        next(); // Continue to the protected route
    } catch (error) {
        const payload: Payload = {
            message: "Unauthorized: Invalid token",
        }

        return res.status(401).json(payload);
    }
}

export default authMiddleware