
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  bio: string;
  profilePicture: Buffer;
  profilePictureType: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: null },
  profilePictureType: { type: String, default: ""},
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export type { IUser };
export default UserModel;
