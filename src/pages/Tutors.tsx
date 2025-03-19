import { useEffect, useState } from 'react';
import axios from 'axios';
import TutorCard from '../components/TutorCard';
import { Button } from '../components/Button';
import TutorSkeleton from '../components/TutorSkeleton'; // Giả sử bạn đã có TutorSkeleton
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Tutor {
    id: number;
    name: string;
    experience: number;
    rating: number;
    avatar: string;
}

const TutorLanding: React.FC = () => {
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
                experience: tutor.tutorProfile?.experiences ?? 0,
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

    if (error) {
        return (
            <section className="py-20 px-6 bg-gray-50 min-h-[50vh] flex items-center justify-center">
                <div className="text-center text-red-500 bg-white p-6 rounded-xl shadow-md">
                    <p className="text-lg font-semibold">{error}</p>
                    <button
                        onClick={fetchTutors}
                        className="mt-4 inline-block text-[#FFC569] hover:text-[#FFB347] underline font-medium transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 mt-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Tiêu đề */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1B223B] tracking-tight" id="tutors">
                        Đội ngũ gia sư xuất sắc
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                        Kết nối với những gia sư hàng đầu để nâng cao kiến thức và chinh phục mục tiêu học tập.
                    </p>
                </div>

                {/* Danh sách gia sư */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[...Array(6)].map((_, index) => (
                            <TutorSkeleton key={index} />
                        ))}
                    </div>
                ) : tutors.length === 0 ? (
                    <div className="text-center text-gray-600 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
                        Không có gia sư nào để hiển thị.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {tutors.map((tutor) => (
                            <TutorCard
                                key={tutor.id}
                                name={tutor.name}
                                experience={`${tutor.experience} năm`}
                                rating={tutor.rating}
                                image={tutor.avatar}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 overflow-hidden"
                            />
                        ))}
                    </div>
                )}

                {/* Nút CTA */}
                <div className="text-center mt-16">
                    <Button
                        title="Khám phá thêm gia sư"
                        backgroundColor="#1B223B"
                        hoverBackgroundColor="#2A3349"
                        foreColor="white"
                        className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    />
                </div>
            </div>
        </section>
    );
};

const Tutors = () => {
    return (
        <>
            <Header />
            <TutorLanding />
            <Footer />
        </>
    );
};

export default Tutors;
