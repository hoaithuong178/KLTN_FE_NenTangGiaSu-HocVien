import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_ENDPOINT ?? 'localhost:4001';

let socket: Socket | null = null;

export const initializeSocket = (userId: string): Socket => {
    if (socket) {
        socket.disconnect();
    }

    socket = io(SOCKET_URL, {
        path: '/socket.io',
        query: {
            userId,
        },
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('Socket connected!');
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected!');
    });

    socket.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error);
    });

    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
