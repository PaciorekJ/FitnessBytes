import mongoose, { Document, Schema, model } from "mongoose";

enum NotificationTypes {
    FriendRequest = "Friend Request",
    NewFriend = "New Friend",
    PostReplied = "Post Replied",
    MessageReceived = "Message Received",
    PostLiked = "Post Liked",
    GroupActivity = "Group Activity",
    ReplyLiked = "Reply Liked",
    Replied = "Replied",
}

enum ContentType {
    postId = "postId",
    replyId = "replyId",
}
interface INotification extends Document {
    type: NotificationTypes;
    recipientId: mongoose.Types.ObjectId;
    recipientUsername: string;
    dispatcherId: mongoose.Types.ObjectId;
    dispatcherUsername: string;
    timeCreated: Date;
}

// *** Extend additional Interfaces here ***

const NotificationSchema = new Schema<INotification>({
    type: { type: String, enum: Object.values(NotificationTypes), required: true },
    recipientId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    recipientUsername: { type: String, required: true },
    dispatcherId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    dispatcherUsername: { type: String, required: true },
    timeCreated: { type: Date, default: Date.now },
}, { discriminatorKey: 'type', collection: 'Notifications' });
const NotificationModel = model<INotification>('Notification', NotificationSchema);

// Using discriminators to extend the base schema for specific notification types

interface IFriendRequestNotification extends INotification {}
const FriendRequestNotificationSchema = new Schema({});
const FriendRequestNotificationModel = NotificationModel.discriminator<IFriendRequestNotification>(NotificationTypes.FriendRequest, FriendRequestNotificationSchema);

interface IFriendNotification extends INotification {}
const FriendNotificationSchema = new Schema({});
const FriendNotificationModel = NotificationModel.discriminator<IFriendNotification>(NotificationTypes.NewFriend, FriendNotificationSchema);

interface IPostLikeNotification extends INotification {
    postId: mongoose.Types.ObjectId;
}
const PostLikeNotificationSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});
const PostLikedNotificationModel = NotificationModel.discriminator<IPostLikeNotification>(NotificationTypes.PostLiked, PostLikeNotificationSchema);

interface IMessageNotification extends INotification {
    conversationId: mongoose.Types.ObjectId;
}
const MessageNotificationSchema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
});
const MessageNotificationModel = NotificationModel.discriminator<IMessageNotification>(NotificationTypes.MessageReceived, MessageNotificationSchema);

interface IReplyLikedNotification extends INotification {
    contentId: mongoose.Types.ObjectId;
    contentType: ContentType;
}
const ReplyLikedNotificationSchema = new Schema({
    contentId: { type: Schema.Types.ObjectId, ref: 'Reply', required: true },
    contentType: { type: String, enum: Object.values(ContentType), required: true },
});
const ReplyLikedNotificationModel = NotificationModel.discriminator<IReplyLikedNotification>(NotificationTypes.ReplyLiked, ReplyLikedNotificationSchema);

interface IReplyNotification extends INotification {
    contentId: mongoose.Types.ObjectId;
    contentType: ContentType;
}
const ReplyNotificationSchema = new Schema({
    contentId: { type: Schema.Types.ObjectId, ref: 'Reply', required: true },
    contentType: { type: String, enum: Object.values(ContentType), required: true },
});
const ReplyNotificationModel = NotificationModel.discriminator<IReplyNotification>(NotificationTypes.Replied, ReplyNotificationSchema);

export { ContentType, FriendNotificationModel, FriendRequestNotificationModel, MessageNotificationModel, NotificationModel, NotificationTypes, PostLikedNotificationModel, ReplyLikedNotificationModel, ReplyNotificationModel };
export type { INotification };

