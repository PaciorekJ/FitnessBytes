import mongoose from 'mongoose';

class Database {
    private static uri: string = process.env.DB_URL!;

    static async connect() {
        try {
            await mongoose.connect(this.uri);
            console.log('Connected to MongoDB with Mongoose');
        } catch (error) {
            console.error('Error connecting to MongoDB with Mongoose:', error);
        }
    }

    static async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
        }
    }
}

export default Database;