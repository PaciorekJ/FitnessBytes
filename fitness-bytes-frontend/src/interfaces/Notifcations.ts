
// Base Notification interface with a type property
interface Notification {
    type: "Friend Request" | "Post Liked" | "Post Replied" | "Message Received" | "Group Activity";
}

// Extending the Notification interface for a Friend Request Notification
interface FriendRequestNotification extends Notification {
    type: "Friend Request";
    fromUserId: string;
    fromUserName: string;
    timestamp: Date;
}

// Extending the Notification interface for a Post Liked Notification
interface PostLikedNotification extends Notification {
    type: "Post Liked";
    postId: string;
    likedByUserId: string;
    likedByUserName: string;
    timestamp: Date;
}

// Extending the Notification interface for a Post Replied Notification
interface PostRepliedNotification extends Notification {
    type: "Post Replied";
    postId: string;
    replyId: string;
    repliedByUserId: string;
    repliedByUserName: string;
    timestamp: Date;
}

// Extending the Notification interface for a Message Received Notification
interface MessageReceivedNotification extends Notification {
    type: "Message Received";
    messageId: string;
    fromUserId: string;
    fromUserName: string;
    messagePreview: string;
    timestamp: Date;
}

// Extending the Notification interface for a Group Activity Notification
interface GroupActivityNotification extends Notification {
    type: "Group Activity";
    groupId: string;
    activityType: "Member Joined" | "Event Created" | "Post Created";
    triggeredByUserId: string;
    triggeredByUserName: string;
    timestamp: Date;
}

export type {Notification, FriendRequestNotification, PostLikedNotification, PostRepliedNotification, MessageReceivedNotification, GroupActivityNotification};