import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { middlewareSocketAuth } from '../middleware/middlewareSocketAuth.js';
import { registrarManejadoresSocket } from '../controladores/ControladorSocket.js';

export function inicializarSocketIO(httpServer: HttpServer): SocketIOServer {
    const io = new SocketIOServer(httpServer, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
        transports: ['websocket', 'polling'],
    });

    io.use(middlewareSocketAuth);
    io.on('connection', (socket) => registrarManejadoresSocket(io, socket));

    return io;
}
