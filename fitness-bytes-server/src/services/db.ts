import mongoose from 'mongoose';

class Database {
    private static uri: string = process.env.DB_URL!;
    static connection: mongoose.Connection | Promise<typeof mongoose>;

    static async connect() {
        try {
            this.connection = mongoose.connect(this.uri);
            console.log('Connected to MongoDB with Mongoose');
        } catch (error) {
            console.error('Error connecting to MongoDB with Mongoose:', error);
            return undefined;
        }
        this.connection = mongoose.connection;
        return this.connection.getClient();
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