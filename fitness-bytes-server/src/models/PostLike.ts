import mongoose, { Document, Schema } from 'mongoose';

interface IPostLike extends Document {
  postID: mongoose.ObjectId;
  userID: mongoose.ObjectId;
}

const PostLikeSchema: Schema = new Schema({
  postID: { type: Schema.Types.ObjectId, required: true, index: true,  ref: 'Post' },
  userID: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' }
});

const PostLikeModel = mongoose.model<IPostLike>('PostLike', PostLikeSchema);

export type { IPostLike };
export default PostLikeModel;
