import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import { AddressIcon, ArrowLeftIcon, ChatIcon, HeartIcon, MailIcon, PhoneIcon, StarIcon } from '../components/icons';
//import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import defaultAvatar from '../assets/avatar.jpg';
import { RequestModal } from '../components/ModalComponent';
import axiosClient from '../configs/axios.config';

export type ScheduleDetail = {
    morning?: [string, string][];
    afternoon?: [string, string][];
    evening?: [string, string][];
    [key: string]: [string, string][] | undefined;
};
type Role = 'STUDENT' | 'TUTOR' | 'ADMIN' | null;
export type Schedule = {
    [key: string]: ScheduleDetail;
};

export interface TutorProfileComponentTutor {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: Role;
    status?: string;
    violate?: number;
    score?: number;
    avatar?: string;
    isOnline?: boolean;
    createdAt?: string;
    updatedAt?: string;

    // Dữ liệu từ backend là mảng, nhưng ta có thể dùng cái đầu tiên
    userProfiles?: UserProfile[];
    tutorProfiles?: TutorProfile[];

    // Đã xử lý normalize trước khi truyền vào component
    userProfile?: UserProfile;
    tutorProfile?: TutorProfile;

    currentUserId?: string;
}

export interface UserProfile {
    id?: string;
    address?: string;
    avatar?: string;
    gender?: string;
    dob?: string;
    idCardNumber?: string;
    walletAddress?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TutorProfile {
    id?: string;
    description: string;
    experiences: number;
    fee?: number;
    hourlyPrice: number;
    level: string;
    qualification: string;
    taughtStudentsCount: number;
    rating: number;
    learningTypes: string[];
    tutorLocations: string[];
    specializations: string[];
    isFavorite?: boolean;
    freeTime: string[];
    reviews?: Review[];
}

export interface Review {
    avatar?: string;
    name: string;
    date: string;
    content: string;
    rating: number;
}

const TutorProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();

    const [tutor, setTutor] = useState<TutorProfileComponentTutor | null>(null);

    const userInfo = tutor ? tutor.userProfiles?.[0] || {} : {};
    const [loading, setLoading] = useState<boolean>(true);
    const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [requestForm, setRequestForm] = useState<{
        title: string;
        content: string;
        specializations: string;
        learningTypes: string;
        location: string;
        duration: number;
        mode: 'online' | 'offline';
        hourlyPrice: number;
        level: string;
        sessionsPerWeek: number;
    }>({
        title: '',
        content: '',
        specializations: '',
        learningTypes: '',
        location: '',
        duration: 60,
        mode: 'online',
        hourlyPrice: 0,
        level: '',
        sessionsPerWeek: 1,
    });
    //const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedTimes] = useState<string[]>([]);
    //const [sessionCount, setSessionCount] = useState<number>(1);
    const [notification, setNotification] = useState<{
        message: string;
        show: boolean;
        type: 'success' | 'error';
    }>({
        message: '',
        show: false,
        type: 'success',
    });

    // Cập nhật requestForm khi tutor thay đổi
    useEffect(() => {
        if (tutor?.tutorProfile) {
            setRequestForm((prev) => ({
                ...prev,
                specializations: tutor.tutorProfile?.specializations?.[0] || '',
                learningTypes: tutor.tutorProfile?.learningTypes?.[0] || '',
                location: tutor.tutorProfile?.tutorLocations?.[0] || '',
                hourlyPrice: tutor.tutorProfile?.hourlyPrice || 0,
            }));
            setIsFavorite(tutor.tutorProfile?.isFavorite || false);
        }
    }, [tutor]);

    // Fetch dữ liệu gia sư
    useEffect(() => {
        const mapTutorData = (data: TutorProfileComponentTutor, isCurrentUser: boolean): TutorProfileComponentTutor => {
            const userProfile = data.userProfile || data.userProfiles?.[0];
            const tutorProfile = data.tutorProfile || data.tutorProfiles?.[0];

            return {
                ...data,
                currentUserId: isCurrentUser ? data.id : data.currentUserId,
                status: data.status,
                violate: data.violate,
                userProfile: userProfile
                    ? {
                          avatar: userProfile.avatar || defaultAvatar,
                          gender: userProfile.gender || 'Unknown',
                          dob: userProfile.dob || '',
                          address: userProfile.address || '',
                      }
                    : {
                          avatar: defaultAvatar,
                          gender: 'Unknown',
                          dob: '',
                          address: '',
                      },
                tutorProfile: tutorProfile
                    ? {
                          ...tutorProfile,
                          hourlyPrice: tutorProfile.hourlyPrice || 0,
                          experiences: tutorProfile.experiences || 0,
                          taughtStudentsCount: tutorProfile.taughtStudentsCount || 0,
                          rating: tutorProfile.rating || 0,
                          description: tutorProfile.description || '',
                          tutorLocations: tutorProfile.tutorLocations || [],
                          specializations: tutorProfile.specializations || [],
                          learningTypes: tutorProfile.learningTypes || [],
                          reviews: tutorProfile.reviews || [],
                          isFavorite: tutorProfile.isFavorite ?? false,
                          freeTime: tutorProfile.freeTime || [],
                          qualification: tutorProfile.qualification || '',
                      }
                    : undefined,
            };
        };

        const fetchTutorDetail = async () => {
            try {
                const API_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';
                const tutorId = id || currentUser?.id;
                if (!tutorId) {
                    setLoading(false);
                    return;
                }

                if (currentUser?.role === 'TUTOR' && currentUser.id === tutorId) {
                    const mappedTutor = mapTutorData(currentUser, true);
                    setTutor(mappedTutor);
                    setLoading(false);
                    return;
                }

                const response = await axiosClient.get(`${API_URL}/api/v1/tutors/${tutorId}`);
                console.log('Raw tutorData:', response.data);
                const tutorData = response.data as TutorProfileComponentTutor;
                const mappedTutor = mapTutorData(tutorData, false);
                setTutor(mappedTutor);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tutor:', error);
                setLoading(false);
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    alert('Không tìm thấy thông tin gia sư');
                } else {
                    alert('Có lỗi xảy ra khi tải thông tin gia sư');
                }
            }
        };

        if (location.state) {
            const stateTutor = location.state as TutorProfileComponentTutor;
            const mappedTutor = mapTutorData(stateTutor, false);
            setTutor(mappedTutor);
            setLoading(false);
        } else {
            fetchTutorDetail();
        }
    }, [id, location.state, currentUser]);
    console.log('tutor', tutor);
    console.log('userInfo', userInfo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRequestForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'duration' &&
                tutor?.tutorProfile && {
                    hourlyPrice: (parseInt(value) / 60) * tutor.tutorProfile.hourlyPrice,
                }),
        }));
    };

    const handleSubmit = async (): Promise<void> => {
        if (!tutor) return;

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
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gửi yêu cầu thất bại');
            setNotification({ message: 'Gửi yêu cầu thành công!', show: true, type: 'success' });
            setShowRequestModal(false);
        } catch (error) {
            setNotification({
                message: error instanceof Error ? error.message : 'Lỗi khi gửi yêu cầu',
                show: true,
                type: 'error',
            });
            setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
        }
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

    // const toggleTimeSelection = (timeRange: string) => {
    //     setSelectedTimes((prev) => {
    //         const timeSet = new Set(prev);
    //         if (timeSet.has(timeRange)) {
    //             timeSet.delete(timeRange);
    //         } else if (timeSet.size < sessionCount) {
    //             timeSet.add(timeRange);
    //         } else {
    //             setNotification({
    //                 message: `Bạn chỉ có thể chọn tối đa ${sessionCount} khung giờ`,
    //                 show: true,
    //                 type: 'error',
    //             });
    //             setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
    //             return prev;
    //         }
    //         return Array.from(timeSet);
    //     });
    // };

    const getAge = (dob: string): number => {
        if (!dob) return 0;
        return new Date().getFullYear() - new Date(dob).getFullYear();
    };

    const maskEmail = (email: string): string => {
        const [username, domain] = email.split('@');
        return `${username.slice(0, 3)}***@${domain}`;
    };

    const maskPhone = (phone: string): string => {
        if (!phone) return '';
        return phone.slice(0, -3) + '***';
    };

    const translateGender = (gender: string): string => {
        switch (gender) {
            case 'MALE':
                return 'Nam';
            case 'FEMALE':
                return 'Nữ';
            default:
                return 'Không xác định';
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10">
                Đang tải... <span className="animate-spin">⏳</span>
            </div>
        );
    }

    if (!tutor) {
        return <div>Không tìm thấy gia sư</div>;
    }

    return (
        <>
            <SEO
                title={
                    tutor ? `${tutor.name} - Gia sư ${tutor.tutorProfile?.specializations?.join(', ') || ''}` : 'Gia sư'
                }
                description={
                    tutor && tutor.tutorProfile
                        ? `${tutor.name} - Gia sư ${tutor.tutorProfile.specializations?.join(', ') || ''} với ${
                              tutor.tutorProfile.experiences || 0
                          } năm kinh nghiệm. Đánh giá ${tutor.tutorProfile.rating || 0}/5 từ ${
                              tutor.tutorProfile.reviews?.length || 0
                          } học sinh.`
                        : 'Thông tin gia sư'
                }
                ogImage={tutor.userProfile?.avatar || defaultAvatar}
            />
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
                                src={userInfo.avatar || defaultAvatar}
                                alt={tutor.name}
                                className="w-24 h-24 rounded-full mr-4 object-cover"
                                onError={(e) => (e.currentTarget.src = defaultAvatar)}
                            />
                            <div>
                                <h1 className="text-2xl font-bold">{tutor.name}</h1>
                                <p className="text-lg text-gray-700 font-bold">
                                    {new Intl.NumberFormat('vi-VN').format(tutor.tutorProfile?.hourlyPrice || 0)}đ/h
                                </p>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="flex items-center gap-2">
                                        {tutor.tutorProfile?.learningTypes?.length ? (
                                            tutor.tutorProfile.learningTypes.map((type) => (
                                                <span
                                                    key={`learning-type-${type}`}
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
                                        <p className="text-gray-600">
                                            {tutor.tutorProfile?.tutorLocations?.join(', ') || 'Chưa cập nhật'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MailIcon className="w-5 h-5 text-gray-600" />
                                        <p className="text-gray-600">{maskEmail(tutor.email || '')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="w-5 h-5 text-gray-600" />
                                        <p className="text-gray-600">{maskPhone(tutor.phone || '')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-100 p-4 rounded-lg text-center">
                            {tutor.currentUserId === tutor.id ? (
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

                            <div className="text-gray-700 mt-2">
                                <div className="flex space-x-2 items-center justify-center">
                                    <HeartIcon
                                        className={`cursor-pointer ${
                                            isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'
                                        }`}
                                        onClick={handleFavorite}
                                    />
                                    <Link to="/conversation">
                                        <ChatIcon className="text-gray-500 cursor-pointer" />
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-1 justify-center">
                                    <span className="text-lg font-semibold">{tutor.tutorProfile?.rating || 0}</span>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <StarIcon
                                            key={`star-${index}`}
                                            className={
                                                index < (tutor.tutorProfile?.rating || 0)
                                                    ? 'text-yellow-500 fill-current'
                                                    : 'text-gray-300'
                                            }
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {tutor.tutorProfile?.reviews?.length || 0} đánh giá
                                </p>
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
                            <p className="text-gray-800 col-span-3">{tutor.tutorProfile?.description || ''}</p>
                            <p className="text-gray-600 font-semibold col-span-1">Giới tính</p>
                            <p className="text-gray-800 col-span-3">{translateGender(userInfo.gender || 'Unknown')}</p>
                            <p className="text-gray-600 font-semibold col-span-1">Năm sinh</p>
                            <p className="text-gray-800 col-span-3">
                                {tutor.userProfile?.dob || tutor.userProfiles?.[0]?.dob
                                    ? `${new Date(
                                          tutor.userProfile?.dob || tutor.userProfiles?.[0]?.dob || '',
                                      ).getFullYear()} (${getAge(
                                          tutor.userProfile?.dob || tutor.userProfiles?.[0]?.dob || '',
                                      )} tuổi)`
                                    : 'Chưa cập nhật'}
                            </p>
                            <p className="text-gray-600 font-semibold col-span-1">Khối</p>
                            <p className="text-gray-800 col-span-3">{tutor.tutorProfile?.level || ''}</p>
                            <p className="text-gray-600 font-semibold col-span-1">Trình độ chuyên môn</p>
                            <p className="col-span-3">
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg inline-block">
                                    {tutor.tutorProfile?.qualification || 'Chưa cập nhật'}
                                </span>
                            </p>
                            <p className="text-gray-600 font-semibold col-span-1">Kinh nghiệm</p>
                            <p className="text-gray-800 col-span-3">{tutor.tutorProfile?.experiences || 0} năm</p>
                            <p className="text-gray-600 font-semibold col-span-1">Số học sinh đã dạy</p>
                            <p className="text-gray-800 col-span-3">
                                {tutor.tutorProfile?.taughtStudentsCount || 0} học sinh
                            </p>
                            <p className="text-gray-600 font-semibold col-span-1">Nơi dạy</p>
                            <div className="col-span-3">
                                {tutor.tutorProfile?.tutorLocations?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.tutorProfile.tutorLocations.map((location) => (
                                            <span
                                                key={`location-${location}`}
                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg"
                                            >
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
                                {tutor.tutorProfile?.specializations?.length ? (
                                    tutor.tutorProfile.specializations.map((subject) => (
                                        <span
                                            key={`subject-${subject}`}
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
                        {tutor.tutorProfile?.freeTime?.length && tutor.tutorProfile.freeTime[0] ? (
                            <div className="flex flex-wrap gap-2">
                                {tutor.tutorProfile.freeTime.map((time) => (
                                    <span key={time} className="bg-green-200 text-gray-700 px-3 py-1 rounded-lg">
                                        {time || 'Không xác định'}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Chưa có lịch rảnh</p>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">
                            Đánh giá ({tutor.tutorProfile?.reviews?.length || 0})
                        </h2>
                        {tutor.tutorProfile?.reviews?.length ? (
                            tutor.tutorProfile.reviews.map((review) => (
                                <div key={`${review.name}-${review.date}`} className="flex items-start mb-4">
                                    <img
                                        src={review.avatar || defaultAvatar}
                                        alt={review.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold">{review.name}</h3>
                                        <p className="text-sm text-gray-500">{review.date}</p>
                                        <p className="text-gray-700">{review.content}</p>
                                        <div className="flex text-yellow-500">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <StarIcon
                                                    key={`review-star-${review.date}-${i}`}
                                                    className={
                                                        i < (review.rating || 0)
                                                            ? 'text-yellow-500 fill-current'
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
            <RequestModal
                show={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                onSubmit={handleSubmit}
                requestForm={requestForm}
                handleChange={handleChange}
                tutorSpecializations={tutor.tutorProfile?.specializations || []}
                tutorLearningTypes={tutor.tutorProfile?.learningTypes || []}
                tutorHourlyPrice={tutor.tutorProfile?.hourlyPrice || 0}
            />
        </>
    );
};

export default TutorProfile;
