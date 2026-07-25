import dotenv from 'dotenv';
dotenv.config();

import MongoStore from 'connect-mongo';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { isAllowedOrigin } from './config/origins';
import ResponseResult from './interfaces/ResponseResult';
import conversationRouter from './routes/conversation';
import friendRouter from './routes/friend';
import friendRequestRouter from './routes/friendRequest';
import messageRouter from './routes/message';
import notificationRouter from './routes/notifcations';
import postRouter from './routes/post';
import postsRouter from './routes/posts';
import replyRouter from './routes/reply';
import reportRouter from './routes/report';
import userRouter from './routes/user';
import userConfigRouter from './routes/userConfig';
import db from './services/db';
import './services/passport';
import Socket from './services/socket';

const PORT = Number(process.env.PORT || 5301);
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || "86400000", 10);
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';
const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '12mb';
const DB_URL = process.env.DB_URL;
const SECRETKEY = process.env.SECRETKEY;

if (!DB_URL) throw new Error('DB_URL is required');
if (!SECRETKEY) throw new Error('SECRETKEY is required');

const app: Express = express();
app.set('trust proxy', 1);
Socket.init(app);

const sessionStore: MongoStore = MongoStore.create({
    mongoUrl: DB_URL,
    autoRemove: 'interval',
    autoRemoveInterval: (COOKIE_MAX_AGE / 1000 / 60 * 1.2),
    collectionName: "sessions",
});

app.use(session({
    secret: SECRETKEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        sameSite: 'lax',
        secure: COOKIE_SECURE,
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
    }
}));

app.use(express.json({ limit: JSON_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_BODY_LIMIT }));

app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin is not allowed: ${origin}`));
    },
    credentials: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (_req, res) => {
    res.status(200).json({ message: 'ok', result: true });
});

app.use('/report', reportRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/conversation', conversationRouter);
app.use('/message', messageRouter);
app.use('/friendRequest', friendRequestRouter);
app.use('/friend', friendRouter);
app.use('/notifications', notificationRouter);
app.use('/userConfig', userConfigRouter);
app.use('/reply', replyRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'PayloadTooLargeError') {
        return res.status(413).send({ status: 413, message: 'Payload too large!' });
    }

    next(err);
});

app.use((_req, res) => {
    const payload: ResponseResult = {
        message: "ERROR: Resource could not be found",
    };
    res.status(404).json(payload);
});

const start = async () => {
    await db.connect();
    Socket.server.listen(PORT, '0.0.0.0', () => {
        console.log(`Listening on Port ${PORT}...`);
    });
};

start().catch((error) => {
    console.error('Failed to start FitnessBytes:', error);
    process.exit(1);
});
