import { Socket, io } from "socket.io-client";
import { IMessage } from "./MessageServices";
import { INotification } from "./NotificationServices";

type CallbackNames = "Message Recieved" | "Notification Recieved";
type CallbackFn<T> = (m: T) => void; 

type CallbackFnParams = IMessage | INotification;

class SocketServices {
    private static socket: Socket | undefined;
    private static roomId = "";
    private static callbacks: { [key: string]: CallbackFn<CallbackFnParams>; } = {
        "Message Recieved": () => {
            console.log("Message Recieved not set in SocketService")
        },
        "Notification Recieved": () => {
            console.log("Notification Recieved not set in SocketService");
        }
    };

    static setUp = (username: string) => {
        this.socket = io("http://localhost:5301/");

        this.socket?.emit("Join Personal Channel", username);

        this.socket.on("Message Recieved", this.messageRecieved);
        this.socket.on("Notification Recieved", this.notificationRecieved);
    }

    static registerCallback = (key: CallbackNames, fn: CallbackFn<CallbackFnParams>) => {
        this.callbacks[key] = fn;
    }

    // *** All Emitters ***
    static SendMessage = (message: IMessage) => {
        
        const SendMessageRequest = {
            id: SocketServices.roomId,
            message
        };

        this.socket?.emit("Message Sent", SendMessageRequest);
    }

    static join = (id: string) => {
        if (SocketServices.roomId) {
            this.socket?.emit("Leave Conversation", id);
            SocketServices.roomId = "";
        }
        this.socket?.emit("Join Conversation", id);
        SocketServices.roomId = id;
    }

    static leave = (id: string) => {
        this.socket?.emit("Leave Conversation", id);
        SocketServices.roomId = "";
    }

    // *** All Listeners ***
    private static messageRecieved = (message: IMessage) => {
        this.callbacks["Message Recieved"](message);
    }

    private static notificationRecieved = (notification: INotification) => {
        this.callbacks["Notification Recieved"](notification);
    }
}
export type { CallbackFn };
export default SocketServices;