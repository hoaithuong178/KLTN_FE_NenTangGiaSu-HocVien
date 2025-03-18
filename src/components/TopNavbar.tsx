import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, LogoutIcon } from '../components/icons';
import { Text, TitleText } from '../components/Text';
import Avatar from '../assets/avatar.jpg';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';

interface TopNavbarProps {
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
    backgroundColor = 'white',
    textColor = 'text-black',
    iconColor = 'text-black',
}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const bellIconRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Lấy state và actions từ store
    const { language, notifications, setLanguage, markNotificationAsRead, markAllAsRead } = useStore();

    const hasNewNotification = notifications.some((noti) => !noti.isRead);

    const handleNotificationClick = (notificationId: number) => {
        markNotificationAsRead(notificationId);
    };

    const handleLogout = () => {
        // Xử lý đăng xuất ở đây
        console.log('Đăng xuất');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        navigate('/');
        setShowLogoutConfirm(false);
        setShowUserMenu(false);
        // Có thể thêm logic xóa token, clear state, etc.
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                bellIconRef.current &&
                userMenuRef.current &&
                !notificationRef.current.contains(event.target as Node) &&
                !bellIconRef.current.contains(event.target as Node) &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
                setShowUserMenu(false);
                setShowLogoutConfirm(false); // Thêm dòng này để đóng popup xác nhận đăng xuất
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`fixed top-0 right-0 flex items-center space-x-4 ${backgroundColor} ${textColor} p-2 justify-end z-50`}
        >
            {/* BellIcon với Popup thông báo */}
            <div className="relative">
                <div
                    ref={bellIconRef}
                    className="cursor-pointer"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    <BellIcon className={`w-7 h-7 ${iconColor}`} />
                    {hasNewNotification && (
                        <div className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full" />
                    )}
                </div>

                {/* Popup thông báo */}
                {showNotifications && (
                    <div
                        ref={notificationRef}
                        className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50"
                    >
                        <div className="p-4 border-b">
                            <TitleText level={3} size="medium" weight="bold">
                                Thông báo
                            </TitleText>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification.id)}
                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                                        !notification.isRead ? 'bg-blue-100' : ''
                                    }`}
                                >
                                    <TitleText level={4} size="small" weight="bold">
                                        {notification.title}
                                    </TitleText>
                                    <Text size="small" color="text-gray-600">
                                        {truncateText(notification.content, 200)}{' '}
                                    </Text>
                                    <Text size="small" color="text-gray-400">
                                        {notification.time}
                                    </Text>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t">
                            <button
                                onClick={markAllAsRead}
                                className="w-full bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                            >
                                <Text weight="bold" color="white">
                                    Đánh dấu tất cả là đã đọc
                                </Text>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Button chuyển ngôn ngữ */}
            <button
                onClick={() => setLanguage(language === 'En' ? 'Vi' : 'En')}
                className="bg-white py-1 px-3 rounded-md hover:bg-blue-800 transition-all border border-blue-800 group"
            >
                <Text size="small" weight="bold" color="text-black group-hover:text-white">
                    {language}
                </Text>
            </button>

            {/* Avatar với popup menu */}
            <div className="relative" ref={userMenuRef}>
                <div
                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                >
                    <img src={Avatar} alt="User Avatar" className="w-full h-full object-cover" />
                </div>

                {/* Popup menu người dùng */}
                {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                        <div
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                navigate('/information');
                                setShowUserMenu(false);
                            }}
                        >
                            <Text size="medium" weight="normal">
                                Thông tin cá nhân
                            </Text>
                        </div>
                        <div
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                navigate('/my-post');
                                setShowUserMenu(false);
                            }}
                        >
                            <Text size="medium" weight="normal">
                                Bài viết của tôi
                            </Text>
                        </div>
                        <div
                            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                            onClick={() => {
                                setShowLogoutConfirm(true);
                                setShowUserMenu(false);
                            }}
                        >
                            <LogoutIcon className="w-5 h-5" />
                            <Text size="medium" weight="normal">
                                Đăng xuất
                            </Text>
                        </div>
                    </div>
                )}

                {/* Popup xác nhận đăng xuất */}
                {showLogoutConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                        <div className="bg-white rounded-lg p-6 w-96">
                            <TitleText level={3} size="medium" weight="bold" className="mb-4">
                                Xác nhận đăng xuất
                            </TitleText>
                            <Text size="medium" className="mb-6">
                                Bạn có chắc chắn muốn đăng xuất khỏi trang web?
                            </Text>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    <Text weight="normal">Hủy</Text>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    <Text weight="normal">Đăng xuất</Text>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopNavbar;
