import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from 'antd';
import SmallIcon from '../assets/SmallLogo.png';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../configs/axios.config';
import { AxiosError } from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Avatar from '../assets/avatar.jpg';
import Portal from './Portal';

type ChatType = 'AI' | 'ADMIN' | null;

interface Document {
    id: string;
    name: string;
    avatar: string;
    title?: string;
}

interface Message {
    text: string;
    timestamp: Date;
    isUser: boolean;
    source_documents?: Document[];
}

interface ChatHistory {
    request: string;
    response: string;
    createdAt: string;
    source_documents?: {
        id: string;
        name: string;
        avatar: string;
    }[];
}

const ChatBox: React.FC = () => {
    const [isMinimized, setIsMinimized] = useState(true);
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
                                source_documents: chat.source_documents || [],
                            },
                        ]);

                        const sortedMessages = historyMessages.sort(
                            (a: Message, b: Message) => a.timestamp.getTime() - b.timestamp.getTime(),
                        );

                        // console.log('Processed messages:', sortedMessages);
                        setMessages(
                            sortedMessages.map((item: Message) => {
                                const ids: string[] = [];

                                return {
                                    ...item,
                                    source_documents: item.source_documents?.reduce(
                                        (acc: Document[], doc: Document) => {
                                            if (!ids.includes(doc.id)) {
                                                ids.push(doc.id);
                                                acc.push(doc);
                                            }
                                            return acc;
                                        },
                                        [],
                                    ),
                                };
                            }),
                        );
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

        return () => {
            setIsMinimized(true);
            setMessages([]);
            setMessage('');
            setChatType(null);
        };
    }, [user]);

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
        // Nếu đang chuyển từ thu nhỏ sang mở rộng, cuộn xuống cuối
        if (isMinimized) {
            // Sử dụng setTimeout để đảm bảo DOM đã được cập nhật
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    };

    const handleBack = () => {
        setChatType(null);
        setMessage('');
    };

    const handleChatTypeChange = (type: ChatType) => {
        setChatType(type);
        // Thêm setTimeout để đảm bảo DOM được cập nhật trước khi cuộn
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = {
            text: message.trim(),
            timestamp: new Date(),
            isUser: true,
        };

        // Cập nhật state messages với tin nhắn của người dùng
        setMessages((prev) => [...prev, userMessage]);
        setMessage('');

        if (chatType === 'AI') {
            try {
                // Thêm thông báo đang xử lý
                const loadingMessage = {
                    text: 'Đang xử lý...',
                    timestamp: new Date(),
                    isUser: false,
                };

                // Cập nhật state với thông báo đang xử lý
                setMessages((prev) => [...prev, loadingMessage]);

                // Gọi API
                const response = await axiosClient.post('/chatbot', {
                    question: userMessage.text,
                    code: '888',
                });

                const documents = response.data?.documents || response.data?.source_documents || [];
                const docIds: string[] = [];

                // Xử lý phản hồi từ API
                if (response.data?.answer) {
                    // Tạo tin nhắn phản hồi
                    const aiResponse = {
                        text: response.data.answer,
                        timestamp: new Date(),
                        isUser: false,
                        source_documents: documents.reduce((acc: Document[], doc: Document) => {
                            if (!docIds.includes(doc.id)) {
                                docIds.push(doc.id);
                                acc.push(doc);
                            }
                            return acc;
                        }, []),
                    };

                    // Cập nhật state messages bằng cách loại bỏ thông báo đang xử lý và thêm phản hồi mới
                    setMessages((prev) => prev.filter((msg) => msg !== loadingMessage).concat(aiResponse));
                }
            } catch (error) {
                console.error('Error sending message to chatbot:', error);

                // Hiển thị thông báo lỗi
                setMessages((prev) =>
                    prev
                        .filter((msg) => msg.text !== 'Đang xử lý...')
                        .concat({
                            text: 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
                            timestamp: new Date(),
                            isUser: false,
                        }),
                );

                if (error instanceof AxiosError) {
                    console.error('Error response:', error.response?.data);
                    console.error('Error status:', error.response?.status);
                }
            }
        }
    };

    // Đảm bảo cuộn xuống tin nhắn mới
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Thêm hàm xử lý khi click vào khu vực chat
    const handleChatAreaClick = () => {
        scrollToBottom();
    };

    if (!user) return null;

    return (
        <Portal>
            <div
                className={`fixed bottom-4 right-4 bg-white shadow-lg transition-all duration-300 z-50 ${
                    isMinimized
                        ? 'w-12 h-12 rounded-full overflow-hidden animate-bounce hover:animate-none'
                        : 'w-96 h-[500px] rounded-lg'
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-3 bg-blue-900 text-blue-100 rounded-t-lg cursor-move">
                    <div className="flex items-center space-x-2">
                        {chatType && !isMinimized && (
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
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            )}
                        </button>
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
                                <div className="flex-1 p-2 overflow-y-auto pl-0" onClick={handleChatAreaClick}>
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
                                                        msg.isUser
                                                            ? 'bg-blue-900 text-white'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {msg.isUser ? (
                                                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
                                                    ) : (
                                                        <>
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                rehypePlugins={[rehypeRaw]}
                                                                components={{
                                                                    p: ({ ...props }) => (
                                                                        <p
                                                                            className="text-sm mb-2 last:mb-0 markdown-content"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    strong: ({ ...props }) => (
                                                                        <strong className="font-semibold" {...props} />
                                                                    ),
                                                                    a: ({ ...props }) => (
                                                                        <a
                                                                            className="text-blue-600 hover:underline"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    code: ({
                                                                        inline,
                                                                        ...props
                                                                    }: {
                                                                        inline?: boolean;
                                                                    } & React.HTMLAttributes<HTMLElement>) =>
                                                                        inline ? (
                                                                            <code
                                                                                className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                                                                                {...props}
                                                                            />
                                                                        ) : (
                                                                            <code
                                                                                className="block bg-gray-100 p-2 rounded text-sm font-mono my-2 overflow-x-auto"
                                                                                {...props}
                                                                            />
                                                                        ),
                                                                    ul: ({ ...props }) => (
                                                                        <ul
                                                                            className="list-disc pl-5 my-2 text-sm"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    ol: ({ ...props }) => (
                                                                        <ol
                                                                            className="list-decimal pl-5 my-2 text-sm"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    li: ({ ...props }) => (
                                                                        <li className="mb-1" {...props} />
                                                                    ),
                                                                    h1: ({ ...props }) => (
                                                                        <h1
                                                                            className="text-xl font-bold my-3"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    h2: ({ ...props }) => (
                                                                        <h2
                                                                            className="text-lg font-bold my-2"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    h3: ({ ...props }) => (
                                                                        <h3
                                                                            className="text-base font-bold my-2"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    blockquote: ({ ...props }) => (
                                                                        <blockquote
                                                                            className="border-l-4 border-gray-300 pl-3 italic my-2"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                }}
                                                            >
                                                                {msg.text.replace(
                                                                    /\*\*Ảnh đại diện\*\*:\s*\[([^\]]+)\]\(([^)]+)\)/g,
                                                                    '[**Ảnh đại diện**]($2)',
                                                                )}
                                                            </ReactMarkdown>
                                                            {/* Hiển thị danh sách gia sư từ source_documents */}
                                                            {msg.source_documents &&
                                                                msg.source_documents.length > 0 && (
                                                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                                                        <p className="text-xs text-gray-500 mb-2">
                                                                            {(user.role === 'STUDENT' && 'Gia sư') ||
                                                                                'Bài đăng'}{' '}
                                                                            được đề xuất:
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {msg.source_documents.map((doc, index) => (
                                                                                <a
                                                                                    key={doc.id}
                                                                                    href={`/tutor-profile/${doc.id}`}
                                                                                    className="flex items-center p-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    {doc.avatar && (
                                                                                        <img
                                                                                            src={
                                                                                                doc.avatar ||
                                                                                                '/default-avatar.png'
                                                                                            }
                                                                                            alt={doc.name}
                                                                                            className="w-6 h-6 rounded-full mr-1"
                                                                                        />
                                                                                    )}
                                                                                    <span className="text-xs text-blue-700">
                                                                                        {index + 1}.{' '}
                                                                                        {doc.name ?? doc.title}
                                                                                    </span>
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </>
                                                    )}
                                                </div>
                                                <img
                                                    src={
                                                        msg.isUser
                                                            ? user
                                                                ? user.userProfile?.avatar || Avatar
                                                                : Avatar
                                                            : SmallIcon
                                                    }
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
        </Portal>
    );
};

export default ChatBox;
