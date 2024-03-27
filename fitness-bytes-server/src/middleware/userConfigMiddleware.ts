
import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User";
import UserConfigModel, { IUserConfig } from "../models/UserConfig";

type RequestWithConfig = Request & {userConfig: IUserConfig | null};

const userConfigMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const request: RequestWithConfig = req as RequestWithConfig;
    const username = (req.user as IUser).username;
    request.userConfig = await UserConfigModel.findOne({username: username});

    if (!request.userConfig) {
        return res.status(500).json({
            message: "Error, userConfig is not defined."
        })
    }

    req = request;
    next();
};

export type { RequestWithConfig };
export default userConfigMiddleware;