import { useState } from 'react';
import { HeartIcon, ChatIcon, StarIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import { TutorProfileComponentProps } from './TutorProfileComponent';

// Use TutorProfileComponentProps directly since that's what Tutor.tsx provides
const TutorDetailCard: React.FC<TutorProfileComponentProps> = (tutor) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(tutor.isFavorite);
    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        setNotification({
            message: isFavorite ? 'Đã xóa yêu thích' : 'Đã thêm vào yêu thích',
            show: true,
            type: 'success',
        });
        setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 border border-gray-300">
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
                    <ChatIcon className="text-gray-500 cursor-pointer" />
                </div>
            </div>
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
            </div>
            <div className="flex flex-col items-center md:items-end space-y-2">
                <button
                    className="px-4 py-2 bg-green-100 text-green-600 rounded-md"
                    onClick={() => navigate(`/tutor-profile/${tutor.id}`, { state: tutor })}
                >
                    Xem chi tiết
                </button>
                <div className="flex items-center space-x-1">
                    <span className="text-lg font-semibold">{tutor.rating}</span>
                    {[...Array(5)].map((_, index) => (
                        <StarIcon
                            key={index}
                            className={index < tutor.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                        />
                    ))}
                </div>
                <a href="#" className="text-blue-500">
                    {tutor.reviews.length} đánh giá
                </a>
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
        </div>
    );
};

export default TutorDetailCard;
