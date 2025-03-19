import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AddressIcon, ArrowLeftIcon, ChatIcon, FlagIcon, HeartIcon, MailIcon, PhoneIcon, StarIcon } from './icons';
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

export type TutorProfileComponentProps = {
    id: number;
    avatar: string;
    name: string;
    pricePerSession: number;
    email: string;
    phone: string;
    isFavorite: boolean;
    violations: number;
    subjects: string[];
    gender: string;
    educationLevel: string;
    experience: number;
    birthYear: number;
    totalClasses: number;
    location: string;
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
};

// type ApiData = {
//     id: string;
//     userProfile?: {
//         avatar?: string;
//         gender?: string;
//         dob?: string;
//     };
//     name?: string;
//     tutorProfile?: {
//         hourlyPrice?: number;
//         specializations?: string[];
//         experiences?: number;
//         taughtStudentsCount?: number;
//         tutorLocations?: string[];
//         rating?: number;
//         description?: string;
//     };
//     email?: string;
//     phone?: string;
//     schedule?: Schedule;
//     reviews?: TutorProfileComponentProps['reviews'];
// };

// function transformTutorData(apiData: ApiData): TutorProfileComponentProps {
//     return {
//         id: apiData.id ? parseInt(apiData.id) : 0,
//         avatar: apiData.userProfile?.avatar || 'https://via.placeholder.com/150',
//         name: apiData.name || 'Unknown',
//         pricePerSession: apiData.tutorProfile?.hourlyPrice ?? 0,
//         email: apiData.email || 'N/A',
//         phone: apiData.phone || 'N/A',
//         description: apiData.tutorProfile?.description || 'Chưa có mô tả về bản thân',
//         isFavorite: false,
//         violations: 0,
//         subjects: apiData.tutorProfile?.specializations ?? [],
//         gender: apiData.userProfile?.gender || 'UNKNOWN',
//         educationLevel: 'Unknown',
//         experience: apiData.tutorProfile?.experiences ?? 0,
//         birthYear: apiData.userProfile?.dob ? new Date(apiData.userProfile.dob).getFullYear() : 2000,
//         totalClasses: apiData.tutorProfile?.taughtStudentsCount ?? 0,
//         location: apiData.tutorProfile?.tutorLocations?.[0] ?? 'Unknown',
//         schedule: apiData.schedule ?? {},
//         rating: apiData.tutorProfile?.rating ?? 0,
//         reviews: apiData.reviews ?? [],
//     };
// }

const TutorProfileComponent: React.FC<TutorProfileComponentProps> = (props) => {
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(props.isFavorite);
    const [requestForm, setRequestForm] = useState({
        title: '',
        content: '',
        subject: props.subjects.length > 0 ? props.subjects[0] : '',
        location: props.location,
        duration: 60,
        mode: 'online' as 'online' | 'offline',
        pricePerSession: props.pricePerSession,
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
            if (!response.ok) throw new Error('Request failed');
            await response.json();
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
        setSelectedTimes((prev) =>
            prev.includes(timeRange)
                ? prev.filter((t) => t !== timeRange)
                : prev.length < sessionCount
                ? [...prev, timeRange]
                : prev,
        );
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

    return (
        <div className="w-full">
            <header className="w-full bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center space-x-2">
                    <Link
                        to="/tutors"
                        className="flex items-center text-gray-700 hover:text-[#ffc569]"
                        aria-label="Quay lại danh sách gia sư"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                        <span className="ml-1 text-lg font-medium">Quay lại Gia sư</span>
                    </Link>
                </div>
            </header>

            <div className="max-w-5xl mx-auto p-6">
                {/* Rest of your JSX remains largely the same, with these improvements: */}
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
                                    <MailIcon className="w-5 h-5 text-gray-600" />
                                    <p className="text-gray-600">{props.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PhoneIcon className="w-5 h-5 text-gray-600" />
                                    <p className="text-gray-600">{props.phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AddressIcon className="w-5 h-5 text-gray-600" />
                                    <p className="text-gray-600">{props.location}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FlagIcon className="w-5 h-5 text-gray-600" />
                                    <p className="text-gray-600">Số lần vi phạm: {props.violations}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-100 p-4 rounded-lg text-center">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
                            onClick={() => setShowRequestModal(true)}
                            aria-label="Gửi yêu cầu dạy"
                        >
                            Gửi yêu cầu dạy
                        </button>

                        {showRequestModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-auto">
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
                                                value={sessionCount}
                                                onChange={(e) =>
                                                    setSessionCount(Math.max(1, parseInt(e.target.value) || 1))
                                                }
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
                                                onChange={handleChange}
                                            />
                                            <span>Online</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="offline"
                                                checked={requestForm.mode === 'offline'}
                                                onChange={handleChange}
                                            />
                                            <span>Offline</span>
                                        </label>
                                    </div>
                                    <label className="block font-semibold">Chọn ngày và giờ học</label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2 flex-wrap">
                                            {Object.keys(props.schedule || {}).map((day) => (
                                                <Button
                                                    key={day}
                                                    title={day}
                                                    className={
                                                        selectedDay === day ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                                    }
                                                    onClick={() => setSelectedDay(day)}
                                                />
                                            ))}
                                        </div>
                                        {selectedDay && (
                                            <div className="mt-4">
                                                <h3 className="text-lg font-semibold">Chọn khung giờ:</h3>
                                                <div className="flex gap-2 flex-wrap mt-2">
                                                    {Object.entries(props.schedule[selectedDay] || {}).map(
                                                        ([period, times]) => (
                                                            <div key={period} className="flex flex-col gap-1">
                                                                <h4 className="font-medium">{period}</h4>
                                                                {times?.map(([start, end]) => {
                                                                    const timeRange = `${start} - ${end}`;
                                                                    return (
                                                                        <Button
                                                                            key={timeRange}
                                                                            title={timeRange}
                                                                            className={
                                                                                selectedTimes.includes(timeRange)
                                                                                    ? 'bg-blue-500 text-white'
                                                                                    : 'bg-gray-200'
                                                                            }
                                                                            onClick={() =>
                                                                                toggleTimeSelection(timeRange)
                                                                            }
                                                                            disabled={
                                                                                selectedTimes.length >= sessionCount &&
                                                                                !selectedTimes.includes(timeRange)
                                                                            }
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                                <div className="mt-2 text-right">
                                                    <span className="text-sm text-gray-600">
                                                        Đã chọn {selectedTimes.length}/{sessionCount} khung giờ
                                                    </span>
                                                </div>
                                            </div>
                                        )}
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
                                                (requestForm.duration / 60) * props.pricePerSession,
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            onClick={() => setShowRequestModal(false)}
                                            className="px-4 py-2 bg-gray-400 text-white rounded"
                                        >
                                            Đóng
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            Gửi yêu cầu
                                        </button>
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
                                <span className="text-lg font-semibold">{props.rating}</span>
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        className={
                                            index < props.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
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
                        className={`fixed bottom-5 right-5 p-3 text-white rounded-md ${
                            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    >
                        {notification.message}
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
                        <p className="text-gray-800 col-span-3">{props.location}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="text-gray-600 font-semibold col-span-1">Môn</p>
                        <div className="flex flex-wrap gap-2 col-span-3">
                            {props.subjects?.length > 0 ? (
                                props.subjects.map((subject) => (
                                    <span key={subject} className="bg-pink-200 text-pink-700 px-3 py-1 rounded-lg">
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
                                        {Array.from({ length: 5 }).map((_, i) =>
                                            i < review.rating ? (
                                                <StarIcon key={i} className="w-5 h-5 fill-yellow-500" />
                                            ) : (
                                                <StarIcon key={i} className="w-5 h-5" />
                                            ),
                                        )}
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
