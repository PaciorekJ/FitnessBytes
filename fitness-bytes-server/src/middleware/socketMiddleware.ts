import { NextFunction, Request, Response } from "express";
import Socket from "../services/socket";

const socketMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const request = req as Request & {io: any};
    request.io = Socket.io;
    req = request;
    next();
};

export default socketMiddleware;