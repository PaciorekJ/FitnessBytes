
import mongoose, { Document, Schema } from 'mongoose';

interface IPostImage extends Document {
    image: string;
    imageType: string;
}

const PostImageSchema: Schema = new Schema({
    image: { type: String, require: true },
    imageType: { type: String, require: true },
});

const PostImageModel =  mongoose.model<IPostImage>('PostImage', PostImageSchema)

export type { IPostImage };
export default PostImageModel;
