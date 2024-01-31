import { APIResponse } from "../routes/api";
import { Request, Response } from "express";

function jsonMiddleware(req: Request, res: Response, next: any) {
    if (req.get("Content-Type") !== "application/json") {
        
        const payload: APIResponse = {
            message: "Error: Expect Content-Type application/json",
        }

        return res.status(400).json(payload);
    }

    next();
}

export default jsonMiddleware;