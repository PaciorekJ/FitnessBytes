
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

dotenv.config();

import Payload from './interfaces/Payload';
// import authMiddleware from './middleware/authMiddleware';
import routerAPI from './routes/api';
import routerUser from './routes/user';
import routerPost from './routes/post';

const PORT = process.env.PORT || 3000;

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use('/api', routerAPI);
app.use('/user', routerUser);
app.use('/post', routerPost);

app.use((req, res, next) => {
    const payload: Payload = {
        message: "ERROR: Resource could not be found",
    }

    res.status(404).json(payload);
})

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
});