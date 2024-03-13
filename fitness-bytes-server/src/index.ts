
import dotenv from 'dotenv';
dotenv.config();

import MongoStore from 'connect-mongo';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import { createServer } from 'http';
import passport from 'passport';
import { Server } from 'socket.io';
import ResponseResult from './interfaces/ResponseResult';
import conversationRouter from './routes/conversation';
import friendRouter from './routes/friend';
import friendRequestRouter from './routes/friendRequest';
import messageRouter from './routes/message';
import notificationRouter from './routes/notifcations';
import postRouter from './routes/post';
import postsRouter from './routes/posts';
import reportRouter from './routes/report';
import userRouter from './routes/user';
import db from './services/db';
import './services/passport';

const PORT = process.env.PORT || 3000;
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || "86400000"); // Default: 1 Day

const app: Express = express();
db.connect();

const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    }
  });

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
//65ce6af7e17b4a23a81c81cd
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

// *** Catch Stray Routes ***
app.use((req, res, next) => {
    const payload: ResponseResult = {
        message: "ERROR: Resource could not be found",
    }
    res.status(404).json(payload);
})

io.on('connection', (socket) => {
    console.log("New Connection -", socket.id);
    
    socket.on("Join Conversation", (id) => {
        socket.join(id);
    })

    socket.on('Leave Conversation', (id) => {
        socket.leave(id);
    });

    socket.on("Message Sent", ({id, message}) => {
        socket.to(id).emit("Message Recieved", message);
    });
});

server.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
});