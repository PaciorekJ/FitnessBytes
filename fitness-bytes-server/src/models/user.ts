
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  bio: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export type { IUser }
export default UserModel;
