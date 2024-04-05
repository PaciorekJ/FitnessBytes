
import dotenv from 'dotenv';
dotenv.config();

import MongoStore from 'connect-mongo';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
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

const PORT = process.env.PORT || 3000;
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || "86400000"); // Default: 1 Day

const app: Express = express();
Socket.init(app);
db.connect();

// *** Set up session Store and Session ***
const sessionStore: MongoStore = MongoStore.create({
    mongoUrl: process.env.DB_URL,
    autoRemove: 'interval',
    autoRemoveInterval: (COOKIE_MAX_AGE/1000/60 * 1.2), // In Minutes
    collectionName: "sessions",
});;
app.use(session({
    secret: process.env.SECRETKEY!,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { sameSite: false, secure: false, maxAge: COOKIE_MAX_AGE, httpOnly: true } //TODO: Change this later
}));

// *** Enable Middlewares for parsing ***
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// *** CORS ***
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// *** Initialize passport middleware ***
app.use(passport.initialize());
app.use(passport.session());

// *** Initialize Routes ***
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
    // Other error handling or call next(err) if not handled
    next(err);
});

// *** Catch Stray Routes ***
app.use((req, res, next) => {
    const payload: ResponseResult = {
        message: "ERROR: Resource could not be found",
    }
    res.status(404).json(payload);
})

Socket.server.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
});