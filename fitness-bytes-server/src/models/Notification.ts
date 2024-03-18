import mongoose, { Document, Schema, model } from "mongoose";


enum NotificationTypes {
    FriendRequest = "Friend Request",
    NewFriend = "New Friend",
    PostReplied = "Post Replied",
    MessageReceived = "Message Received",
    PostLiked = "Post Liked",
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

interface IFriendNotification extends INotification {
    requesterId: mongoose.Types.ObjectId;
    requesterUsername: string;
}
const FriendNotificationSchema = new Schema({
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requesterUsername: { type: String, required: true },
});
const FriendNotificationModel = NotificationModel.discriminator<IFriendNotification>('New Friend', FriendNotificationSchema);

interface IPostLikeNotification extends INotification {
    postId: mongoose.Types.ObjectId;
    likerId: mongoose.Types.ObjectId;
    likerUsername: string;
}
const PostLikeNotificationSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    likerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likerUsername: { type: String, required: true },
});
const PostLikedNotificationModel = NotificationModel.discriminator<IPostLikeNotification>('Post Liked', PostLikeNotificationSchema);

interface IMessageNotification extends INotification {
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    senderUsername: string;
}
const MessageNotificationSchema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderUsername: { type: String, required: true },
});
const MessageNotificationModel = NotificationModel.discriminator<IMessageNotification>('Message Received', MessageNotificationSchema);

export { FriendNotificationModel, FriendRequestNotificationModel, MessageNotificationModel, NotificationModel, NotificationTypes, PostLikedNotificationModel };

