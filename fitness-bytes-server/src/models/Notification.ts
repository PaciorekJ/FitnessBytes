import mongoose, { Document, Schema, model } from "mongoose";


enum NotificationTypes {
    FriendRequest = "Friend Request",
    PostLiked = "Post Liked",
    PostReplied = "Post Replied",
    MessageReceived = "Message Received",
    GroupActivity = "Group Activity",
}
interface INotification extends Document {
    type: NotificationTypes;
    recipientId: mongoose.Types.ObjectId;
    timeCreated: Date;
}

// *** Extend additional Interfaces here ***

const NotificationSchema = new Schema<INotification>({
    type: { type: String, enum: Object.values(NotificationTypes), required: true },
    recipientId: { type: Schema.Types.ObjectId, required: true},
    timeCreated: { type: Date, default: Date.now },
}, { discriminatorKey: 'type', collection: 'Notifications' });
const NotificationModel = model<INotification>('Notification', NotificationSchema);

// Using discriminators to extend the base schema for specific notification types

interface IFriendRequestNotification extends INotification {
    requesterId: mongoose.Types.ObjectId;
    requesterUsername: string;
}

const FriendRequestNotificationSchema = new Schema({
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requesterUsername: { type: String, required: true },
});
const FriendRequestNotificationModel = NotificationModel.discriminator<IFriendRequestNotification>('Friend Request', FriendRequestNotificationSchema);

export { FriendRequestNotificationModel, NotificationModel };

