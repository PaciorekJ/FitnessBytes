
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;

const app: Express = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('FitnessBytes Server');
});

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
})