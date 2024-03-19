import Socket from "../services/socket";

function authMiddleware(req: any, res: any, next: any) {
    if (req.isAuthenticated()){
        Socket.io
        next();
    }
    else {
        res.status(403).json({
            message: "Authentication required",
            result: false,
            redirect: true,
            redirectTo: '',
        });
    }
}

function noAuthMiddleware(req: any, res: any, next: any) {
    if (!req.isAuthenticated()){
        next();
    }
    else {
        res.status(403).json({
            message: "Authentication not Required",
            result: false,
        });
    }
}

export { authMiddleware, noAuthMiddleware };

