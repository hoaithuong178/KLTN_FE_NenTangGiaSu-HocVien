import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, LogoutIcon } from './icons';
import { Text, TitleText } from './Text';
import Avatar from '../assets/avatar.jpg';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../configs/axios.config';
import { Notification } from './Notification';

interface TopNavbarProps {
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    recipientId: string;
    createdAt: string;
    isRead: boolean;
    type: string;
    link: string;
    deleted: boolean;
    fromUser?: {
        avatar: string;
        name: string;
    };
    subject?: {
        name: string;
    };
    grade?: string;
    mode?: boolean;
    locations?: string[];
    sessionPerWeek?: number;
    duration?: number;
    feePerSession?: number;
    schedule?: {
        day: string;
        startTime: string;
        endTime: string;
    }[];
}

const notificationTypes: { [key: string]: string } = {
    TEACH_REQUEST: 'Yêu cầu dạy',
    RECEIVE_CLASS: 'Yêu cầu nhận lớp',
    TUTOR_REQUEST: 'Yêu cầu nhận lớp',
};

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
    const { user, logout } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [avatar, setAvatar] = useState(user?.userProfile?.avatar || Avatar);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showNotificationDetail, setShowNotificationDetail] = useState(false);
    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });

    // Lấy state và actions từ store
    const { language, setLanguage } = useStore();

    const hasNewNotification = notifications.some((noti) => !noti.isRead);

    const handleLogout = () => {
        logout();
        localStorage.clear();
        navigate('/');
    };

    // const truncateText = (text: string, maxLength: number) => {
    //     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    // };

    // Thêm useEffect để fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosClient.get('/notifications');
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setNotification({
                    message: 'Có lỗi xảy ra khi tải thông báo',
                    show: true,
                    type: 'error',
                });
            }
        };
        fetchNotifications();
    }, []);

    // Thêm hàm đánh dấu đã đọc
    const markAsRead = async (id: string) => {
        console.log('Marking as read, ID:', id); // Thêm log để kiểm tra
        try {
            await axiosClient.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map((noti) => (noti.id === id ? { ...noti, isRead: true } : noti)));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            setNotification({
                message: 'Có lỗi xảy ra khi đánh dấu thông báo là đã đọc',
                show: true,
                type: 'error',
            });
        }
    };

    // Mark all as read function
    const markAllAsRead = async () => {
        try {
            // Đánh dấu từng thông báo là đã đọc
            await Promise.all(
                notifications
                    .filter((noti) => !noti.isRead)
                    .map((noti) => axiosClient.patch(`/notifications/${noti.id}/read`)),
            );

            // Cập nhật state local
            setNotifications(notifications.map((noti) => ({ ...noti, isRead: true })));

            setNotification({
                message: 'Đã đánh dấu tất cả là đã đọc',
                show: true,
                type: 'success',
            });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            setNotification({
                message: 'Có lỗi xảy ra khi đánh dấu đã đọc',
                show: true,
                type: 'error',
            });
        }
    };

    useEffect(() => {
        // Kiểm tra user trong localStorage khi component mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setAvatar(userData.avatar || Avatar);
        }
    }, []);

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
                setShowLogoutConfirm(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Hàm xử lý khi click vào thông báo
    const handleNotificationClick = async (noti: Notification) => {
        try {
            await markAsRead(noti.id);

            // Lấy role từ auth store
            const { user } = useAuthStore.getState();

            // Kiểm tra role và chuyển hướng tương ứng
            if (user?.role === 'STUDENT') {
                navigate('/class-detail');
            } else if (user?.role === 'TUTOR') {
                navigate('/class-detail-tutor');
            } else {
                console.error('Invalid user role');
                setNotification({
                    message: 'Không có quyền truy cập',
                    show: true,
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
            setNotification({
                message: 'Có lỗi xảy ra',
                show: true,
                type: 'error',
            });
        }
    };

    // Hàm xử lý đồng ý/từ chối
    const handleResponse = async (accepted: boolean) => {
        try {
            if (selectedNotification?.link) {
                // Đánh dấu là đã đọc
                await axiosClient.patch(`/notifications/${selectedNotification.id}/read`);

                // Gọi API xử lý đồng ý/từ chối
                await axiosClient.post(selectedNotification.link, { accepted });

                // Cập nhật state local
                setNotifications(
                    notifications.map((noti) =>
                        noti.id === selectedNotification.id ? { ...noti, isRead: true } : noti,
                    ),
                );

                setNotification({
                    message: `Đã ${accepted ? 'đồng ý' : 'từ chối'} yêu cầu`,
                    show: true,
                    type: 'success',
                });
            }
        } catch (error) {
            console.error('Error responding to notification:', error);
            setNotification({
                message: 'Có lỗi xảy ra khi xử lý yêu cầu',
                show: true,
                type: 'error',
            });
        } finally {
            // Luôn đóng popup sau khi xử lý xong, bất kể thành công hay thất bại
            setShowNotificationDetail(false);
            setSelectedNotification(null);
        }
    };

    // Thêm useEffect để tự động ẩn notification
    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    const handleProfileClick = () => {
        if (!user) {
            navigate('/sign-in');
            return;
        }

        if (user.role === 'STUDENT') {
            navigate('/student-profile');
        } else if (user.role === 'TUTOR') {
            navigate(`/tutor-profile`);
        } else if (user.role === 'ADMIN') {
            navigate('/admin-post');
        }
        setShowUserMenu(false);
    };

    return (
        <div
            className={`fixed top-0 right-0 flex items-center space-x-4 ${backgroundColor} ${textColor} p-2 justify-end z-30`}
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
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold">Thông báo</h3>
                            {notifications.length > 0 && (
                                <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">
                                    Đánh dấu tất cả là đã đọc
                                </button>
                            )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((noti) => (
                                    <div
                                        key={noti.id}
                                        onClick={() => handleNotificationClick(noti)}
                                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                            !noti.isRead ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={noti.fromUser?.avatar || Avatar}
                                                alt=""
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <p className="font-semibold">{noti.fromUser?.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {notificationTypes[noti.type] || noti.type}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(noti.createdAt).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">Không có thông báo</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Popup chi tiết thông báo */}
            {showNotificationDetail && selectedNotification && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
                        onClick={() => {
                            setShowNotificationDetail(false);
                            setSelectedNotification(null);
                        }}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                        <div className="bg-white rounded-lg p-6 w-[500px] max-w-full">
                            <h3 className="text-xl font-bold mb-4">Chi tiết yêu cầu</h3>
                            <div className="space-y-2">
                                <p>Môn học: {selectedNotification.subject?.name}</p>
                                <p>Khối lớp: {selectedNotification.grade}</p>
                                <p>Hình thức: {selectedNotification.mode ? 'Online' : 'Offline'}</p>
                                <p>Địa điểm: {selectedNotification.locations?.join(', ')}</p>
                                <p>Số buổi/tuần: {selectedNotification.sessionPerWeek}</p>
                                <p>Thời lượng: {selectedNotification.duration} phút</p>
                                <p>Học phí: {selectedNotification.feePerSession?.toLocaleString('vi-VN')}đ/buổi</p>
                                <p>
                                    Thời gian học:{' '}
                                    {selectedNotification.schedule
                                        ?.map(
                                            (s) =>
                                                `${s.day} từ ${new Date(s.startTime).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })} - ${new Date(s.endTime).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}`,
                                        )
                                        .join(', ')}
                                </p>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => handleResponse(false)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                                >
                                    Từ chối
                                </button>
                                <button
                                    onClick={() => handleResponse(true)}
                                    className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                                >
                                    Đồng ý
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

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
                    <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                </div>

                {/* Popup menu người dùng */}
                {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                        <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={handleProfileClick}>
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

            {/* Hiển thị thông báo */}
            <Notification message={notification.message} show={notification.show} type={notification.type} />
        </div>
    );
};

export default TopNavbar;
