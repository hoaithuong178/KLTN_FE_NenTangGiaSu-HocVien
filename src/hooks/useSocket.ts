import { useCallback, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { disconnectSocket, getSocket, initializeSocket } from '../configs/socket.config';

interface UseSocketReturn {
    socket: Socket | null;
    connected: boolean;
    connect: (userId: string) => void;
    disconnect: () => void;
}

class MediaDto {
    id!: string;
    url!: string;
    type!: string;
    size!: number;
}

export class CreateMessageDto {
    id!: string;
    senderId!: string;
    conversationId!: string;
    message!: string;
    sentAt!: Date;
    media!: MediaDto[];
}

export const useSocket = (): UseSocketReturn => {
    const [socket, setSocket] = useState<Socket | null>(getSocket());
    const [connected, setConnected] = useState<boolean>(!!socket);

    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, []);

    const connect = useCallback((userId: string) => {
        if (!userId.trim()) return;
        const newSocket = initializeSocket(userId);

        newSocket.on('connect', () => {
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            setConnected(false);
        });

        newSocket.on('users_connected', (userIds: string[]) => {
            console.log('🚀 ~ newSocket.on ~ users_connected:', userIds);
        });

        newSocket.on('user_connected', (userId: string) => {
            console.log('🚀 ~ newSocket.on ~ user_connected:', userId);
        });

        newSocket.on('user_disconnected', (userId: string) => {
            console.log('🚀 ~ newSocket.on ~ user_disconnected:', userId);
        });

        newSocket.on('user_benefit_exceeded', (receiverId: string) => {
            console.log('🚀 ~ newSocket.on ~ user_benefit_exceeded', receiverId);
        });

        newSocket.on('receive_message', (data: CreateMessageDto) => {
            console.log('🚀 ~ newSocket.on ~ receive_message', JSON.stringify(data));
        });

        setSocket(newSocket);
    }, []);

    const disconnect = useCallback(() => {
        disconnectSocket();
        setSocket(null);
        setConnected(false);
    }, []);

    return {
        socket,
        connected,
        connect,
        disconnect,
    };
};
