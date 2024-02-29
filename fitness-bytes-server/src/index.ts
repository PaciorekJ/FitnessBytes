
import dotenv from 'dotenv';
dotenv.config();

import MongoStore from 'connect-mongo';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import passport from 'passport';
import ResponseResult from './interfaces/ResponseResult';
import postRouter from './routes/post';
import postsRouter from './routes/posts';
import reportRouter from './routes/report';
import userRouter from './routes/user';
import db from './services/db';
import './services/passport';

const PORT = process.env.PORT || 3000;
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || "") || 1000 * 60 * 60 * 24;

const app: Express = express();
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

// *** Catch Stray Routes ***
app.use((req, res, next) => {
    const payload: ResponseResult = {
        message: "ERROR: Resource could not be found",
    }
    res.status(404).json(payload);
})

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
});