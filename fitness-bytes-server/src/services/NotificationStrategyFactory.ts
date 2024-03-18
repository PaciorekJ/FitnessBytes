import { NotificationTypes } from "../models/Notification";
import NotificationStrategy from "./NotificationStrategy";
import NotificationStrategyFriend from "./NotificationStrategyFriend";

import NotificationStrategyFriendRequest from "./NotificationStrategyFriendRequest";
import NotificationStrategyMessage from "./NotificationStrategyMessage";
import NotificationStrategyPostLiked from "./NotificationStrategyPostLiked";

class NotificationStrategyFactory {
    static create(type: NotificationTypes) {
        if (type === NotificationTypes.FriendRequest) {
            return new NotificationStrategyFriendRequest().handle;
        }
        else if (type === NotificationTypes.NewFriend) {
            return new NotificationStrategyFriend().handle;
        }
        else if (type === NotificationTypes.MessageReceived) {
            return new NotificationStrategyMessage().handle;
        }
        else if (type === NotificationTypes.PostLiked) {
            return new NotificationStrategyPostLiked().handle;
        }
        return new NotificationStrategy().handle;
    }
}

export default NotificationStrategyFactory;