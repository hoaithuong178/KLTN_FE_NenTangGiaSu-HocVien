import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { FilterIcon, ResetIcon } from '../components/icons';
import TutorDetailCard from '../components/TutorDetailCard';
import TutorSkeleton from '../components/TutorSkeleton';
import { TutorProfileComponentProps } from '../components/TutorProfileComponent';

const Tutor: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true;
    });

    const [tutors, setTutors] = useState<TutorProfileComponentProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTutors = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
            if (!API_URL) throw new Error('API_BASE_URL not set in .env');

            const response = await axios.get(`${API_URL}/tutors/search?page=1&limit=10`);
            const tutorsData = response.data?.data;

            if (!Array.isArray(tutorsData)) throw new Error('Invalid tutor list from API');

            const mappedTutors: TutorProfileComponentProps[] = tutorsData.map((tutor) => ({
                id: tutor.id ? parseInt(tutor.id) : 0,
                avatar: tutor.userProfile?.avatar || 'https://via.placeholder.com/150',
                name: tutor.name || 'Unknown',
                pricePerSession: tutor.tutorProfile?.hourlyPrice ?? 0,
                email: tutor.email || '',
                phone: tutor.phone || '',
                isFavorite: false,
                learningTypes: tutor.tutorProfile?.learningTypes || 'Unknown',
                subjects: tutor.tutorProfile?.specializations ?? [],
                gender: tutor.userProfile?.gender || 'UNKNOWN',
                educationLevel: tutor.tutorProfile?.level || 'Unknown',
                experience: tutor.tutorProfile?.experiences ?? 0,
                birthYear: tutor.userProfile?.dob ? new Date(tutor.userProfile.dob).getFullYear() : 2000,
                totalClasses: tutor.tutorProfile?.taughtStudentsCount ?? 0,
                location: tutor.tutorProfile?.tutorLocations?.[0] ?? 'Unknown',
                schedule: tutor.schedule || {},
                rating: tutor.tutorProfile?.rating ?? 0,
                reviews: tutor.reviews || [],
                description: tutor.tutorProfile?.description || 'Không có mô tả',
            }));

            setTimeout(() => {
                setTutors(mappedTutors);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setTimeout(() => {
                setError(err instanceof Error ? err.message : 'Không thể tải danh sách tutor');
                setLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        fetchTutors();
    }, []);

    const [showPopup, setShowPopup] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState<{
        priceFrom: number | null;
        priceTo: number | null;
        selectedSubject: string;
        selectedRating: number | null;
        countFrom: number | null;
        countTo: number | null;
        isFavorited: boolean;
    }>({
        priceFrom: null,
        priceTo: null,
        selectedSubject: '',
        selectedRating: null,
        countFrom: null,
        countTo: null,
        isFavorited: false,
    });
    const [subjects, setSubjects] = useState<string[]>([]);

    useEffect(() => {
        if (showPopup) {
            axios
                .get(`${import.meta.env.VITE_APP_API_BASE_URL}/subjects`)
                .then((response) => {
                    if (response.data?.statusCode === 200) {
                        setSubjects(response.data.data.map((item: { name: string }) => item.name));
                    }
                })
                .catch((error) => console.error('Lỗi khi lấy danh sách môn học:', error));
        }
    }, [showPopup]);

    const filteredTutors = tutors.filter((tutor) => {
        return (
            (!searchText || tutor.name.toLowerCase().includes(searchText.toLowerCase())) &&
            (!filters.priceFrom || tutor.pricePerSession >= filters.priceFrom) &&
            (!filters.priceTo || tutor.pricePerSession <= filters.priceTo) &&
            (!filters.selectedSubject || tutor.subjects.includes(filters.selectedSubject)) &&
            (!filters.selectedRating || tutor.rating >= filters.selectedRating) &&
            (!filters.countFrom || tutor.totalClasses >= filters.countFrom) &&
            (!filters.countTo || tutor.totalClasses <= filters.countTo) &&
            (!filters.isFavorited || tutor.isFavorite)
        );
    });

    const resetFilters = () => {
        setSearchText('');
        setFilters({
            priceFrom: null,
            priceTo: null,
            selectedSubject: '',
            selectedRating: null,
            countFrom: null,
            countTo: null,
            isFavorited: false,
        });
    };
    const togglePopupFilter = () => setShowPopup((prev) => !prev);
    const applyFilter = () => setShowPopup(false);

    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p className="text-red-500 text-lg font-semibold">{error}</p>
                    <button
                        onClick={fetchTutors}
                        className="mt-4 text-[#1B73E8] hover:text-[#FFC569] underline font-medium transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Navbar */}
            <Navbar isExpanded={isExpanded} toggleNavbar={() => setIsExpanded((prev) => !prev)} />
            <div className="absolute top-0 z-30">
                <TopNavbar />
            </div>
            {/* Nội dung chính */}
            <div className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                {/* Thanh tìm kiếm và bộ lọc */}
                <div className="sticky top-[60px] z-20 bg-white shadow-md px-6 py-4 flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm gia sư..."
                        className="flex-1 p-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1B73E8] focus:outline-none transition-all text-gray-700"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="p-2 text-gray-500 hover:text-[#1B73E8] transition-colors"
                        onClick={resetFilters}
                        aria-label="Reset bộ lọc"
                    >
                        <ResetIcon className="w-6 h-6" />
                    </button>
                    <button
                        className="p-2 text-gray-500 hover:text-[#1B73E8] transition-colors"
                        onClick={togglePopupFilter}
                        aria-label="Mở bộ lọc"
                    >
                        <FilterIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Popup bộ lọc */}
                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-semibold text-[#1B73E8] mb-4">Bộ lọc gia sư</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Giá tiền (VNĐ)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Từ"
                                            className="w-1/2 p-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1B73E8] focus:outline-none"
                                            onChange={(e) =>
                                                setFilters({ ...filters, priceFrom: Number(e.target.value) })
                                            }
                                        />
                                        <input
                                            type="number"
                                            placeholder="Đến"
                                            className="w-1/2 p-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1B73E8] focus:outline-none"
                                            onChange={(e) =>
                                                setFilters({ ...filters, priceTo: Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Môn học</label>
                                    <select
                                        className="w-full p-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1B73E8] focus:outline-none"
                                        onChange={(e) => setFilters({ ...filters, selectedSubject: e.target.value })}
                                    >
                                        <option value="">Chọn môn học</option>
                                        {subjects.map((subject) => (
                                            <option key={subject} value={subject}>
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Đánh giá</label>
                                    <select
                                        className="w-full p-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1B73E8] focus:outline-none"
                                        onChange={(e) =>
                                            setFilters({ ...filters, selectedRating: Number(e.target.value) })
                                        }
                                    >
                                        <option value="">Chọn mức đánh giá</option>
                                        <option value="5">⭐ 5 sao</option>
                                        <option value="4">⭐ 4 sao trở lên</option>
                                        <option value="3">⭐ 3 sao trở lên</option>
                                        <option value="2">⭐ Dưới 2 sao</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Số lớp</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Từ"
                                            className="w-1/2 p-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1B73E8] focus:outline-none"
                                            onChange={(e) =>
                                                setFilters({ ...filters, countFrom: Number(e.target.value) })
                                            }
                                        />
                                        <input
                                            type="number"
                                            placeholder="Đến"
                                            className="w-1/2 p-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1B73E8] focus:outline-none"
                                            onChange={(e) =>
                                                setFilters({ ...filters, countTo: Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-[#1B73E8] focus:ring-[#1B73E8] rounded"
                                        onChange={(e) => setFilters({ ...filters, isFavorited: e.target.checked })}
                                    />
                                    <label className="text-gray-700">Chỉ hiển thị gia sư yêu thích</label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    onClick={togglePopupFilter}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="px-4 py-2 bg-[#1B73E8] text-white rounded-lg hover:bg-[#1557B0] transition-colors"
                                    onClick={applyFilter}
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Danh sách gia sư */}
                <div
                    className="flex-1 overflow-y-auto p-6 mt-12 h-[calc(100vh-140px)]"
                    style={{
                        maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 1) 40px)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 1) 40px)',
                    }}
                >
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, index) => (
                                <TutorSkeleton key={index} />
                            ))}
                        </div>
                    ) : filteredTutors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredTutors.map((tutor) => (
                                <TutorDetailCard
                                    key={tutor.id}
                                    {...tutor}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                            Không tìm thấy gia sư nào phù hợp.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tutor;
