import { useState } from 'react';
import { HeartIcon, ChatIcon, StarIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import { TutorProfileComponentProps } from './TutorProfileComponent';
import { Button } from './Button'; // Giả sử bạn đã có Button component

interface TutorDetailCardProps extends TutorProfileComponentProps {
    className?: string;
    onRequestClick: () => void;
}

const TutorDetailCard: React.FC<TutorDetailCardProps> = ({ className = '', onRequestClick, ...tutor }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(tutor.isFavorite);
    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });

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
            email: tutor.email || tutor.email || '',
            phone: tutor.phone || tutor.phone || '',
            learningTypes: Array.isArray(tutor.learningTypes)
                ? tutor.learningTypes
                : [tutor.learningTypes || 'Unknown'],
            subjects: tutor.subjects || [],
            schedule: tutor.schedule || {},
            reviews: tutor.reviews || [],
            tutorLocations: locations,
        };

        navigate(`/tutor-profile/${tutorId}`, { state: correctedTutor });
    };

    return (
        <>
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
                            onRequestClick();
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
            </div>

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
        </>
    );
};

export default TutorDetailCard;
