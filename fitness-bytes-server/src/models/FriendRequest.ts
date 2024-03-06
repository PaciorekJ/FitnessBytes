import mongoose, { Document, Schema } from "mongoose";

interface IFriendRequest extends Document {
    requesterId: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId;
}

const FriendRequestSchema: Schema = new Schema({
    requesterId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const FriendRequestModel = mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);

export type { IFriendRequest };
export default FriendRequestModel;

