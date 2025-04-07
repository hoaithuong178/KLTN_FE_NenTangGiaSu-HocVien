import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useSocket } from '../hooks/useSocket';
import { useAuthStore } from '../store/authStore';
import { generateConversationId } from '../utils/conversation.util';

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

const TempChat = () => {
    const { socket, connect, disconnect } = useSocket();
    const { user } = useAuthStore();
    const [userId, setUserId] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSendMessage = () => {
        if (!socket) return alert('Socket not connected');

        const data: CreateMessageDto = {
            id: v4(),
            senderId: user?.id ?? '',
            conversationId: generateConversationId(user?.id ?? '', userId),
            message,
            sentAt: new Date(),
            media: [],
        };

        socket.emit('send_message', data);
    };

    useEffect(() => {
        connect(user?.id ?? '');

        return () => {
            disconnect();
        };
    }, [connect, disconnect, user?.id]);

    return (
        <div className="p-4 max-w-md mx-auto">
            <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default TempChat;
