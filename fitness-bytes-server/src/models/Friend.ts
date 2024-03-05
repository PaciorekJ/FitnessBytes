
import mongoose, { Document, Schema } from "mongoose";

interface IFriend extends Document {
    userId1: mongoose.Types.ObjectId;
    userId2: mongoose.Types.ObjectId;
    timeCreated?: Date;
}

const FriendSchema: Schema = new Schema({
    userId1: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    userId2: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    timeCreated: {type: Date, default: Date.now},
})

const FriendModel = mongoose.model<IFriend>('Friend', FriendSchema);

export type { FriendSchema };
export default FriendModel;