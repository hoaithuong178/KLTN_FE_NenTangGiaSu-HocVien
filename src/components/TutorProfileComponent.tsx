import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AddressIcon, ArrowLeftIcon, ChatIcon, HeartIcon, MailIcon, PhoneIcon, StarIcon } from './icons';
import { Button } from './Button';

export type ScheduleDetail = {
    morning?: [string, string][];
    afternoon?: [string, string][];
    evening?: [string, string][];
    [key: string]: [string, string][] | undefined;
};

export type Schedule = {
    [key: string]: ScheduleDetail;
};

export interface TutorProfileComponentProps {
    id: number;
    avatar: string;
    name: string;
    pricePerSession: number;
    email: string;
    phone: string;
    isFavorite: boolean;
    learningTypes: string[];
    subjects: string[];
    gender: string;
    educationLevel: string;
    experience: number;
    birthYear: number;
    totalClasses: number;
    tutorLocations: string[];
    location?: string;
    schedule: Schedule;
    description: string;
    rating: number;
    reviews: {
        avatar: string;
        name: string;
        date: string;
        content: string;
        rating: number;
    }[];
    userProfile?: {
        email: string;
        phone: string;
        avatar: string;
        gender: string;
        dob: string;
    };
    tutorProfile?: {
        hourlyPrice: number;
        level: string;
        experiences: number;
        taughtStudentsCount: number;
        rating: number;
        description: string;
    };
    currentUserId?: string;
}

const TutorProfileComponent: React.FC<TutorProfileComponentProps> = (props) => {
    const navigate = useNavigate();

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(props.isFavorite);
    const [requestForm, setRequestForm] = useState({
        title: '',
        content: '',
        subject: props.subjects?.length > 0 ? props.subjects[0] : '',
        learningTypes: props.learningTypes?.length > 0 ? props.learningTypes[0] : '',
        location: props.tutorLocations?.length > 0 ? props.tutorLocations[0] : '',
        duration: 60,
        mode: 'online' as 'online' | 'offline',
        pricePerSession: props.pricePerSession || 0,
    });
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [sessionCount, setSessionCount] = useState<number>(1);
    const [notification, setNotification] = useState<{
        message: string;
        show: boolean;
        type: 'success' | 'error';
    }>({
        message: '',
        show: false,
        type: 'success',
    });

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setShowRequestModal(false);
        };
        if (showRequestModal) {
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.body.style.overflow = 'auto'; // Khôi phục cuộn
            window.removeEventListener('keydown', handleEsc);
        };
    }, [showRequestModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRequestForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'duration' && {
                pricePerSession: (parseInt(value) / 60) * props.pricePerSession,
            }),
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/send-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...requestForm,
                    tutorId: props.id,
                    selectedTimes,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Gửi yêu cầu thất bại');
            }
            setNotification({ message: 'Gửi yêu cầu thành công!', show: true, type: 'success' });
            setShowRequestModal(false);
        } catch (error) {
            setNotification({
                message: error instanceof Error ? error.message : 'Lỗi khi gửi yêu cầu',
                show: true,
                type: 'error',
            });
        }
    };

    const toggleTimeSelection = (timeRange: string) => {
        setSelectedTimes((prev) => {
            if (prev.includes(timeRange)) {
                return prev.filter((t) => t !== timeRange);
            }
            if (prev.length >= sessionCount) {
                setNotification({
                    message: `Bạn chỉ có thể chọn tối đa ${sessionCount} khung giờ`,
                    show: true,
                    type: 'error',
                });
                setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
                return prev;
            }
            return [...prev, timeRange];
        });
    };

    const handleFavorite = () => {
        setIsFavorite((prev) => !prev);
        setNotification({
            message: isFavorite ? 'Đã xóa yêu thích' : 'Đã thêm vào yêu thích',
            show: true,
            type: 'success',
        });
        setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
    };

    const getAge = (birthYear: number): number => new Date().getFullYear() - birthYear;

    // Hàm che giấu email
    const maskEmail = (email: string) => {
        const [username, domain] = email.split('@');
        const maskedUsername = username.slice(0, 3) + '***';
        return `${maskedUsername}@${domain}`;
    };

    // Hàm che giấu số điện thoại
    const maskPhone = (phone: string) => {
        if (!phone) return '';
        return phone.slice(0, -3) + '***';
    };

    return (
        <div className="w-full">
            <header className="w-full bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center space-x-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-700 hover:text-[#ffc569]"
                        aria-label="Quay lại trang trước"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                        <span className="ml-1 text-lg font-medium">Quay lại</span>
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex items-center mb-4 md:mb-0">
                        <img
                            src={props.avatar || 'https://via.placeholder.com/150'}
                            alt={props.name}
                            className="w-24 h-24 rounded-full mr-4 object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                        />
                        <div>
                            <h1 className="text-2xl font-bold">{props.name}</h1>
                            <p className="text-lg text-gray-700 font-bold">
                                {new Intl.NumberFormat('vi-VN').format(props.pricePerSession)}đ/h
                            </p>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="flex items-center gap-2">
                                    {props.learningTypes?.length > 0 ? (
                                        props.learningTypes.map((type, index) => (
                                            <span
                                                key={`learning-type-${index}`}
                                                className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded-full"
                                            >
                                                {type}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">Không có hình thức học</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <AddressIcon className="w-5 h-5 text-gray-600" />
                                    <p className="text-gray-600">{props.tutorLocations.join(', ')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MailIcon className="w-5 h-5 text-gray-600" />
                                    <p className="text-gray-600">{maskEmail(props.email)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PhoneIcon className="w-5 h-5 text-gray-600" />
                                    <p className="text-gray-600">{maskPhone(props.phone)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-100 p-4 rounded-lg text-center">
                        {props.currentUserId && props.currentUserId === props.id.toString() ? (
                            <button
                                onClick={() => navigate('/edit-profile')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Sửa thông tin cá nhân
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowRequestModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
                                aria-label="Gửi yêu cầu dạy"
                            >
                                Gửi yêu cầu dạy
                            </button>
                        )}

                        {showRequestModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
                                <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto relative z-[10000]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-[#1B223B]">Gửi yêu cầu dạy</h2>
                                        <button
                                            onClick={() => setShowRequestModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-2 text-left">
                                                Tiêu đề
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={requestForm.title}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                                placeholder="Nhập tiêu đề yêu cầu"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-2 text-left">
                                                Yêu cầu đối với gia sư
                                            </label>
                                            <textarea
                                                name="content"
                                                value={requestForm.content}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                                rows={4}
                                                placeholder="Mô tả chi tiết yêu cầu của bạn"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block font-semibold text-gray-700 mb-2 text-left">
                                                    Môn học
                                                </label>
                                                <select
                                                    name="subject"
                                                    value={requestForm.subject}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                                >
                                                    {props.subjects?.length > 0 ? (
                                                        props.subjects.map((subj) => (
                                                            <option key={subj} value={subj}>
                                                                {subj}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">Không có môn học</option>
                                                    )}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block font-semibold text-gray-700 mb-2 text-left">
                                                    Địa điểm
                                                </label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={requestForm.location}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                                    placeholder="Nhập địa điểm học"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block font-semibold text-gray-700 mb-2 text-left">
                                                    Số buổi/tuần
                                                </label>
                                                <input
                                                    type="number"
                                                    name="sessions"
                                                    value={sessionCount}
                                                    onChange={(e) =>
                                                        setSessionCount(Math.max(1, parseInt(e.target.value) || 1))
                                                    }
                                                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                                    min="1"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-semibold text-gray-700 mb-2 text-left">
                                                    Thời lượng/Buổi (phút)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="duration"
                                                    value={requestForm.duration}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                                    min="30"
                                                    step="30"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-2 text-left">
                                                Hình thức học
                                            </label>
                                            <div className="flex space-x-6">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="mode"
                                                        value="online"
                                                        checked={requestForm.mode === 'online'}
                                                        onChange={handleChange}
                                                        className="text-[#1B223B] focus:ring-[#FFC569]"
                                                    />
                                                    <span className="text-gray-700">Online</span>
                                                </label>
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="mode"
                                                        value="offline"
                                                        checked={requestForm.mode === 'offline'}
                                                        onChange={handleChange}
                                                        className="text-[#1B223B] focus:ring-[#FFC569]"
                                                    />
                                                    <span className="text-gray-700">Offline</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-2 text-left">
                                                Chọn ngày và giờ học
                                            </label>
                                            <div className="space-y-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {Object.keys(props.schedule || {}).map((day) => (
                                                        <Button
                                                            key={day}
                                                            title={day}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                                selectedDay === day
                                                                    ? 'bg-[#1B223B] text-white shadow-md'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                            onClick={() => setSelectedDay(day)}
                                                        />
                                                    ))}
                                                </div>

                                                {selectedDay && (
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-left">
                                                            Chọn khung giờ:
                                                        </h3>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {Object.entries(props.schedule[selectedDay] || {}).map(
                                                                ([period]) => {
                                                                    const timeRange = `${period}`;
                                                                    return (
                                                                        <Button
                                                                            key={timeRange}
                                                                            title={timeRange}
                                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                                                selectedTimes.includes(timeRange)
                                                                                    ? 'bg-[#1B223B] text-white shadow-md'
                                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                            }`}
                                                                            onClick={() =>
                                                                                toggleTimeSelection(timeRange)
                                                                            }
                                                                            disabled={
                                                                                selectedTimes.length >= sessionCount &&
                                                                                !selectedTimes.includes(timeRange)
                                                                            }
                                                                        />
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                        <div className="mt-3 text-right">
                                                            <span className="text-sm text-gray-600">
                                                                Đã chọn {selectedTimes.length}/{sessionCount} khung giờ
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="block font-semibold text-gray-700 mb-2 text-left">
                                                Giá/giờ:
                                            </label>
                                            <input
                                                type="number"
                                                name="pricePerSession"
                                                value={requestForm.pricePerSession}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                                placeholder={new Intl.NumberFormat('vi-VN').format(
                                                    (requestForm.duration / 60) * props.pricePerSession,
                                                )}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-4 pt-4">
                                            <Button
                                                title="Hủy"
                                                backgroundColor="#D1D5DB"
                                                hoverBackgroundColor="#B3B8C2"
                                                foreColor="#1B223B"
                                                className="px-6 py-2.5 rounded-lg text-sm font-semibold"
                                                onClick={() => setShowRequestModal(false)}
                                            />
                                            <Button
                                                title="Gửi yêu cầu"
                                                backgroundColor="#1B223B"
                                                hoverBackgroundColor="#2A3349"
                                                foreColor="white"
                                                className="px-6 py-2.5 rounded-lg text-sm font-semibold"
                                                onClick={handleSubmit}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="text-gray-700">
                            <div className="flex space-x-2 items-center">
                                <HeartIcon
                                    className={`cursor-pointer ${
                                        isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'
                                    }`}
                                    onClick={handleFavorite}
                                />
                                <Link to="/conservation">
                                    <ChatIcon className="text-gray-500 cursor-pointer" />
                                </Link>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-lg font-semibold">{props.rating || 0}</span>
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon
                                        key={`star-${index}`} // Sử dụng key duy nhất
                                        className={
                                            index < (props.rating || 0) // Đảm bảo rating không phải NaN
                                                ? 'text-yellow-500 fill-current'
                                                : 'text-gray-300'
                                        }
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">{props.reviews?.length || 0} đánh giá</p>
                        </div>
                    </div>
                </div>

                {notification.show && (
                    <div
                        className={`fixed bottom-5 right-5 p-3 text-white rounded-md flex items-center justify-between ${
                            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    >
                        <span>{notification.message}</span>
                        <button
                            onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
                            className="ml-2 text-white font-bold"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="space-y-4 mb-4 p-4 bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-4 gap-4">
                        <p className="text-gray-600 font-semibold col-span-1">Về tôi</p>
                        <p className="text-gray-800 col-span-3">{props.description}</p>
                        <p className="text-gray-600 font-semibold col-span-1">Giới tính</p>
                        <p className="text-gray-800 col-span-3">{props.gender}</p>
                        <p className="text-gray-600 font-semibold col-span-1">Năm sinh</p>
                        <p className="text-gray-800 col-span-3">
                            {props.birthYear} ({getAge(props.birthYear)} tuổi)
                        </p>
                        <p className="text-gray-600 font-semibold col-span-1">Trình độ</p>
                        <p className="col-span-3">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg inline-block">
                                {props.educationLevel}
                            </span>
                        </p>
                        <p className="text-gray-600 font-semibold col-span-1">Kinh nghiệm</p>
                        <p className="text-gray-800 col-span-3">{props.experience} năm</p>
                        <p className="text-gray-600 font-semibold col-span-1">Số học sinh đã dạy</p>
                        <p className="text-gray-800 col-span-3">{props.totalClasses} học sinh</p>
                        <p className="text-gray-600 font-semibold col-span-1">Nơi dạy</p>
                        <div className="col-span-3">
                            {props.tutorLocations?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {props.tutorLocations.map((location: string, index: number) => (
                                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg">
                                            {location}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-800">Chưa cập nhật</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="text-gray-600 font-semibold col-span-1">Môn</p>
                        <div className="flex flex-wrap gap-2 col-span-3">
                            {props.subjects?.length > 0 ? (
                                props.subjects.map((subject, index) => (
                                    <span
                                        key={`subject-${index}`}
                                        className="bg-pink-200 text-pink-700 px-3 py-1 rounded-lg"
                                    >
                                        {subject}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500">Không có môn học</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h2 className="text-xl font-bold mb-2">Thời gian rảnh</h2>
                    {props.schedule ? (
                        <div className="grid grid-cols-8 gap-2 text-center">
                            <div></div>
                            {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((day) => (
                                <div key={day} className="font-bold">
                                    {day}
                                </div>
                            ))}
                            {['morning', 'afternoon', 'evening'].map((time) => (
                                <React.Fragment key={time}>
                                    <div className="font-bold">
                                        {time === 'morning' ? 'Sáng' : time === 'afternoon' ? 'Chiều' : 'Tối'}
                                    </div>
                                    {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((day) => {
                                        const timeSlot = props.schedule[day]?.[time] ?? [];
                                        return (
                                            <div
                                                key={`${day}-${time}`}
                                                className={`p-2 ${timeSlot.length ? 'bg-green-200' : 'bg-gray-200'}`}
                                            >
                                                {timeSlot.length ? `${timeSlot[0][0]} - ${timeSlot[0][1]}` : '✖'}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Chưa có lịch rảnh</p>
                    )}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Đánh giá ({props.reviews?.length || 0})</h2>
                    {props.reviews?.length > 0 ? (
                        props.reviews.map((review) => (
                            <div key={`${review.name}-${review.date}`} className="flex items-start mb-4">
                                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h3 className="text-lg font-bold">{review.name}</h3>
                                    <p className="text-sm text-gray-500">{review.date}</p>
                                    <p className="text-gray-700">{review.content}</p>
                                    <div className="flex text-yellow-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <StarIcon
                                                key={`review-star-${review.date}-${i}`} // Key duy nhất dựa trên date và index
                                                className={
                                                    i < (review.rating || 0) // Đảm bảo rating không phải NaN
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : 'text-gray-300'
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Chưa có đánh giá nào</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorProfileComponent;
