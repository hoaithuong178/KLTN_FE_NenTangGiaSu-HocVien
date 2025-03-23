import { useState } from 'react';
import { HeartIcon, ChatIcon, StarIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import { TutorProfileComponentProps } from './TutorProfileComponent';
import { Button } from './Button'; // Giả sử bạn đã có Button component

const TutorDetailCard: React.FC<TutorProfileComponentProps & { className?: string }> = ({
    className = '',
    ...tutor
}) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(tutor.isFavorite);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });

    // State cho form yêu cầu dạy
    const [requestForm, setRequestForm] = useState({
        title: '',
        content: '',
        subject: tutor.subjects.length > 0 ? tutor.subjects[0] : '',
        location:
            Array.isArray(tutor.tutorLocations) && tutor.tutorLocations.length > 0
                ? tutor.tutorLocations[0]
                : tutor.location || '',
        duration: 60,
        mode: 'online' as 'online' | 'offline',
        pricePerSession: tutor.pricePerSession,
    });
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [sessionCount, setSessionCount] = useState<number>(1);

    // Xử lý yêu thích
    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn sự kiện click trên card
        setIsFavorite(!isFavorite);
        setNotification({
            message: isFavorite ? 'Đã xóa yêu thích' : 'Đã thêm vào yêu thích',
            show: true,
            type: 'success',
        });
        setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
    };

    // Xử lý click vào card
    const handleCardClick = () => {
        console.log('Original tutor data:', tutor);
        console.log('Original tutorLocations:', tutor.tutorLocations);

        // Chuyển đổi id sang số
        const tutorId =
            typeof tutor.id === 'string' ? parseInt(String(tutor.id).replace(/\D/g, '')) || 0 : tutor.id || 0;

        // Xử lý địa điểm dạy
        const locations =
            Array.isArray(tutor.tutorLocations) && tutor.tutorLocations.length > 0
                ? tutor.tutorLocations
                : tutor.location
                ? [tutor.location]
                : [];

        const correctedTutor = {
            ...tutor,
            id: tutorId,
            learningTypes: Array.isArray(tutor.learningTypes)
                ? tutor.learningTypes
                : [tutor.learningTypes || 'Unknown'],
            subjects: tutor.subjects || [],
            schedule: tutor.schedule || {},
            reviews: tutor.reviews || [],
            tutorLocations: locations,
        };

        console.log('Corrected tutor data before navigate:', correctedTutor);
        console.log('Corrected tutorLocations:', correctedTutor.tutorLocations);
        navigate(`/tutor-profile/${tutorId}`, { state: correctedTutor });
    };

    // Xử lý form yêu cầu dạy
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRequestForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'duration' && {
                pricePerSession: (parseInt(value) / 60) * tutor.pricePerSession,
            }),
        }));
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

    const handleSubmit = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn sự kiện click trên card
        try {
            const response = await fetch('/api/send-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...requestForm,
                    tutorId: tutor.id,
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

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 border border-gray-300 cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}
            onClick={handleCardClick}
        >
            {/* Avatar và thông tin cơ bản */}
            <div className="flex flex-col items-center">
                <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-24 h-24 object-cover border border-gray-300 rounded-lg"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                />
                <span className="mt-2 text-sm">{tutor.totalClasses} lớp</span>
                <div className="flex space-x-2 mt-2">
                    <HeartIcon
                        className={`cursor-pointer ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'}`}
                        onClick={handleFavorite}
                    />
                    <ChatIcon className="text-gray-500 cursor-pointer" onClick={(e) => e.stopPropagation()} />
                </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="flex-1">
                <h2 className="text-xl font-bold">{tutor.name}</h2>
                <p className="text-lg font-semibold">{tutor.pricePerSession.toLocaleString('vi-VN')}đ/h</p>
                <p className="mt-2 text-gray-700">{tutor.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                    {tutor.subjects.map((subject) => (
                        <span key={subject} className="px-4 py-2 bg-red-100 text-red-600 rounded-md text-sm">
                            {subject}
                        </span>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {(Array.isArray(tutor.tutorLocations) && tutor.tutorLocations.length > 0
                        ? tutor.tutorLocations
                        : tutor.location
                        ? [tutor.location]
                        : []
                    ).map((location) => (
                        <span key={location} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md text-sm">
                            {location}
                        </span>
                    ))}
                </div>
            </div>

            {/* Rating và nút Gửi yêu cầu */}
            <div className="flex flex-col items-center md:items-end space-y-2">
                <Button
                    title="Gửi yêu cầu dạy"
                    backgroundColor="#1B223B"
                    hoverBackgroundColor="#2A3349"
                    foreColor="white"
                    className="px-4 py-2 rounded-md text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation(); // Ngăn sự kiện click trên card
                        setShowRequestModal(true);
                    }}
                />
                <div className="flex items-center space-x-1">
                    <span className="text-lg font-semibold">{tutor.rating}</span>
                    {[...Array(5)].map((_, index) => (
                        <StarIcon
                            key={index}
                            className={index < tutor.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                        />
                    ))}
                </div>
                <a href="#" className="text-blue-500" onClick={(e) => e.stopPropagation()}>
                    {tutor.reviews.length} đánh giá
                </a>
            </div>

            {/* Modal Gửi yêu cầu dạy */}
            {showRequestModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setShowRequestModal(false)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4 text-[#1B223B]">Gửi yêu cầu dạy</h2>
                        <label className="block font-semibold text-gray-700 mb-1">Tiêu đề</label>
                        <input
                            type="text"
                            name="title"
                            value={requestForm.title}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-2 shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none"
                        />
                        <label className="block font-semibold text-gray-700 mb-1">Nội dung</label>
                        <textarea
                            name="content"
                            value={requestForm.content}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-2 shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none"
                            rows={3}
                        />
                        <label className="block font-semibold text-gray-700 mb-1">Môn học</label>
                        <select
                            name="subject"
                            value={requestForm.subject}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-2 shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none"
                        >
                            {tutor.subjects?.length > 0 ? (
                                tutor.subjects.map((subj) => (
                                    <option key={subj} value={subj}>
                                        {subj}
                                    </option>
                                ))
                            ) : (
                                <option value="">Không có môn học</option>
                            )}
                        </select>
                        <label className="block font-semibold text-gray-700 mb-1">Địa điểm</label>
                        <input
                            type="text"
                            name="location"
                            value={requestForm.location}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-2 shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none"
                        />
                        <div className="flex space-x-2">
                            <div className="flex-1">
                                <label className="block font-semibold text-gray-700 mb-1">Số buổi</label>
                                <input
                                    type="number"
                                    name="sessions"
                                    value={sessionCount}
                                    onChange={(e) => setSessionCount(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full border p-2 rounded mb-2 shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none"
                                    min="1"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-semibold text-gray-700 mb-1">Thời lượng/buổi (phút)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={requestForm.duration}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded mb-2 shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none"
                                    min="30"
                                    step="30"
                                />
                            </div>
                        </div>
                        <label className="block font-semibold text-gray-700 mb-1">Hình thức học</label>
                        <div className="flex space-x-4 mb-2">
                            <label className="flex items-center space-x-2">
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
                            <label className="flex items-center space-x-2">
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
                        <label className="block font-semibold text-gray-700 mb-1">Chọn ngày và giờ học</label>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2 flex-wrap">
                                {Object.keys(tutor.schedule || {}).map((day) => (
                                    <Button
                                        key={day}
                                        title={day}
                                        className={`px-3 py-1 rounded-md text-sm ${
                                            selectedDay === day
                                                ? 'bg-[#1B223B] text-white'
                                                : 'bg-gray-200 text-gray-700'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDay(day);
                                        }}
                                    />
                                ))}
                            </div>
                            {selectedDay && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Chọn khung giờ:</h3>
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {Object.entries(tutor.schedule[selectedDay] || {}).map(([period, times]) => (
                                            <div key={period} className="flex flex-col gap-1">
                                                <h4 className="font-medium text-gray-600">{period}</h4>
                                                {times?.map(([start, end]) => {
                                                    const timeRange = `${start} - ${end}`;
                                                    return (
                                                        <Button
                                                            key={timeRange}
                                                            title={timeRange}
                                                            className={`px-3 py-1 rounded-md text-sm ${
                                                                selectedTimes.includes(timeRange)
                                                                    ? 'bg-[#1B223B] text-white'
                                                                    : 'bg-gray-200 text-gray-700'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleTimeSelection(timeRange);
                                                            }}
                                                            disabled={
                                                                selectedTimes.length >= sessionCount &&
                                                                !selectedTimes.includes(timeRange)
                                                            }
                                                        />
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-right">
                                        <span className="text-sm text-gray-600">
                                            Đã chọn {selectedTimes.length}/{sessionCount} khung giờ
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-100 p-2 rounded-md mb-2 mt-4">
                            <label className="block font-semibold text-gray-700 mb-1">Giá/buổi:</label>
                            <input
                                type="number"
                                name="pricePerSession"
                                value={requestForm.pricePerSession}
                                onChange={handleChange}
                                className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none"
                                placeholder={new Intl.NumberFormat('vi-VN').format(
                                    (requestForm.duration / 60) * tutor.pricePerSession,
                                )}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button
                                title="Đóng"
                                backgroundColor="#D1D5DB"
                                hoverBackgroundColor="#B3B8C2"
                                foreColor="#1B223B"
                                className="px-4 py-2 rounded-md text-sm font-semibold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowRequestModal(false);
                                }}
                            />
                            <Button
                                title="Gửi yêu cầu"
                                backgroundColor="#1B223B"
                                hoverBackgroundColor="#2A3349"
                                foreColor="white"
                                className="px-4 py-2 rounded-md text-sm font-semibold"
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Thông báo */}
            {notification.show && (
                <div
                    className={`fixed bottom-5 right-5 p-3 text-white rounded-md shadow-lg ${
                        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default TutorDetailCard;
