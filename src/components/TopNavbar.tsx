import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, LogoutIcon } from './icons';
import { Text, TitleText } from './Text';
import Avatar from '../assets/avatar.jpg';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../configs/axios.config';
import { Notification } from './Notification';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/vi';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

// Thêm interface cho request detail
interface RequestDetail {
    from: {
        id: string;
        name: string;
        avatar: string;
    };
    to: {
        id: string;
        name: string;
        avatar: string;
    };
    subject: {
        id: string;
        name: string;
    };
    schedule: Array<{
        day: string;
        startTime: string;
        endTime: string;
    }>;
    feePerSessions: Array<{
        price: number;
        adjustmentTime: string;
    }>;
    id: string;
    type: string;
    status: string;
    grade: string;
    locations: string[];
    sessionPerWeek: number;
    duration: number;
    mode: boolean;
}

moment.locale('vi');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    resourceId?: string;
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
    const { user, logout } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [avatar, setAvatar] = useState(user?.userProfile?.avatar || user?.avatar || Avatar);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showNotificationDetail, setShowNotificationDetail] = useState(false);
    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });
    const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(null);
    const [negotiatePrice, setNegotiatePrice] = useState<number>(0);
    const [showNegotiateModal, setShowNegotiateModal] = useState(false);
    const [showConfirmReject, setShowConfirmReject] = useState(false);

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

            // Lấy thông tin chi tiết của request
            const response = await axiosClient.get(`/requests/${noti.link}`);
            setRequestDetail(response.data);
            setSelectedNotification(noti);

            // Chỉ hiện chi tiết nếu status không phải là REJECTED
            if (response.data.status !== 'REJECTED') {
                setShowNotificationDetail(true);
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
            setNotification({
                message: 'Có lỗi xảy ra khi lấy thông tin chi tiết',
                show: true,
                type: 'error',
            });
        }
    };

    // Hàm xử lý đồng ý/từ chối
    const handleResponse = async (status: 'ACCEPTED' | 'REJECTED') => {
        if (status === 'REJECTED') {
            setShowConfirmReject(true);
            return;
        }

        try {
            if (requestDetail) {
                await axiosClient.patch(`/requests/${requestDetail.id}`, {
                    status: 'ACCEPTED',
                });

                setNotification({
                    message: 'Đã chấp nhận yêu cầu',
                    show: true,
                    type: 'success',
                });

                // Cập nhật state local
                setNotifications(
                    notifications.map((noti) =>
                        noti.id === selectedNotification?.id ? { ...noti, isRead: true } : noti,
                    ),
                );
                setTimeout(() => {
                    setNotification({
                        message: '',
                        show: false,
                        type: 'success',
                    });
                }, 3000);
            }
        } catch (error) {
            console.error('Error responding to request:', error);
            setNotification({
                message: 'Có lỗi xảy ra khi xử lý yêu cầu',
                show: true,
                type: 'error',
            });
        } finally {
            setShowNotificationDetail(false);
            setSelectedNotification(null);
            setRequestDetail(null);
        }
    };

    const handleConfirmReject = async () => {
        try {
            if (requestDetail) {
                await axiosClient.patch(`/requests/${requestDetail.id}`, {
                    status: 'REJECTED',
                });

                setNotification({
                    message: 'Đã từ chối yêu cầu',
                    show: true,
                    type: 'success',
                });

                // Cập nhật state local
                setNotifications(
                    notifications.map((noti) =>
                        noti.id === selectedNotification?.id ? { ...noti, isRead: true } : noti,
                    ),
                );
                setTimeout(() => {
                    setNotification({
                        message: '',
                        show: false,
                        type: 'success',
                    });
                }, 3000);
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            setNotification({
                message: 'Có lỗi xảy ra khi từ chối yêu cầu',
                show: true,
                type: 'error',
            });
        } finally {
            setShowConfirmReject(false);
            setShowNotificationDetail(false);
            setSelectedNotification(null);
            setRequestDetail(null);
        }
    };

    // Hàm xử lý thương lượng giá
    const handleNegotiate = () => {
        if (requestDetail) {
            // Lấy giá mới nhất từ mảng feePerSessions
            const latestPrice = requestDetail.feePerSessions[requestDetail.feePerSessions.length - 1].price;
            setNegotiatePrice(latestPrice);
            setShowNegotiateModal(true);
        }
    };

    // Hàm xử lý gửi yêu cầu thương lượng
    const handleSubmitNegotiation = async () => {
        try {
            if (requestDetail) {
                // Xác định người gửi và người nhận
                const currentUserId = user?.id;
                // Nếu người dùng hiện tại là người gửi yêu cầu ban đầu (from),
                // thì gửi thông báo cho người nhận yêu cầu ban đầu (to)
                // và ngược lại
                const fromId = currentUserId;
                const toId = currentUserId === requestDetail.from.id ? requestDetail.to.id : requestDetail.from.id;

                // Gửi request cập nhật trạng thái và giá
                await axiosClient.patch(`/requests/${requestDetail.id}`, {
                    status: 'PRICE_NEGOTIATION',
                    feePerSession: negotiatePrice,
                    fromId,
                    toId,
                });

                setNotification({
                    message: 'Đã gửi yêu cầu thương lượng giá',
                    show: true,
                    type: 'success',
                });

                // Cập nhật state local
                setNotifications(
                    notifications.map((noti) =>
                        noti.id === selectedNotification?.id ? { ...noti, isRead: true } : noti,
                    ),
                );
                setTimeout(() => {
                    setNotification({
                        message: '',
                        show: false,
                        type: 'success',
                    });
                }, 3000);
            }
        } catch (error) {
            console.error('Error negotiating price:', error);
            setNotification({
                message: 'Có lỗi xảy ra khi gửi yêu cầu thương lượng',
                show: true,
                type: 'error',
            });
        } finally {
            setShowNegotiateModal(false);
            setShowNotificationDetail(false);
            setSelectedNotification(null);
            setRequestDetail(null);
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

    const EventComponent = ({ event }: { event: CalendarEvent }) => {
        const [subject, startTime, endTime] = event.title.split('|');
        return (
            <div className="flex flex-col items-center text-center w-full h-full text-xs p-1">
                <div className="font-medium">{subject}</div>
                <div>{startTime}</div>
                <div>{endTime}</div>
            </div>
        );
    };

    const convertScheduleToEvents = (
        schedule: Array<{ startTime: string; endTime: string }>,
        subjectName: string,
    ): CalendarEvent[] => {
        return schedule.map((slot) => {
            const start = new Date(slot.startTime);
            const end = new Date(slot.endTime);
            return {
                title: `${subjectName}|${moment(start).format('HH:mm')}|${moment(end).format('HH:mm')}`,
                start,
                end,
            };
        });
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
                                        } `}
                                    >
                                        <div className="flex items-start space-x-2">
                                            <img
                                                src={noti.fromUser?.avatar || Avatar}
                                                alt=""
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="flex-1 space-y-1">
                                                <p className="font-bold text-sm">{noti.title}</p>
                                                <p className="text-sm text-gray-600">{noti.message}</p>
                                                {noti.feePerSession && (
                                                    <p className="text-sm text-red-600 font-medium">
                                                        Giá đề xuất: {noti.feePerSession.toLocaleString('vi-VN')}đ/buổi
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400">
                                                    {new Date(noti.createdAt).toLocaleString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })}
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
            {showNotificationDetail && requestDetail && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
                        onClick={() => {
                            setShowNotificationDetail(false);
                            setSelectedNotification(null);
                            setRequestDetail(null);
                        }}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                        <div className="bg-white rounded-lg p-6 w-[800px] max-w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold">Chi tiết yêu cầu</h3>
                                <button
                                    onClick={() => {
                                        setShowNotificationDetail(false);
                                        setSelectedNotification(null);
                                        setRequestDetail(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={requestDetail.from.avatar || Avatar}
                                        alt={requestDetail.from.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold">{requestDetail.from.name}</p>
                                        <p className="text-sm text-gray-500">Người gửi yêu cầu</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Môn học</p>
                                        <p className="font-medium">{requestDetail.subject.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Khối lớp</p>
                                        <p className="font-medium">{requestDetail.grade}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Hình thức</p>
                                        <p className="font-medium">{requestDetail.mode ? 'Online' : 'Offline'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Số buổi/tuần</p>
                                        <p className="font-medium">{requestDetail.sessionPerWeek} buổi</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Thời lượng</p>
                                        <p className="font-medium">{requestDetail.duration} phút/buổi</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Học phí ban đầu</p>
                                        <p className="font-medium">
                                            {requestDetail.feePerSessions[0].price.toLocaleString('vi-VN')}đ/giờ
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-2">Địa điểm</p>
                                        <p className="font-medium">{requestDetail.locations.join(', ')}</p>
                                    </div>
                                    {requestDetail.feePerSessions.length > 1 && (
                                        <div>
                                            <p className="text-gray-600">Học phí đề xuất</p>
                                            <p className="font-medium text-red-600">
                                                {requestDetail.feePerSessions[
                                                    requestDetail.feePerSessions.length - 1
                                                ].price.toLocaleString('vi-VN')}
                                                đ/giờ
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(
                                                    requestDetail.feePerSessions[
                                                        requestDetail.feePerSessions.length - 1
                                                    ].adjustmentTime,
                                                ).toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {requestDetail.schedule.length > 0 && (
                                    <div>
                                        <p className="text-gray-600 mb-2">Lịch học</p>
                                        <div className="flex items-center mb-2">
                                            <p className="text-gray-600 mr-2">Tổng số buổi học:</p>
                                            <p className="font-medium">{requestDetail.schedule.length} buổi</p>
                                        </div>
                                        <div className="h-[500px] bg-white rounded-lg">
                                            <Calendar
                                                localizer={localizer}
                                                events={convertScheduleToEvents(
                                                    requestDetail.schedule,
                                                    requestDetail.subject.name,
                                                )}
                                                startAccessor="start"
                                                endAccessor="end"
                                                views={['month']}
                                                defaultView="month"
                                                formats={{
                                                    monthHeaderFormat: (date: Date) => moment(date).format('MMMM YYYY'),
                                                }}
                                                messages={{
                                                    month: 'Tháng',
                                                    today: 'Hôm nay',
                                                    next: 'Sau',
                                                    previous: 'Trước',
                                                }}
                                                style={{ height: '100%' }}
                                                components={{
                                                    event: EventComponent,
                                                }}
                                                eventPropGetter={() => ({
                                                    style: {
                                                        minHeight: '70px',
                                                        height: 'auto',
                                                        padding: '4px',
                                                        backgroundColor: '#2563eb',
                                                        color: 'white',
                                                        border: 'none',
                                                        fontSize: '13px',
                                                    },
                                                })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                {user?.role === 'STUDENT' && (
                                    <>
                                        <button
                                            onClick={() => handleResponse('REJECTED')}
                                            className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 ${
                                                requestDetail.status === 'ACCEPTED'
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : ''
                                            }`}
                                            disabled={requestDetail.status === 'ACCEPTED'}
                                        >
                                            Từ chối
                                        </button>
                                        <button
                                            onClick={handleNegotiate}
                                            className={`px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 ${
                                                requestDetail.status === 'ACCEPTED'
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : ''
                                            }`}
                                            disabled={requestDetail.status === 'ACCEPTED'}
                                        >
                                            Thương lượng
                                        </button>
                                    </>
                                )}
                                {requestDetail.status === 'ACCEPTED' && user?.role === 'TUTOR' ? (
                                    <button
                                        onClick={() => navigate(`/create-class/${requestDetail.id}`)}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                                    >
                                        Tạo lớp
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleResponse('ACCEPTED')}
                                        className={`px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 ${
                                            requestDetail.status === 'ACCEPTED' ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={requestDetail.status === 'ACCEPTED'}
                                    >
                                        Chấp nhận
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Popup thương lượng giá */}
            {showNegotiateModal && requestDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                    <div className="bg-white rounded-lg p-6 w-[400px]">
                        <h3 className="text-xl font-bold mb-4">Thương lượng giá</h3>
                        <p className="mb-4">
                            Bạn đang thương lượng giá cho lớp {requestDetail.subject.name} của gia sư{' '}
                            {requestDetail.from.name}
                        </p>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                Giá hiện tại:{' '}
                                {requestDetail.feePerSessions[
                                    requestDetail.feePerSessions.length - 1
                                ].price.toLocaleString('vi-VN')}
                                đ/giờ
                            </p>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giá đề xuất (VNĐ/giờ)
                            </label>
                            <input
                                type="number"
                                value={negotiatePrice}
                                onChange={(e) => setNegotiatePrice(Number(e.target.value))}
                                className="w-full p-2 border rounded"
                                min="0"
                                step="1000"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowNegotiateModal(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitNegotiation}
                                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500"
                            >
                                Gửi yêu cầu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận từ chối */}
            {showConfirmReject && requestDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                    <div className="bg-white rounded-lg p-6 w-[400px]">
                        <h3 className="text-xl font-bold mb-4">Xác nhận từ chối</h3>
                        <p className="mb-6">
                            Bạn có chắc chắn muốn từ chối yêu cầu nhận lớp {requestDetail.subject.name} của gia sư{' '}
                            {requestDetail.from.name} không?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmReject(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmReject}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                            >
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
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
