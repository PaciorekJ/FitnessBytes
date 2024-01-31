
import { Request, Response } from "express";

interface Message {
    message: string;
}

function jsonMiddleware<T extends Message>(req: Request, res: Response, next: any) {
    if (req.get("Content-Type") !== "application/json") {
        
        const payload: T = {
            message: "Error: Expect Content-Type application/json",
        } as T

        return res.status(400).json(payload);
    }

    next();
}

export default jsonMiddleware;