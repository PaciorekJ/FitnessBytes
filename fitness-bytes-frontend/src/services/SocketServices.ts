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
        this.socket = io("http://localhost:5301/");

        this.socket?.emit("Join Personal Channel", username);

        this.socket.on("Message Recieved", this.messageRecieved);
        this.socket.on("Notification Recieved", this.notificationRecieved);

        this.client = client;

        SocketServices.registerCallback("Notification Recieved", (m) => {
			// TODO: Swap these for production. Strict Mode results in 2 notifications
			// But the performance gain from no refetch is worth the impurity

			// this.client.setQueryData<INotification[]>(["notifications"], (old) => {
			// 	const oldNotifications = old || [];
			// 	return [...oldNotifications, m as INotification];
			// });

			// if ((m as INotification).type === NotificationTypes.MessageReceived) {
			// 	this.client.setQueryData<number>(
			// 		["NotificationMessageCount"],
			// 		(old) => (old || 0) + 1,
			// 	);
			// }
			// this.client.setQueryData<number>(
			// 	["NotificationCount"],
			// 	(old) => (old || 0) + 1,
			// );

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