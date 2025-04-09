import { useState } from 'react';
import { HeartIcon, ChatIcon, StarIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import { TutorProfile, TutorProfileComponentTutor } from '../pages/TutorProfile';
import { Button } from './Button';
import defaultAvatar from '../assets/avatar.jpg';

interface TutorDetailCardProps extends TutorProfileComponentTutor {
    className?: string;
    onRequestClick: () => void;
}

const TutorDetailCard: React.FC<TutorDetailCardProps> = ({ className = '', onRequestClick, ...tutor }) => {
    const navigate = useNavigate();

    const userProfile = tutor.userProfiles?.[0] || tutor.userProfile || {};
    const tutorProfile: Partial<TutorProfile> = tutor.tutorProfiles?.[0] || tutor.tutorProfile || {};

    const [isFavorite, setIsFavorite] = useState(tutorProfile.isFavorite || false);
    const [notification, setNotification] = useState({
        message: '',
        show: false,
        type: 'success' as 'success' | 'error',
    });

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        setNotification({
            message: !isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa yêu thích',
            show: true,
            type: 'success',
        });
        setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
    };

    const handleCardClick = () => {
        const correctedTutor = {
            ...tutor,
            id: tutor.id || '',
            email: tutor.email || '',
            phone: tutor.phone || '',
            learningTypes: tutorProfile.learningTypes || ['Unknown'],
            subjects: tutorProfile.specializations || [],
            freeTime: tutorProfile.freeTime || [],
            reviews: tutorProfile.reviews || [],
            tutorLocations: tutorProfile.tutorLocations || [],
            description: tutorProfile.description || '',
            rating: tutorProfile.rating || 0,
            hourlyPrice: tutorProfile.hourlyPrice || 0,
            isFavorite: tutorProfile.isFavorite || false,
            taughtStudentsCount: tutorProfile.taughtStudentsCount || 0,
        };

        navigate(`/tutor-profile/${tutor.id}`, { state: correctedTutor });
    };

    return (
        <>
            <div
                className={`bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 border border-gray-300 cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}
                onClick={handleCardClick}
            >
                {/* Avatar + hành động */}
                <div className="flex flex-col items-center">
                    <img
                        src={userProfile.avatar || defaultAvatar}
                        alt={tutor.name}
                        className="w-24 h-24 object-cover border border-gray-300 rounded-lg"
                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                    />
                    <span className="mt-2 text-sm">{tutorProfile.taughtStudentsCount || 0} lớp</span>
                    <div className="flex space-x-2 mt-2">
                        <HeartIcon
                            className={`cursor-pointer ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'}`}
                            onClick={handleFavorite}
                        />
                        <ChatIcon className="text-gray-500 cursor-pointer" onClick={(e) => e.stopPropagation()} />
                    </div>
                </div>

                {/* Thông tin tutor */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold">{tutor.name}</h2>
                    <p className="text-lg font-semibold">
                        {tutorProfile.hourlyPrice?.toLocaleString('vi-VN') || '---'}đ/h
                    </p>
                    <p className="mt-2 text-gray-700">{tutorProfile.description || 'Chưa có mô tả'}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {tutorProfile.specializations?.length ? (
                            tutorProfile.specializations.map((subject) => (
                                <span key={subject} className="px-4 py-2 bg-red-100 text-red-600 rounded-md text-sm">
                                    {subject}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400">Chưa cập nhật môn dạy</span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {tutorProfile.tutorLocations?.length ? (
                            tutorProfile.tutorLocations.map((location, index) => (
                                <span
                                    key={`location-${index}`}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md text-sm"
                                >
                                    {location}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400">Chưa có địa điểm dạy</span>
                        )}
                    </div>
                </div>

                {/* Rating + Button */}
                <div className="flex flex-col items-center md:items-end space-y-2">
                    <Button
                        title="Gửi yêu cầu dạy"
                        backgroundColor="#1B223B"
                        hoverBackgroundColor="#2A3349"
                        foreColor="white"
                        className="px-4 py-2 rounded-md text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRequestClick();
                        }}
                    />

                    <div className="flex items-center space-x-1">
                        <span className="text-lg font-semibold">{tutorProfile.rating || 0}</span>
                        {[...Array(5)].map((_, index) => (
                            <StarIcon
                                key={index}
                                className={
                                    index < Math.round(tutorProfile.rating || 0)
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                }
                            />
                        ))}
                    </div>

                    <a href="#" className="text-blue-500" onClick={(e) => e.stopPropagation()}>
                        {tutorProfile.reviews?.length || 0} đánh giá
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
