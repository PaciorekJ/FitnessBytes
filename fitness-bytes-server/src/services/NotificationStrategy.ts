import { Request } from "express";

class NotificationStrategy<T> {
    handle(data: T, req?: Request): void | Promise<void> {
        console.error("Notification Strategy selected is not valid");
    }
}

export default NotificationStrategy;