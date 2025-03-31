import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from 'antd';
import SmallIcon from '../assets/SmallLogo.png';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../configs/axios.config';
import { AxiosError } from 'axios';
import ReactMarkdown from 'react-markdown';

type ChatType = 'AI' | 'ADMIN' | null;

interface Message {
    text: string;
    timestamp: Date;
    isUser: boolean;
}

interface ChatHistory {
    request: string;
    response: string;
    createdAt: string;
}

const ChatBox: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(() => {
        return localStorage.getItem('chatbox_expanded') === 'true';
    });
    const [isMinimized, setIsMinimized] = useState(() => {
        return localStorage.getItem('chatbox_minimized') === 'true';
    });
    const [chatType, setChatType] = useState<ChatType>(() => {
        return (localStorage.getItem('chatbox_type') as ChatType) || null;
    });
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useAuthStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Lấy lịch sử chat khi đăng nhập
    useEffect(() => {
        if (user) {
            const fetchChatHistory = async () => {
                try {
                    const response = await axiosClient.get('/chatbot');
                    // console.log('Chat history response:', response.data);

                    if (response.data) {
                        const historyMessages = response.data.flatMap((chat: ChatHistory) => [
                            {
                                text: chat.request,
                                timestamp: new Date(chat.createdAt),
                                isUser: true,
                            },
                            {
                                text: chat.response,
                                timestamp: new Date(chat.createdAt),
                                isUser: false,
                            },
                        ]);

                        const sortedMessages = historyMessages.sort(
                            (a: Message, b: Message) => a.timestamp.getTime() - b.timestamp.getTime(),
                        );

                        // console.log('Processed messages:', sortedMessages);
                        setMessages(sortedMessages);
                        // Tự động mở chat với AI khi có lịch sử
                        setChatType('AI');
                    }
                } catch (error) {
                    console.error('Error fetching chat history:', error);
                    if (error instanceof AxiosError) {
                        console.error('Error response:', error.response?.data);
                    }
                }
            };
            fetchChatHistory();
        }
    }, [user]);

    // Lưu trạng thái chatbox vào localStorage
    useEffect(() => {
        localStorage.setItem('chatbox_expanded', String(isExpanded));
        localStorage.setItem('chatbox_minimized', String(isMinimized));
        localStorage.setItem('chatbox_type', chatType || '');
    }, [isExpanded, isMinimized, chatType]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleBack = () => {
        setChatType(null);
        setMessage('');
    };

    const handleChatTypeChange = (type: ChatType) => {
        setChatType(type);
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = {
            text: message.trim(),
            timestamp: new Date(),
            isUser: true,
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage('');

        if (chatType === 'AI') {
            try {
                console.log('Sending message to AI:', message.trim());

                const response = await axiosClient.post('/chatbot', {
                    question: message.trim(),
                    code: '888',
                });

                // console.log('Full API Response:', response);
                // console.log('Response data:', response.data);
                // console.log('AI Answer:', response.data?.answer);

                if (response.data?.answer) {
                    const aiMessage = {
                        text: response.data.answer,
                        timestamp: new Date(),
                        isUser: false,
                    };
                    console.log('Created AI message:', aiMessage);
                    setMessages((prev) => [...prev, aiMessage]);
                }
            } catch (error) {
                console.error('Error sending message to chatbot:', error);
                if (error instanceof AxiosError) {
                    console.error('Error response:', error.response?.data);
                    console.error('Error status:', error.response?.status);
                }
            }
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div
            className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg transition-all duration-300 ${
                isMinimized ? 'w-12 h-12' : isExpanded ? 'w-96 h-[500px]' : 'w-72 h-[200px]'
            }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-3 bg-blue-900 text-blue-100 rounded-t-lg cursor-move">
                <div className="flex items-center space-x-2">
                    {chatType && (
                        <button onClick={handleBack} className="hover:bg-blue-700/30 p-1 rounded">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
                    <h3 className={`font-semibold ${isMinimized ? 'hidden' : 'block'}`}>
                        {chatType ? `Chat với ${chatType === 'AI' ? 'AI' : 'Quản trị viên'}` : 'Trợ giúp'}
                    </h3>
                </div>
                <div className="flex space-x-2">
                    <button onClick={toggleMinimize} className="hover:bg-blue-700/30 p-1 rounded">
                        {isMinimized ? (
                            <img src={SmallIcon} alt="Toggle" className="h-4 w-4" />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        )}
                    </button>
                    {!isMinimized && (
                        <button onClick={toggleExpand} className="hover:bg-blue-700/30 p-1 rounded">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Body */}
            {!isMinimized && (
                <div className="flex flex-col h-[calc(100%-48px)]">
                    {!chatType ? (
                        <div className="p-4 flex flex-col space-y-3">
                            <Button
                                type="primary"
                                className="bg-blue-900 hover:bg-blue-700/30 text-blue-100"
                                onClick={() => handleChatTypeChange('AI')}
                            >
                                Nhắn tin với AI
                            </Button>
                            <Button
                                type="default"
                                className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-blue-100"
                                onClick={() => handleChatTypeChange('ADMIN')}
                            >
                                Nhắn tin với quản trị viên
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Chat messages area */}
                            <div className="flex-1 p-2 overflow-y-auto pl-0">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex mb-4 ${msg.isUser ? 'justify-end' : 'justify-start pl-2'}`}
                                    >
                                        <div
                                            className={`flex items-end space-x-2 ${
                                                msg.isUser ? 'flex-row' : 'flex-row-reverse'
                                            }`}
                                        >
                                            <div
                                                className={`py-2 px-4 max-w-[100%] rounded-lg ${
                                                    msg.isUser ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {msg.isUser ? (
                                                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                                                ) : (
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ children }) => (
                                                                <p className="text-sm mb-2 last:mb-0">{children}</p>
                                                            ),
                                                            strong: ({ children }) => (
                                                                <strong className="font-semibold">{children}</strong>
                                                            ),
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                )}
                                            </div>
                                            <img
                                                src={msg.isUser ? user?.avatar || 'default-avatar.png' : SmallIcon}
                                                alt={msg.isUser ? 'User' : 'AI'}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input area */}
                            <div className="p-4 border-t">
                                <div className="flex space-x-2">
                                    <Input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onPressEnter={handleSend}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1"
                                    />
                                    <Button
                                        type="primary"
                                        onClick={handleSend}
                                        className="bg-blue-900 hover:bg-blue-700/30"
                                    >
                                        Gửi
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBox;
