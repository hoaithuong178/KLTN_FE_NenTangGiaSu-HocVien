import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { Input, Avatar, Badge, Button } from 'antd';
import { SearchOutlined, PaperClipOutlined, SmileOutlined, SendOutlined } from '@ant-design/icons';

// Mock data
const mockChats = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
        lastMessage: 'Bài tập hôm nay thế nào rồi?',
        lastMessageTime: '10:30',
        unread: 2,
        online: true,
    },
    {
        id: 2,
        name: 'Nhóm Toán 12A',
        avatar: null,
        lastMessage: 'Cô gửi bài tập về nhà nhé',
        lastMessageTime: 'Hôm qua',
        unread: 0,
        online: false,
    },
];

const mockMessages = [
    {
        id: 1,
        senderId: 1,
        content: 'Chào em, bài tập hôm nay thế nào rồi?',
        time: '10:30',
        type: 'text',
    },
    {
        id: 2,
        senderId: 'me',
        content: 'Dạ em đã làm xong ạ',
        time: '10:31',
        type: 'text',
    },
];

const Chat: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        // Kiểm tra trạng thái từ localStorage
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true; // Mặc định là true
    });

    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen">
            {/* Sử dụng Navbar */}
            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />

            {/* Main Content */}
            <div className={`flex-1 ${isExpanded ? 'ml-56' : 'ml-16'} flex`}>
                {/* Chat List */}
                <div className="w-80 border-r bg-white">
                    {/* Search */}
                    <div className="p-4 border-b">
                        <Input
                            prefix={<SearchOutlined className="text-gray-400" />}
                            placeholder="Tìm kiếm cuộc trò chuyện"
                        />
                    </div>

                    {/* Chat List */}
                    <div className="overflow-y-auto h-[calc(100vh-120px)]">
                        {mockChats.map((chat) => (
                            <div
                                key={chat.id}
                                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b"
                            >
                                <div className="relative">
                                    {chat.avatar ? (
                                        <Avatar src={chat.avatar} size={40} />
                                    ) : (
                                        <Avatar size={40}>{chat.name[0]}</Avatar>
                                    )}
                                    {chat.online && <Badge status="success" className="absolute -right-1 -bottom-1" />}
                                </div>
                                <div className="ml-3 flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium">{chat.name}</h3>
                                        <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                        {chat.unread > 0 && <Badge count={chat.unread} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {/* Chat Header */}
                    <div className="bg-white p-4 border-b flex items-center">
                        <Avatar src={mockChats[0].avatar} size={40} />
                        <div className="ml-3">
                            <h2 className="font-medium">{mockChats[0].name}</h2>
                            <span className="text-sm text-green-500">Đang hoạt động</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {mockMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] ${
                                        message.senderId === 'me'
                                            ? 'bg-blue-800 text-white rounded-l-lg rounded-tr-lg'
                                            : 'bg-white rounded-r-lg rounded-tl-lg'
                                    } p-3 shadow`}
                                >
                                    <p>{message.content}</p>
                                    <span className="text-xs opacity-70 mt-1 block">{message.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="bg-white p-4 border-t">
                        <div className="flex items-center space-x-2">
                            <Button icon={<PaperClipOutlined />} />
                            <Button icon={<SmileOutlined />} />
                            <Input
                                placeholder="Nhập tin nhắn..."
                                className="flex-1"
                                suffix={<Button type="primary" icon={<SendOutlined />} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Chat Info */}
                <div className="w-80 border-l bg-white p-4 pt-14">
                    <div className="text-center">
                        <Avatar src={mockChats[0].avatar} size={80} />
                        <h2 className="mt-4 font-medium">{mockChats[0].name}</h2>
                        <p className="text-sm text-green-500">Đang hoạt động</p>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-medium mb-4">Tùy chọn chat</h3>
                        <div className="space-y-4">
                            <Button block>Tắt thông báo</Button>
                            <Button block>Xem files đã gửi</Button>
                            <Button block danger>
                                Xóa cuộc trò chuyện
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
