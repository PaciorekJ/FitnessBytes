import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  imageId?: mongoose.Types.ObjectId;
  username: string;
  content: string;
  likes?: number;
  timeCreated?: Date;
}

const PostSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  imageId: { type: Schema.Types.ObjectId, default: null, ref: 'PostImage' },
  username: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  timeCreated: { type: Date, default: Date.now }
});

const PostModel =  mongoose.model<IPost>('Post', PostSchema)

export type { IPost };
export default PostModel;
