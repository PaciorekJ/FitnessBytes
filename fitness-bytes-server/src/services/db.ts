import mongoose from 'mongoose';

class Database {
    static connection: mongoose.Connection | Promise<typeof mongoose>;

    static async connect() {
        const uri = process.env.DB_URL;

        if (!uri) {
            throw new Error('DB_URL is required');
        }

        try {
            await mongoose.connect(uri);
            this.connection = mongoose.connection;
            console.log('Connected to MongoDB with Mongoose');
            return mongoose.connection.getClient();
        } catch (error) {
            console.error('Error connecting to MongoDB with Mongoose:', error);
            throw error;
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
