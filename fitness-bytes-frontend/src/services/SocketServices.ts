import { QueryClient } from "@tanstack/react-query";
import { Socket, io } from "socket.io-client";
import { IMessage } from "./MessageServices";
import { INotification } from "./NotificationServices";
import { IPost } from "./PostServices";

type CallbackNames = "Message Recieved" | "Notification Recieved";

type MessageCallback = (m: IMessage) => void;
type NotificationCallback = (n: INotification) => void;
type PostCallback = (p: IPost) => void;

type SocketServiceConfig = {
    username: string,
    client: QueryClient,
    setBanner: (m :INotification, error?: boolean) => void
};

type CallbackFn = PostCallback &
                  NotificationCallback &
                  MessageCallback;

class SocketServices {
    private static socket: Socket | undefined;
    private static client: QueryClient;
    private static roomId = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static callbacks: { [key: string]: CallbackFn; } = {
        "Message Recieved": () => {
            console.log("Message Recieved not set in SocketService")
        },
        "Notification Recieved": () => {
            console.log("Notification Recieved not set in SocketService");
        }
    };

    static setUp = ({
        username,
        client,
        setBanner,
    }: SocketServiceConfig) => {
        const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL?.trim();
        const socketUrl = configuredSocketUrl || (import.meta.env.DEV ? "http://localhost:5301" : undefined);

        this.socket = socketUrl
            ? io(socketUrl, { withCredentials: true })
            : io({ withCredentials: true });

        this.socket?.emit("Join Personal Channel", username);

        this.socket.on("Message Recieved", this.messageRecieved);
        this.socket.on("Notification Recieved", this.notificationRecieved);

        this.client = client;

        SocketServices.registerCallback("Notification Recieved", (m) => {
            setBanner(m as INotification);

            this.client.invalidateQueries({queryKey: ["notifications"]});
            this.client.invalidateQueries({queryKey: ["NotificationMessageCount"]});
            this.client.invalidateQueries({queryKey: ["NotificationCount"]});
        });
    }

    static registerCallback = (key: CallbackNames, fn: CallbackFn) => {
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
