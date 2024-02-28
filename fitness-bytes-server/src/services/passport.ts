
import mongoose from 'mongoose';
import passport from 'passport';
import passportLocal from 'passport-local';
import { validatePassword } from '../libs/Auth';
import UserModel from '../models/user';

const verifyCallback = async (username: string, password: string, done: any) => {
    try {
        const user = await UserModel.findOne({ username });
        const passwordMatch = await validatePassword(username, password);
    
        if (passwordMatch) {
            return done(null, user);
        }

        return done(null, false);
    }
    catch (e) {
        return done(e);
    }
}

const LocalStrategy = passportLocal.Strategy;
const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy)
passport.serializeUser((user: any, done: (error: any, userId?: string) => void) => {
    return done(null, user._id);
});
passport.deserializeUser(async (id: string, done: (error: any, user?: any) => void) => {
    try {
        const userId = new mongoose.Types.ObjectId(id);
        const user = await UserModel.findById(userId).lean();

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    }
    catch (e) {
        return done(e);
    }
})