import { NextFunction, Request, Response } from "express";
import Socket from "../services/socket";

const socketMiddleware = (req: Request & { io: any }, res: Response, next: NextFunction) => {
    req.io = Socket.io;
    next();
};

export default socketMiddleware;