import { Express } from 'express';
import { createServer } from "http";
import { Server } from "socket.io";

enum EmitActions {
    notification = "Notification"
}

class Socket {
    static server: any;
    static io: any;

    static init(app: Express) {
        Socket.server = createServer(app);
        Socket.io = new Server(Socket.server, {
            cors: {
            origin: process.env.FRONTEND_URL,
            }
        });

        Socket.io.on('connection', (socket: { id: any; on: (arg0: string, arg1: { (id: any): void; (id: any): void; ({ id, message }: { id: any; message: any; }): void; }) => void; join: (arg0: any) => void; leave: (arg0: any) => void; to: (arg0: any) => { (): any; new(): any; emit: { (arg0: string, arg1: any): void; new(): any; }; }; }) => {
            console.log("New Connection -", socket.id);
            
            socket.on("Join Conversation", (id: any) => {
                socket.join(id);
            })
        
            socket.on('Leave Conversation', (id: any) => {
                socket.leave(id);
            });
        
            socket.on("Message Sent", ({id, message}) => {
                socket.to(id).emit("Message Recieved", message);
            });
        });
    }
}

export type { EmitActions }
export default Socket;