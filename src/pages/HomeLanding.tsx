import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import HeroImage from '../assets/HeroSection.svg';
import { Button } from '../components/Button';
import Footer from '../components/Footer';
import HeaderLanding from '../components/HeaderLanding';
import { useAuthStore } from '../store/authStore';
import ReviewCard from '../components/ReviewCard';
import Logo from '../assets/FullLogo.png';
import axios from 'axios';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { TutorProfileComponentTutor } from './TutorProfile';
import defaultAvatar from '../assets/avatar.jpg';

const TutorSection = () => {
    const [tutors, setTutors] = useState<TutorProfileComponentTutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                setLoading(true);
                setError(null);
                const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
                if (!API_URL) throw new Error('API_BASE_URL not set in .env');

                const response = await axios.get(`${API_URL}/tutors/search?page=1&limit=6`);
                const tutorsData = response.data?.data;

                if (!Array.isArray(tutorsData)) {
                    throw new Error('Invalid tutor list from API');
                }

                const mapTutorData = (
                    data: TutorProfileComponentTutor,
                    isCurrentUser: boolean,
                ): TutorProfileComponentTutor => ({
                    ...data,
                    currentUserId: isCurrentUser ? data.id : data.currentUserId,
                    status: data.status || 'ACTIVE',
                    violate: data.violate || 0,
                    userProfile: data.userProfile || {
                        avatar: defaultAvatar,
                        gender: 'Unknown',
                        dob: '',
                        address: '',
                    },
                    tutorProfile: data.tutorProfile
                        ? {
                              ...data.tutorProfile,
                              hourlyPrice: data.tutorProfile.hourlyPrice || 0,
                              experiences: data.tutorProfile.experiences || 0,
                              taughtStudentsCount: data.tutorProfile.taughtStudentsCount || 0,
                              rating: data.tutorProfile.rating || 0,
                              description: data.tutorProfile.description || '',
                              tutorLocations: data.tutorProfile.tutorLocations || [],
                              specializations: data.tutorProfile.specializations || [],
                              learningTypes: data.tutorProfile.learningTypes || [],
                              reviews: data.tutorProfile.reviews || [],
                              isFavorite: data.tutorProfile.isFavorite ?? false,
                              freeTime: data.tutorProfile.freeTime || [],
                              qualification: data.tutorProfile.qualification || '',
                          }
                        : undefined,
                });

                const processedTutors: TutorProfileComponentTutor[] = tutorsData.map((tutor) =>
                    mapTutorData(tutor, false),
                );

                setTutors(processedTutors);
            } catch (err) {
                console.error('Error fetching tutors:', err);
                setError(err instanceof Error ? err.message : 'Không thể tải danh sách gia sư');
            } finally {
                setLoading(false);
            }
        };

        fetchTutors();
    }, []);

    const handleTutorClick = (tutor: TutorProfileComponentTutor) => {
        if (!user) {
            setShowModal(true);
        } else {
            navigate(`/tutor-profile/${tutor.id}`, {
                state: {
                    ...tutor,
                    id: tutor.id,
                    email: tutor.email || '',
                    phone: tutor.phone || '',
                    userProfile: {
                        ...tutor.userProfile,
                        avatar: tutor.userProfile?.avatar || defaultAvatar,
                    },
                    tutorProfile: {
                        ...tutor.tutorProfile,
                        learningTypes: tutor.tutorProfile?.learningTypes || [],
                        specializations: tutor.tutorProfile?.specializations || [],
                        freeTime: tutor.tutorProfile?.freeTime || {},
                        reviews: tutor.tutorProfile?.reviews || [],
                        tutorLocations: tutor.tutorProfile?.tutorLocations || [],
                    },
                },
            });
        }
    };

    return (
        <section id="tutors" className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#1B223B] mb-4">Đội ngũ gia sư xuất sắc</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Đội ngũ gia sư chất lượng cao với nhiều năm kinh nghiệm giảng dạy, được đào tạo bài bản và tận
                        tâm với học sinh.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
                                <div className="bg-gray-200 h-4 w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <div className="text-red-500 mb-4">{error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-[#FFC569] text-[#1B223B] rounded-lg hover:bg-[#FFB347] transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : tutors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Không tìm thấy gia sư nào</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tutors.map((tutor, index) => (
                            <div
                                key={`tutor-${tutor.id || index}`}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={() => handleTutorClick(tutor)}
                            >
                                <div className="relative">
                                    <img
                                        src={tutor.userProfile?.avatar || 'https://via.placeholder.com/150'}
                                        alt={tutor.name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/150';
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                                        <HeartIcon
                                            className={`w-6 h-6 ${
                                                tutor.tutorProfile?.isFavorite
                                                    ? 'text-red-500 fill-current'
                                                    : 'text-gray-500'
                                            }`}
                                        />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-[#1B223B] mb-2">{tutor.name}</h3>
                                    <div className="flex items-center mb-2">
                                        <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                                        <span className="text-gray-600">
                                            {(tutor.tutorProfile?.rating || 0).toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {tutor.tutorProfile?.specializations?.slice(0, 3).map((subject, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>{tutor.tutorProfile?.experiences || 0} năm kinh nghiệm</span>
                                        <span>{tutor.tutorProfile?.taughtStudentsCount || 0} lớp đã dạy</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/tutors')}
                        className="px-6 py-3 bg-[#1B223B] text-white rounded-lg hover:bg-[#2A3349] transition-colors duration-300"
                    >
                        Xem tất cả gia sư
                    </button>
                </div>
            </div>
            {/* Login Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fade-in relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-5"></div>

                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Logo */}
                            <div className="flex justify-center mb-6">
                                <img src={Logo} alt="TeachMe Logo" className="h-12 w-auto" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-[#1B223B] text-center mb-2">
                                Đăng nhập để trải nghiệm TeachMe!
                            </h2>
                            <p className="text-gray-600 text-center mb-8">
                                Tạo tài khoản để kết nối với gia sư chất lượng và bắt đầu hành trình học tập của bạn
                            </p>

                            {/* Buttons */}
                            <div className="space-y-4">
                                <Button
                                    title="Đăng nhập ngay"
                                    backgroundColor="#FFC569"
                                    hoverBackgroundColor="#FFB347"
                                    foreColor="#1B223B"
                                    className="w-full py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                    onClick={() => navigate('/sign-in')}
                                />
                                <Button
                                    title="Đăng ký tài khoản mới"
                                    backgroundColor="transparent"
                                    hoverBackgroundColor="#FFC569"
                                    foreColor="#1B223B"
                                    className="w-full py-3 rounded-full text-lg font-semibold border-2 border-[#FFC569] hover:bg-[#FFC569] transition-all duration-300"
                                    onClick={() => navigate('/register')}
                                />
                            </div>

                            {/* Features */}
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="w-5 h-5 text-[#FFC569] mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Kết nối với gia sư chất lượng</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="w-5 h-5 text-[#FFC569] mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Quản lý lịch học linh hoạt</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="w-5 h-5 text-[#FFC569] mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Đánh giá và phản hồi chi tiết</span>
                                </div>
                            </div>

                            {/* Skip Button */}
                            <button
                                className="mt-6 text-sm text-gray-500 hover:text-[#FFC569] transition-colors mx-auto block"
                                onClick={() => setShowModal(false)}
                            >
                                Để sau
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

const ReviewSection = () => {
    const reviews = [
        {
            id: 1,
            avatar: 'https://i.pravatar.cc/150?img=1',
            name: 'Nguyễn Thị Hương',
            rating: 5,
            title: 'Dễ hiểu, thân thiện',
            content:
                'Buổi học thú vị, gia sư giảng dạy dễ hiểu. Phương pháp dạy học rất hiệu quả và phù hợp với học sinh.',
            tags: ['Toán học', 'Gia sư nhiệt tình', 'Tiến bộ nhanh'],
        },
        {
            id: 2,
            avatar: 'https://i.pravatar.cc/150?img=2',
            name: 'Trần Minh Anh',
            rating: 4.8,
            title: 'Phương pháp đa dạng',
            content: 'Gia sư giàu kinh nghiệm, tiến bộ nhanh. Các bài tập được thiết kế phù hợp với trình độ.',
            tags: ['Tiếng Anh', 'Phương pháp sáng tạo', 'Kết quả tốt'],
        },
        {
            id: 3,
            avatar: 'https://i.pravatar.cc/150?img=3',
            name: 'Lê Thị Bích',
            rating: 4.5,
            title: 'Nhiệt tình hỗ trợ',
            content: 'Không khí học thoải mái, rất kiên nhẫn. Gia sư luôn sẵn sàng giải đáp thắc mắc.',
            tags: ['Hóa học', 'Hỗ trợ 24/7', 'Môi trường học tốt'],
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    avatar={review.avatar}
                    name={review.name}
                    rating={review.rating}
                    title={review.title}
                    content={review.content}
                    tags={review.tags}
                />
            ))}
        </div>
    );
};

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Cột Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-[#1B223B] mb-6">Gửi tin nhắn cho chúng tôi</h2>
                {submitted && (
                    <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Tin nhắn của bạn đã được gửi thành công!
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none transition-all"
                            placeholder="Nhập họ và tên của bạn"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none transition-all"
                            placeholder="Nhập email của bạn"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                            Tin nhắn
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={5}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none transition-all"
                            placeholder="Viết tin nhắn của bạn tại đây..."
                        />
                    </div>
                    <Button
                        title="Gửi tin nhắn"
                        backgroundColor="#1B223B"
                        hoverBackgroundColor="#2A3349"
                        foreColor="white"
                        className="w-full py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                        type="submit"
                    />
                </form>
            </div>

            {/* Cột Thông tin liên hệ */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-[#1B223B] mb-6">Thông tin liên hệ</h2>
                <div className="space-y-6">
                    <div className="flex items-start">
                        <svg
                            className="w-6 h-6 text-[#FFC569] mr-3 mt-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <div>
                            <p className="text-gray-700 font-medium">Email</p>
                            <a
                                href="mailto:support@teachme.com"
                                className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                            >
                                support@teachme.com
                            </a>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <svg
                            className="w-6 h-6 text-[#FFC569] mr-3 mt-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div>
                            <p className="text-gray-700 font-medium">Chat trực tuyến</p>
                            <a
                                href="https://m.me/teachme"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                            >
                                Chat với chúng tôi qua Messenger
                            </a>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <svg
                            className="w-6 h-6 text-[#FFC569] mr-3 mt-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                        </svg>
                        <div>
                            <p className="text-gray-700 font-medium">Số điện thoại</p>
                            <a
                                href="tel:+84987654321"
                                className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                            >
                                (+84) 987 654 321
                            </a>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <svg
                            className="w-6 h-6 text-[#FFC569] mr-3 mt-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828-2.828L6.343 13.657a4 4 0 000 5.656l4 4a4 4 0 005.656 0l4-4a4 4 0 000-5.656zM12 3v6"
                            />
                        </svg>
                        <div>
                            <p className="text-gray-700 font-medium">Địa chỉ</p>
                            <p className="text-[#1B223B]">12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM</p>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-[#1B223B] mb-4">Theo dõi chúng tôi</h3>
                    <div className="flex gap-4">
                        <a
                            href="https://facebook.com/teachme"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                        </a>
                        <a
                            href="https://instagram.com/teachme"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HomeLanding = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [showModal, setShowModal] = useState(false);
    const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
    const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

    // Xử lý scroll và cập nhật active section
    useEffect(() => {
        const handleScroll = () => {
            Object.entries(sectionsRef.current).forEach(([section, element]) => {
                if (element) {
                    const { top } = element.getBoundingClientRect();
                    // Kiểm tra visibility cho animation
                    if (top <= window.innerHeight * 0.75) {
                        setIsVisible((prev) => ({ ...prev, [section]: true }));
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll đến section
    const scrollToSection = (sectionId: string) => {
        const element = sectionsRef.current[sectionId];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Xử lý đăng bài
    const handlePostClick = () => {
        if (!user) {
            setShowModal(true);
        } else {
            navigate('/post', { state: { showCreatePostModal: true } });
        }
    };

    return (
        <>
            <Helmet>
                <title>TeachMe - Nền tảng kết nối gia sư và học sinh hàng đầu Việt Nam</title>
                <meta
                    name="description"
                    content="TeachMe giúp bạn tìm kiếm gia sư phù hợp hoặc đăng ký làm gia sư. Kết nối dễ dàng, học tập hiệu quả với các gia sư chất lượng cao."
                />
                <meta property="og:title" content="TeachMe - Nền tảng kết nối gia sư và học sinh" />
                <meta
                    property="og:description"
                    content="Tìm kiếm gia sư phù hợp hoặc đăng ký làm gia sư trên TeachMe."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={window.location.href} />
            </Helmet>

            <HeaderLanding />

            {/* Hero Section */}
            <section
                id="hero"
                ref={(el) => (sectionsRef.current['hero'] = el)}
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B223B] to-[#2A3349] px-6 py-20 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div
                        className={`text-white space-y-6 transform transition-all duration-1000 ${
                            isVisible['hero'] ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'
                        }`}
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            Kết nối tri thức, <span className="text-[#FFC569]">nâng tầm tương lai</span>
                        </h1>
                        <p className="text-xl text-gray-300">
                            Đồng hành cùng bạn trên hành trình học tập với những gia sư chất lượng nhất.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                title="Đăng bài tìm gia sư"
                                backgroundColor="#FFC569"
                                hoverBackgroundColor="#FFB347"
                                foreColor="#1B223B"
                                className="px-8 py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                                onClick={handlePostClick}
                            />
                            <Button
                                title="Tìm gia sư ngay"
                                backgroundColor="transparent"
                                hoverBackgroundColor="#FFC569"
                                foreColor="#FFC569"
                                className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-[#FFC569] transform hover:scale-105 transition-all duration-300"
                                onClick={() => scrollToSection('tutors')}
                            />
                        </div>
                    </div>
                    <div
                        className={`relative transform transition-all duration-1000 ${
                            isVisible['hero'] ? 'translate-x-0 opacity-100' : 'translate-x-[100px] opacity-0'
                        }`}
                    >
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FFC569] rounded-full opacity-30 animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#E0AA4D] rounded-lg opacity-30 rotate-12 animate-pulse"></div>
                        <img
                            src={HeroImage}
                            alt="TeachMe Hero"
                            className="w-full max-w-md mx-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <button
                        onClick={() => scrollToSection('subjects')}
                        className="text-white hover:text-[#FFC569] transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </button>
                </div>
            </section>

            {/* Subjects Section */}
            <section
                id="subjects"
                ref={(el) => (sectionsRef.current['subjects'] = el)}
                className="py-20 px-6 bg-white relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div
                        className={`text-center mb-16 transform transition-all duration-1000 ${
                            isVisible['subjects'] ? 'translate-y-0 opacity-100' : 'translate-y-[-50px] opacity-0'
                        }`}
                    >
                        <h2 className="text-4xl font-bold text-[#1B223B] mb-4">Môn học đa dạng</h2>
                        <p className="text-xl text-gray-600">Khám phá các môn học phổ biến trên TeachMe</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { name: 'Toán học', icon: '📐', count: '1222 gia sư' },
                            { name: 'Tiếng Anh', icon: '🌍', count: '1222 gia sư' },
                            { name: 'Hóa học', icon: '🧪', count: '1222 gia sư' },
                            { name: 'Ngữ văn', icon: '📚', count: '1222 gia sư' },
                        ].map((subject, index) => (
                            <div
                                key={index}
                                className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center group transform ${
                                    isVisible['subjects'] ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {subject.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-[#1B223B] mb-2">{subject.name}</h3>
                                <p className="text-gray-600">{subject.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tutors Section */}
            <TutorSection />

            {/* Process Section */}
            <section
                id="process"
                ref={(el) => (sectionsRef.current['process'] = el)}
                className="py-20 px-6 bg-white relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div
                        className={`text-center mb-16 transform transition-all duration-1000 ${
                            isVisible['process'] ? 'translate-y-0 opacity-100' : 'translate-y-[-50px] opacity-0'
                        }`}
                    >
                        <h2 className="text-4xl font-bold text-[#1B223B] mb-4">Quy trình đơn giản</h2>
                        <p className="text-xl text-gray-600">Bắt đầu hành trình học tập chỉ với 4 bước</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Tìm kiếm',
                                description: 'Tìm gia sư theo tiêu chí bạn mong muốn',
                            },
                            {
                                step: '02',
                                title: 'Thương lượng',
                                description: 'Thương lượng lịch học và học phí linh hoạt',
                            },
                            {
                                step: '03',
                                title: 'Học tập',
                                description: 'Giải quyết khó khăn trong môn học với gia sư',
                            },
                            {
                                step: '04',
                                title: 'Tiến bộ',
                                description: 'Tận hưởng hành trình học tập hiệu quả!',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                                    isVisible['process'] ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl font-bold text-[#FFC569] mb-4">{item.step}</div>
                                <h3 className="text-xl font-semibold text-[#1B223B] mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section
                id="reviews"
                ref={(el) => (sectionsRef.current['reviews'] = el)}
                className="py-20 px-6 bg-gray-50 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div
                        className={`text-center mb-16 transform transition-all duration-1000 ${
                            isVisible['reviews'] ? 'translate-y-0 opacity-100' : 'translate-y-[-50px] opacity-0'
                        }`}
                    >
                        <h2 className="text-4xl font-bold text-[#1B223B] mb-4">Phản hồi từ học viên</h2>
                        <p className="text-xl text-gray-600">
                            Nghe những câu chuyện thành công từ học viên của chúng tôi
                        </p>
                    </div>
                    <div
                        className={`transform transition-all duration-1000 ${
                            isVisible['reviews'] ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0'
                        }`}
                    >
                        <ReviewSection />
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section
                id="contact"
                ref={(el) => (sectionsRef.current['contact'] = el)}
                className="py-20 px-6 bg-white relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div
                        className={`text-center mb-16 transform transition-all duration-1000 ${
                            isVisible['contact'] ? 'translate-y-0 opacity-100' : 'translate-y-[-50px] opacity-0'
                        }`}
                    >
                        <h2 className="text-4xl font-bold text-[#1B223B] mb-4">Liên hệ với chúng tôi</h2>
                        <p className="text-xl text-gray-600">
                            Hãy để lại tin nhắn, chúng tôi sẽ phản hồi sớm nhất có thể
                        </p>
                    </div>
                    <div
                        className={`transform transition-all duration-1000 ${
                            isVisible['contact'] ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0'
                        }`}
                    >
                        <ContactSection />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                id="cta"
                ref={(el) => (sectionsRef.current['cta'] = el)}
                className="py-20 px-6 bg-gradient-to-br from-[#1B223B] to-[#2A3349] text-white relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div
                        className={`transform transition-all duration-1000 ${
                            isVisible['cta'] ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0'
                        }`}
                    >
                        <h2 className="text-4xl font-bold mb-6">Sẵn sàng bắt đầu hành trình học tập?</h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Hàng ngàn học viên đã tin tưởng và thành công cùng TeachMe
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                title="Đăng bài tìm gia sư"
                                backgroundColor="#FFC569"
                                hoverBackgroundColor="#FFB347"
                                foreColor="#1B223B"
                                className="px-8 py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                                onClick={handlePostClick}
                            />
                            <Button
                                title="Tìm gia sư ngay"
                                backgroundColor="transparent"
                                hoverBackgroundColor="#FFC569"
                                foreColor="#FFC569"
                                className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-[#FFC569] transform hover:scale-105 transition-all duration-300"
                                onClick={() => scrollToSection('tutors')}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Login Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fade-in relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-5"></div>

                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Logo */}
                            <div className="flex justify-center mb-6">
                                <img src={Logo} alt="TeachMe Logo" className="h-12 w-auto" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-[#1B223B] text-center mb-2">
                                Đăng nhập để trải nghiệm TeachMe!
                            </h2>
                            <p className="text-gray-600 text-center mb-8">
                                Tạo tài khoản để kết nối với gia sư chất lượng và bắt đầu hành trình học tập của bạn
                            </p>

                            {/* Buttons */}
                            <div className="space-y-4">
                                <Button
                                    title="Đăng nhập ngay"
                                    backgroundColor="#FFC569"
                                    hoverBackgroundColor="#FFB347"
                                    foreColor="#1B223B"
                                    className="w-full py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                    onClick={() => navigate('/sign-in')}
                                />
                                <Button
                                    title="Đăng ký tài khoản mới"
                                    backgroundColor="transparent"
                                    hoverBackgroundColor="#FFC569"
                                    foreColor="#1B223B"
                                    className="w-full py-3 rounded-full text-lg font-semibold border-2 border-[#FFC569] hover:bg-[#FFC569] transition-all duration-300"
                                    onClick={() => navigate('/register')}
                                />
                            </div>

                            {/* Features */}
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="w-5 h-5 text-[#FFC569] mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Kết nối với gia sư chất lượng</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="w-5 h-5 text-[#FFC569] mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Quản lý lịch học linh hoạt</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="w-5 h-5 text-[#FFC569] mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Đánh giá và phản hồi chi tiết</span>
                                </div>
                            </div>

                            {/* Skip Button */}
                            <button
                                className="mt-6 text-sm text-gray-500 hover:text-[#FFC569] transition-colors mx-auto block"
                                onClick={() => setShowModal(false)}
                            >
                                Để sau
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default HomeLanding;
