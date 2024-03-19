import { Express } from 'express';
import { Server as HttpServer, createServer } from "http";
import { Server as IOServer } from "socket.io";

class Socket {
    static server: HttpServer;
    static io: IOServer;

    static init(app: Express) {
        Socket.server = createServer(app);
        Socket.io = new IOServer(Socket.server, {
            cors: {
            origin: process.env.FRONTEND_URL,
            }
        });

        Socket.io.on('connection', (socket: any) => {
            console.log("New Connection -", socket.id);

            socket.on("Join Personal Channel", (username: string) => {
                socket.join("User:" + username);
            })
            
            socket.on("Join Conversation", (id: string) => {
                socket.join(id);
            })
        
            socket.on('Leave Conversation', (id: string) => {
                socket.leave(id);
            });
        
            socket.on("Message Sent", ({id, message}: any) => {
                socket.to(id).emit("Message Recieved", message);
            });
        });
    }
}

export default Socket;