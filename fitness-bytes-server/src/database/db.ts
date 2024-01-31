
import { MongoClient } from 'mongodb';

class Database {
    static instance: MongoClient;
    private static uri: string = process.env.DB_URL!;

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new MongoClient(this.uri);
            Database.connect();
        }
        
        return Database.instance;
    }

    private static async connect() {
        try {
            await Database.instance.connect();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }
}

export default Database;