
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'

dotenv.config();

const uri = process.env.DB_URL || "mongodb://not-a-DB";
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export { client, connectDB };