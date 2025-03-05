import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ChatIcon, HeartIcon, StarIcon } from './icons';

type TutorProfileComponentProps = {
    id: number;
    avatar: string;
    name: string;
    pricePerSession: number;
    email: string;
    isFavorite: boolean;
    violations: number;
    subjects: string[];
    gender: string;
    educationLevel: string;
    experience: number;
    birthYear: number;
    totalClasses: number;
    location: string;
    schedule: {
        [key: string]: {
            morning?: [string, string];
            afternoon?: [string, string];
            evening?: [string, string];
        };
    };
    rating: number;
    reviews: {
        avatar: string;
        name: string;
        date: string;
        content: string;
        rating: number;
    }[];
};

const TutorProfileComponent: React.FC<TutorProfileComponentProps> = ({
    id,
    avatar,
    name,
    pricePerSession,
    email,
    isFavorite,
    violations,
    subjects,
    gender,
    educationLevel,
    experience,
    birthYear,
    totalClasses,
    location,
    schedule,
    rating,
    reviews = [],
}) => {
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        title: '',
        content: '',
        subject: subjects[0] || '',
        location: '',
        sessions: 1,
        duration: 60, // phút
        mode: 'online',
        pricePerSession: pricePerSession, // Gợi ý giá theo thời lượng
    });

    // Cập nhật form data
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRequestForm((prev) => ({
            ...prev,
            [name]: value,
            pricePerSession: name === 'duration' ? (parseInt(value) / 60) * pricePerSession : prev.pricePerSession,
        }));
    };

    // Cập nhật hình thức học
    const handleModeChange = (mode: string) => {
        setRequestForm((prev) => ({ ...prev, mode }));
    };

    const [favoritePosts, setFavoritePosts] = useState<number[]>([]);

    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });

    const handleFavorite = (postId: number) => {
        setFavoritePosts((prev) => {
            const isAlreadyFavorite = prev.includes(postId);
            const newFavorites = isAlreadyFavorite ? prev.filter((favId) => favId !== postId) : [...prev, postId];

            setNotification({
                message: isAlreadyFavorite ? 'Đã xóa yêu thích bài viết' : 'Đã thêm bài viết vào yêu thích',
                show: true,
                type: 'success',
            });

            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 3000);

            return newFavorites;
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-md">
            <header className="flex items-center space-x-2 mb-4">
                <Link
                    to="/post"
                    className="flex items-center text-gray-700 hover:text-[#ffc569] transition-all duration-300"
                >
                    <ArrowLeftIcon className="w-6 h-6" /> {/* Icon mũi tên */}
                    <span className="ml-1 text-lg font-medium">Quay lại Bài đăng</span>
                </Link>
            </header>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center mb-4 md:mb-0">
                    <img src={avatar} alt={name} className="w-24 h-24 rounded-full mr-4" />
                    <div>
                        <h1 className="text-2xl font-bold">{name}</h1>
                        <p className="text-lg text-gray-700">
                            {new Intl.NumberFormat('vi-VN').format(pricePerSession)}đ/buổi
                        </p>
                        <p className="text-gray-600">{email}</p>
                        <p className="text-gray-600">Số lần vi phạm: {violations}</p>
                    </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-2"
                        onClick={() => setShowRequestModal(true)}
                    >
                        Gửi yêu cầu dạy
                    </button>

                    {/* Modal Popup */}
                    {showRequestModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                <h2 className="text-xl font-bold mb-4">Gửi yêu cầu dạy</h2>

                                <label className="block font-semibold">Tiêu đề</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={requestForm.title}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded mb-2"
                                />

                                <label className="block font-semibold">Nội dung</label>
                                <textarea
                                    name="content"
                                    value={requestForm.content}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded mb-2"
                                ></textarea>

                                <label className="block font-semibold">Môn học</label>
                                <select
                                    name="subject"
                                    value={requestForm.subject}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded mb-2"
                                >
                                    {subjects.map((subj) => (
                                        <option key={subj} value={subj}>
                                            {subj}
                                        </option>
                                    ))}
                                </select>

                                <label className="block font-semibold">Địa điểm</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={requestForm.location}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded mb-2"
                                />

                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <label className="block font-semibold">Số buổi</label>
                                        <input
                                            type="number"
                                            name="sessions"
                                            value={requestForm.sessions}
                                            onChange={handleChange}
                                            className="w-full border p-2 rounded mb-2"
                                            min="1"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block font-semibold">Thời lượng/buổi (phút)</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={requestForm.duration}
                                            onChange={handleChange}
                                            className="w-full border p-2 rounded mb-2"
                                            min="30"
                                            step="30"
                                        />
                                    </div>
                                </div>

                                <label className="block font-semibold">Hình thức học</label>
                                <div className="flex space-x-4 mb-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="online"
                                            checked={requestForm.mode === 'online'}
                                            onChange={() => handleModeChange('online')}
                                        />
                                        <span>Online</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="offline"
                                            checked={requestForm.mode === 'offline'}
                                            onChange={() => handleModeChange('offline')}
                                        />
                                        <span>Offline</span>
                                    </label>
                                </div>

                                <div className="bg-gray-100 p-2 rounded-md mb-2">
                                    <label className="block font-semibold">Giá/buổi:</label>
                                    <input
                                        type="number"
                                        name="pricePerSession"
                                        value={requestForm.pricePerSession}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder={new Intl.NumberFormat('vi-VN').format(
                                            (requestForm.duration / 60) * pricePerSession,
                                        )}
                                    />
                                </div>

                                {/* Nút gửi và đóng */}
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => setShowRequestModal(false)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded"
                                    >
                                        Đóng
                                    </button>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Gửi yêu cầu</button>
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
                                onClick={() => handleFavorite(id)}
                            />
                            <ChatIcon className="text-gray-500 cursor-pointer" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <span className="text-lg font-semibold">{rating}</span>
                            {[...Array(5)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    className={index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">{reviews.length} đánh giá</p>
                    </div>
                </div>
            </div>

            {notification.show && (
                <div
                    className={`fixed bottom-5 right-5 p-3 text-white rounded-md ${
                        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {notification.message}
                </div>
            )}

            {/* Thông tin gia sư */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Về gia sư</h2>
                    <div className="flex space-x-2 mb-2">
                        {subjects.map((subject) => (
                            <span key={subject} className="bg-red-200 text-red-800 px-2 py-1 rounded-full">
                                {subject}
                            </span>
                        ))}
                    </div>
                    <p>Thông tin chi tiết về gia sư...</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Thông tin thêm</h2>
                    <p>Giới tính: {gender}</p>
                    <p>Trình độ: {educationLevel}</p>
                    <p>Kinh nghiệm: {experience} năm</p>
                    <p>Năm sinh: {birthYear}</p>
                    <p>Số lớp: {totalClasses}</p>
                    <p>Nơi có thể dạy: {location}</p>
                </div>
            </div>
            {/* Thời gian rảnh */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-xl font-bold mb-2">Thời gian rảnh</h2>
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
                            {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((day) => (
                                <div
                                    key={`${day}-${time}`}
                                    className={`p-2 ${schedule[day]?.[time] ? 'bg-green-200' : 'bg-gray-200'}`}
                                >
                                    {schedule[day]?.[time]
                                        ? `${schedule[day]?.[time]?.[0]} - ${schedule[day]?.[time]?.[1]}`
                                        : '✖'}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {/* Đánh giá */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Đánh giá ({reviews.length})</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={`${review.name}-${review.date}`} className="flex items-start mb-4">
                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <h3 className="text-lg font-bold">{review.name}</h3>
                                <p className="text-sm text-gray-500">{review.date}</p>
                                <p className="text-gray-700">{review.content}</p>
                                <div className="text-yellow-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i}>{i < review.rating ? '⭐' : '☆'}</span>
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
    );
};

export default TutorProfileComponent;
