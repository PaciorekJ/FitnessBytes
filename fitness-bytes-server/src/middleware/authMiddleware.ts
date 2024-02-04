
import { Request, Response } from 'express';
import jwt from 'jwt-simple';
import Payload from "../interfaces/Payload";

function authMiddleware(req: Request & {user?: string}, res: Response, next: any) {
    const SECREYKEY = process.env.SECRETKEY || "";
    
    // Extract token from cookies
    const token = req.cookies.token;

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

        console.error(error);

        const payload: Payload = {
            message: "Unauthorized: Invalid token"
        }

        return res.status(401).json(payload);
    }
}

export default authMiddleware