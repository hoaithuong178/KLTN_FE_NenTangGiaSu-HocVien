import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import HeroImage from '../assets/HeroSection.svg';
import tutorImage from '../assets/Kein.jpg';
import { Button } from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ReviewCard from '../components/ReviewCard';
import TutorCard from '../components/TutorCard';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const LandingSection = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        if (!user) setShowModal(true);
        else navigate('/post');
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
            <div className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen bg-gradient-to-br from-[#1B223B] to-[#2A3349] px-6 lg:px-16 py-20">
                {/* Left Side - Text & Form */}
                <div className="flex flex-col max-w-lg text-white z-10">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-[#FFC569] leading-tight">
                        TeachMe - Kết nối tri thức, nâng tầm tương lai
                    </h1>
                    <p className="text-lg leading-relaxed mb-8 opacity-90">
                        Đồng hành cùng bạn trên hành trình học tập với những gia sư chất lượng nhất.
                    </p>

                    {/* Tutor Request Form */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white border-opacity-20">
                        <h2 className="text-xl font-semibold mb-4">Đăng bài tìm gia sư ngay!</h2>
                        <form className="flex flex-col space-y-4">
                            <input
                                type="text"
                                placeholder="Tiêu đề bài đăng"
                                className="p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:ring-2 focus:ring-[#FFC569] focus:outline-none transition-all"
                            />
                            <div className="flex space-x-4">
                                <input
                                    type="number"
                                    placeholder="Giá mỗi buổi (VNĐ)"
                                    className="p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:ring-2 focus:ring-[#FFC569] focus:outline-none w-1/2 transition-all"
                                />
                                <input
                                    type="number"
                                    placeholder="Số buổi"
                                    className="p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:ring-2 focus:ring-[#FFC569] focus:outline-none w-1/2 transition-all"
                                />
                            </div>
                            <select className="p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:ring-2 focus:ring-[#FFC569] focus:outline-none transition-all">
                                <option value="online" className="text-black">
                                    Học Online
                                </option>
                                <option value="offline" className="text-black">
                                    Học Trực Tiếp
                                </option>
                            </select>
                            <textarea
                                placeholder="Mô tả yêu cầu của bạn"
                                className="p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:ring-2 focus:ring-[#FFC569] focus:outline-none h-24 transition-all"
                            />
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className="bg-[#FFC569] text-[#1B223B] font-semibold rounded-full px-6 py-3 shadow-md hover:bg-[#FFB347] transition-all duration-300"
                                    onClick={handleClick}
                                >
                                    Đăng bài ngay
                                </button>
                                <button
                                    className="border-2 border-[#FFC569] text-[#FFC569] font-semibold rounded-full px-6 py-3 hover:bg-[#FFC569] hover:text-[#1B223B] transition-all duration-300"
                                    onClick={() => navigate('/tutors-landing')}
                                >
                                    Tìm gia sư
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="relative w-full lg:w-1/2 mt-10 lg:mt-0 z-0">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FFC569] rounded-full opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#E0AA4D] rounded-lg opacity-30 rotate-12 animate-pulse"></div>
                    <img
                        src={HeroImage}
                        alt="TeachMe Banner"
                        className="w-full max-w-md mx-auto rounded-lg shadow-2xl z-10 relative transform hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                        <div className="bg-white p-8 rounded-xl shadow-2xl text-center w-[90%] max-w-md animate-fade-in">
                            <h2 className="text-2xl font-bold text-[#1B223B] mb-4">
                                Đăng nhập để trải nghiệm TeachMe!
                            </h2>
                            <button
                                className="bg-[#FFC569] text-[#1B223B] font-semibold rounded-full px-8 py-3 shadow-md hover:bg-[#FFB347] transition-all duration-300"
                                onClick={() => navigate('/sign-in')}
                            >
                                Đăng nhập ngay
                            </button>
                            <button
                                className="mt-4 text-sm text-gray-600 hover:text-[#FFC569] transition-colors"
                                onClick={() => setShowModal(false)}
                            >
                                Để sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

interface Tutor {
    id: number;
    name: string;
    experience: number; // Số năm kinh nghiệm
    rating: number;
    avatar: string;
}
const TutorSection = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchTutors = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
            if (!API_URL) throw new Error('API_BASE_URL not set in .env');

            const response = await axios.get(`${API_URL}/tutors/search?page=1&limit=6`);
            const tutorsData = response.data?.data;

            if (!Array.isArray(tutorsData)) throw new Error('Invalid tutor list from API');

            const mappedTutors: Tutor[] = tutorsData.map((tutor) => ({
                id: tutor.id ? parseInt(tutor.id) : 0,
                name: tutor.name || 'Unknown',
                experience: tutor.tutorProfile?.experiences ?? 0, // Số năm kinh nghiệm
                rating: tutor.tutorProfile?.rating ?? 0,
                avatar: tutor.userProfile?.avatar || 'https://via.placeholder.com/150',
            }));

            setTimeout(() => {
                setTutors(mappedTutors);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setTimeout(() => {
                setError(err instanceof Error ? err.message : 'Không thể tải danh sách gia sư');
                setLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        fetchTutors();
    }, []);
    return (
        <section className="bg-gray-100 py-20 px-6">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#1B223B]" id="tutors">
                    Đội ngũ gia sư xuất sắc
                </h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                    Kết nối với những gia sư hàng đầu để nâng cao kiến thức.
                </p>
            </div>

            {/* Hiển thị trạng thái */}
            {loading ? (
                <div className="text-center text-gray-600">Đang tải danh sách gia sư...</div>
            ) : error ? (
                <div className="text-center text-red-500">
                    {error}
                    <button
                        onClick={fetchTutors}
                        className="ml-4 text-[#FFC569] hover:text-[#FFB347] underline transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            ) : tutors.length === 0 ? (
                <div className="text-center text-gray-600">Không có gia sư nào để hiển thị.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tutors.map((tutor) => (
                        <TutorCard
                            key={tutor.id}
                            name={tutor.name}
                            experience={`${tutor.experience} năm`}
                            rating={tutor.rating}
                            image={tutor.avatar}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                        />
                    ))}
                </div>
            )}

            <div className="text-center mt-12">
                <Button
                    title="Khám phá thêm"
                    backgroundColor="#1B223B"
                    hoverBackgroundColor="#2A3349"
                    foreColor="white"
                    className="px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                />
            </div>
        </section>
    );
};

const SubjectSection = () => {
    return (
        <section className="py-20 px-6 bg-white">
            <h2 className="text-4xl font-bold text-[#1B223B] text-center mb-12" id="subjects">
                Môn học đa dạng
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { name: 'Gia sư Toán', count: '1222 gia sư' },
                    { name: 'Gia sư Tiếng Anh', count: '1222 gia sư' },
                    { name: 'Gia sư Hóa học', count: '1222 gia sư' },
                    { name: 'Gia sư Ngữ văn', count: '1222 gia sư' },
                ].map((subject, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                    >
                        <h3 className="text-xl font-semibold text-[#1B223B] mb-2">{subject.name}</h3>
                        <p className="text-gray-600">{subject.count}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const ProgressSection = () => {
    return (
        <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-12">
                {[
                    {
                        text: 'Tìm kiếm gia sư theo tiêu chí bạn mong muốn',
                        bg: 'bg-gradient-to-r from-[#FFC569] to-[#FFB347]',
                        reverse: false,
                    },
                    { text: 'Thương lượng lịch học và học phí linh hoạt', bg: 'bg-white', reverse: true },
                    {
                        text: 'Giải quyết khó khăn trong môn học với gia sư',
                        bg: 'bg-gradient-to-r from-[#FFC569] to-[#FFB347]',
                        reverse: false,
                    },
                    { text: 'Tận hưởng hành trình học tập hiệu quả!', bg: 'bg-white', reverse: true },
                ].map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-6 rounded-xl shadow-lg ${step.bg} ${
                            step.reverse ? 'flex-row-reverse' : ''
                        } hover:shadow-xl transition-all duration-300`}
                    >
                        <p
                            className={`text-xl ${
                                step.bg.includes('bg-white') ? 'text-[#1B223B]' : 'text-white'
                            } font-medium max-w-md text-center`}
                        >
                            {step.text}
                        </p>
                        <img
                            src={tutorImage}
                            alt={`Step ${index + 1}`}
                            className="w-40 h-52 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

const StartSection = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        if (!user) setShowModal(true);
        else navigate('/post');
    };

    return (
        <section className="bg-gradient-to-br from-[#1B223B] to-[#2A3349] text-white text-center py-24 px-6">
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Hàng ngàn học viên tin tưởng TeachMe mỗi tháng!</h1>
            <button
                className="bg-[#FFC569] text-[#1B223B] px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-[#FFB347] transition-all duration-300"
                onClick={handleClick}
            >
                Bắt đầu ngay hôm nay
            </button>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl text-center w-[90%] max-w-md animate-fade-in">
                        <h2 className="text-2xl font-bold text-[#1B223B] mb-4">Đăng nhập để bắt đầu học!</h2>
                        <button
                            className="bg-[#FFC569] text-[#1B223B] font-semibold rounded-full px-8 py-3 shadow-md hover:bg-[#FFB347] transition-all duration-300"
                            onClick={() => navigate('/sign-in')}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className="mt-4 text-sm text-gray-600 hover:text-[#FFC569] transition-colors"
                            onClick={() => setShowModal(false)}
                        >
                            Để sau
                        </button>
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
            name: 'Nguyễn Thị Hương',
            title: 'Dễ hiểu, thân thiện',
            rating: 5,
            image: tutorImage,
            tags: ['Hoá học', 'Đại học'],
            content: 'Buổi học thú vị, gia sư giảng dạy dễ hiểu.',
        },
        {
            id: 2,
            name: 'Trần Minh Anh',
            title: 'Phương pháp đa dạng',
            rating: 4.8,
            image: tutorImage,
            tags: ['Toán học', 'Luyện thi'],
            content: 'Gia sư giàu kinh nghiệm, tiến bộ nhanh.',
        },
        {
            id: 3,
            name: 'Lê Thị Bích',
            title: 'Nhiệt tình hỗ trợ',
            rating: 4.5,
            image: tutorImage,
            tags: ['Tiếng Anh', 'Trung học'],
            content: 'Không khí học thoải mái, rất kiên nhẫn.',
        },
        {
            id: 4,
            name: 'Phạm Văn Cường',
            title: 'Chi tiết, vui vẻ',
            rating: 4.9,
            image: tutorImage,
            tags: ['Lịch sử', 'Cao đẳng'],
            content: 'Học tiến bộ, buổi học thú vị.',
        },
        {
            id: 5,
            name: 'Nguyễn Thị Hương',
            title: 'Tận tâm, chu đáo',
            rating: 4.7,
            image: tutorImage,
            tags: ['Vật lý', 'THPT'],
            content: 'Giải thích chi tiết, ôn luyện tốt.',
        },
        {
            id: 6,
            name: 'Trần Minh Anh',
            title: 'Nghiêm túc, logic',
            rating: 5,
            image: tutorImage,
            tags: ['Toán học', 'Luyện thi'],
            content: 'Kiên nhẫn, giải thích dễ hiểu.',
        },
    ];

    return (
        <section className="bg-gray-100 py-20 px-6">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#1B223B]" id="reviews">
                    Phản hồi từ học viên
                </h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                    Nghe những câu chuyện thành công từ học viên của chúng tôi.
                </p>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        name={review.name}
                        avatar={review.image}
                        rating={review.rating}
                        title={review.title}
                        content={review.content}
                        tags={review.tags}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                    />
                ))}
            </div>
        </section>
    );
};

const CommitSection = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        if (!user) setShowModal(true);
        else navigate('/post');
    };

    return (
        <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="grid md:grid-cols-2 items-center gap-8 bg-gradient-to-r from-[#FFC569] to-[#FFB347] p-6 rounded-xl shadow-lg">
                    <img
                        src={tutorImage}
                        alt="Commitment 1"
                        className="w-40 h-52 rounded-lg shadow-md mx-auto transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-white">Đảm bảo kiến thức vững chắc</h2>
                        <p className="text-white opacity-90 mt-2">100% hiểu bài, 100% hài lòng</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 items-center gap-8 bg-white p-6 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-[#1B223B]">Trở thành gia sư TeachMe</h2>
                        <p className="text-gray-600 mt-2">Đảm bảo học phí và quyền lợi tốt nhất.</p>
                        <div className="flex justify-center space-x-6 mt-4">
                            <a href="#" className="text-[#FFC569] hover:text-[#FFB347] font-medium transition-colors">
                                Chính sách
                            </a>
                            <a href="#" className="text-[#FFC569] hover:text-[#FFB347] font-medium transition-colors">
                                Quy tắc
                            </a>
                            <a href="#" className="text-[#FFC569] hover:text-[#FFB347] font-medium transition-colors">
                                Yêu cầu
                            </a>
                        </div>
                        <button
                            className="mt-6 bg-[#FFC569] text-[#1B223B] font-semibold py-3 px-8 rounded-full shadow-md hover:bg-[#FFB347] transition-all duration-300"
                            onClick={handleClick}
                        >
                            Đăng ký ngay
                        </button>
                    </div>
                    <img
                        src={tutorImage}
                        alt="Commitment 2"
                        className="w-40 h-52 rounded-lg shadow-md mx-auto transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="grid md:grid-cols-2 items-center gap-8 bg-gradient-to-r from-[#FFC569] to-[#FFB347] p-6 rounded-xl shadow-lg">
                    <img
                        src={tutorImage}
                        alt="Commitment 3"
                        className="w-40 h-52 rounded-lg shadow-md mx-auto transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-white">Tìm gia sư phù hợp</h2>
                        <p className="text-white opacity-90 mt-2">Lựa chọn gia sư theo mọi tiêu chí bạn cần.</p>
                        <button
                            className="mt-6 bg-[#1B223B] text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-[#2A3349] transition-all duration-300"
                            onClick={() => navigate('/tutors-landing')}
                        >
                            Tìm ngay
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl text-center w-[90%] max-w-md animate-fade-in">
                        <h2 className="text-2xl font-bold text-[#1B223B] mb-4">Đăng nhập để tham gia!</h2>
                        <button
                            className="bg-[#FFC569] text-[#1B223B] font-semibold rounded-full px-8 py-3 shadow-md hover:bg-[#FFB347] transition-all duration-300"
                            onClick={() => navigate('/sign-in')}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className="mt-4 text-sm text-gray-600 hover:text-[#FFC569] transition-colors"
                            onClick={() => setShowModal(false)}
                        >
                            Để sau
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

const Home = () => {
    return (
        <>
            <Header />
            <LandingSection />
            <SubjectSection />
            <TutorSection />
            <ProgressSection />
            <StartSection />
            <ReviewSection />
            <CommitSection />
            <Footer />
        </>
    );
};

export default Home;
