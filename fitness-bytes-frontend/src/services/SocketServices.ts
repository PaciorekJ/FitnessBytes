import { Socket, io } from "socket.io-client";
import { IMessage } from "./MessageServices";

type CallbackNames = "Message Recieved";
type CallbackFn = (m: IMessage) => void;

class SocketServices {
    private static socket: Socket | undefined;
    private static roomId = "";
    private static callbacks: { [key: string]: CallbackFn; } = {
        "Message Recieved": () => {
            console.log("Message Recieved not set in SocketService")
        }
    };

    static setUp = () => {
        this.socket = io("http://localhost:5301/");
        this.socket.on("Message Recieved", this.messageRecieved);
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
}

export default SocketServices;