import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { FilterIcon, ResetIcon } from '../components/icons';
import TutorDetailCard from '../components/TutorDetailCard';
import TutorSkeleton from '../components/TutorSkeleton';
import { TutorProfileComponentProps } from '../components/TutorProfileComponent';

// Use TutorProfileComponentProps for consistency
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
                violations: 0,
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
    const subjects = ['Toán học', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Lịch sử'];

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
    // Lọc danh sách tutors trước khi hiển thị
    const applyFilter = () => {
        setShowPopup(false);
    };
    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    if (error) {
        return (
            <div className="text-red-500 text-center mt-10">
                {error}
                <button onClick={fetchTutors} className="ml-4 text-blue-500 underline">
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen bg-gray-100">
            <Navbar isExpanded={isExpanded} toggleNavbar={() => setIsExpanded((prev) => !prev)} />
            <TopNavbar />
            <div className={`flex-1 flex flex-col ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                {/* Thanh tìm kiếm */}
                <div
                    className={`fixed top-14 flex space-x-4 pb-4 z-20 ${
                        isExpanded ? 'left-60 right-5' : 'left-20 right-5'
                    }`}
                >
                    <input
                        type="text"
                        placeholder="Nhập nội dung cần tìm kiếm"
                        className="p-3 rounded-md border border-gray-300 flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div
                        className="px-3 py-2  text-gray-500 mt-1 hover:text-blue-500 transition cursor-pointer"
                        onClick={resetFilters}
                    >
                        <ResetIcon />
                    </div>
                    <FilterIcon
                        className="h-9 w-9 text-gray-500 mt-1 cursor-pointer hover:text-blue-500"
                        onClick={togglePopupFilter}
                    />
                </div>
                {/* Popup filter */}
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <div className="flex justify-between items-center border-b pb-3">
                                <h2 className="text-lg font-semibold">Bộ lọc</h2>
                                {/* <XIcon
                                    className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-800"
                                    onClick={togglePopupFilter}
                                /> */}
                            </div>

                            <div className="mt-4">
                                <label>Giá tiền (VNĐ)</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Từ"
                                        className="w-1/2 p-2 border rounded-md"
                                        onChange={(e) => setFilters({ ...filters, priceFrom: Number(e.target.value) })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Đến"
                                        className="w-1/2 p-2 border rounded-md"
                                        onChange={(e) => setFilters({ ...filters, priceTo: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label>Môn học</label>
                                <select
                                    className="w-full p-2 border rounded-md"
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

                            <div className="mt-4">
                                <label>Đánh giá</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    onChange={(e) => setFilters({ ...filters, selectedRating: Number(e.target.value) })}
                                >
                                    <option value="">Chọn mức đánh giá</option>
                                    <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                                    <option value="4">⭐⭐⭐⭐ (4 sao trở lên)</option>
                                    <option value="3">⭐⭐⭐ (3 sao trở lên)</option>
                                    <option value="2">⭐ (dưới 2 sao)</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <label>Số lớp</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Lớn hơn"
                                        className="w-1/2 p-2 border rounded-md"
                                        onChange={(e) => setFilters({ ...filters, countFrom: Number(e.target.value) })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Nhỏ hơn"
                                        className="w-1/2 p-2 border rounded-md"
                                        onChange={(e) => setFilters({ ...filters, countTo: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600"
                                    onChange={(e) => setFilters({ ...filters, isFavorited: e.target.checked })}
                                />
                                <label className="ml-2">Chỉ hiển thị gia sư yêu thích</label>
                            </div>

                            <div className="mt-6 flex justify-between">
                                <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={togglePopupFilter}>
                                    Hủy
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={applyFilter}>
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hiển thị danh sách tutor */}
                <div className="mt-40 max-h-[calc(100vh-200px)] overflow-y-auto p-6">
                    {loading ? (
                        <TutorSkeleton />
                    ) : filteredTutors.length > 0 ? (
                        filteredTutors.map((tutor) => <TutorDetailCard key={tutor.id} {...tutor} />)
                    ) : (
                        <div className="text-center text-gray-500">Không có tutor nào được tìm thấy.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tutor;
