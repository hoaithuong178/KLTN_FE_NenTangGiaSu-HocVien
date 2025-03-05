import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { FilterIcon, XIcon } from '../components/icons';
import TutorDetailCard from '../components/TutorDetailCard';

const Tutor: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true;
    });

    const tutors = [
        {
            id: 1,
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            name: 'Võ Thị Minh Anh',
            pricePerSession: 160000,
            totalClasses: 12,
            bio: 'Giáo viên Toán với 5 năm kinh nghiệm, giúp học sinh đạt kết quả cao.',
            subjects: ['Toán học', 'Tiếng Anh', 'Tâm lý học'],
            rating: 4,
            reviews: 4,
        },
        {
            id: 2,
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            name: 'Nguyễn Văn Hùng',
            pricePerSession: 180000,
            totalClasses: 10,
            bio: 'Chuyên gia Tiếng Anh luyện thi IELTS và TOEIC.',
            subjects: ['Tiếng Anh', 'Ngữ văn', 'Lịch sử'],
            rating: 5,
            reviews: 10,
        },
        {
            id: 3,
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            name: 'Trần Thị Hạnh',
            pricePerSession: 150000,
            totalClasses: 8,
            bio: 'Giáo viên Vật lý chuyên luyện thi đại học.',
            subjects: ['Vật lý', 'Toán học', 'Hóa học'],
            rating: 4,
            reviews: 6,
        },
        {
            id: 4,
            avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
            name: 'Lê Thị Thanh Hà',
            pricePerSession: 170000,
            totalClasses: 6,
            bio: 'Giáo viên Hóa học chuyên luyện thi đại học.',
            subjects: ['Hóa học', 'Toán học', 'Vật lý'],
            rating: 4.5,
            reviews: 8,
        },
        {
            id: 5,
            avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
            name: 'Phan Quang Ninh',
            pricePerSession: 190000,
            totalClasses: 10,
            bio: 'Giáo viên Toán chuyên luyện thi đại học.',
            subjects: ['Toán học', 'Tiếng Anh', 'Vật lý'],
            rating: 4.7,
            reviews: 9,
        },
    ];

    const [showPopup, setShowPopup] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({
        priceFrom: null,
        priceTo: null,
        selectedSubject: '',
        selectedRating: null,
        classFrom: null,
        classTo: null,
        isFavorited: false,
    });

    const subjects = ['Toán học', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Lịch sử'];
    const [favoritePosts, setFavoritePosts] = useState<number[]>([]);

    const togglePopupFilter = () => setShowPopup((prev) => !prev);

    // Lọc danh sách tutors trước khi hiển thị
    const applyFilter = () => {
        setShowPopup(false);
    };

    const filteredTutors = tutors.filter((tutor) => {
        return (
            (!searchText || tutor.name.toLowerCase().includes(searchText.toLowerCase())) &&
            (!filters.priceFrom || tutor.pricePerSession >= filters.priceFrom) &&
            (!filters.priceTo || tutor.pricePerSession <= filters.priceTo) &&
            (!filters.selectedSubject || tutor.subjects.includes(filters.selectedSubject)) &&
            (!filters.selectedRating || tutor.rating >= filters.selectedRating) &&
            (!filters.classFrom || tutor.totalClasses >= filters.classFrom) &&
            (!filters.classTo || tutor.totalClasses <= filters.classTo) &&
            (!filters.isFavorited || favoritePosts.includes(tutor.id))
        );
    });

    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen bg-gray-100">
            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />

            <div className={`flex-1 flex flex-col ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                <div className="fixed top-12 flex space-x-4 pb-4 z-20 left-60 right-5 bg-gray-100 p-4">
                    <input
                        type="text"
                        placeholder="Nhập nội dung cần tìm kiếm"
                        className="p-3 rounded-md border border-gray-300 flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <FilterIcon
                        className="h-9 w-9 text-gray-500 mt-1 cursor-pointer hover:text-blue-500"
                        onClick={togglePopupFilter}
                    />
                </div>

                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <div className="flex justify-between items-center border-b pb-3">
                                <h2 className="text-lg font-semibold">Bộ lọc</h2>
                                <XIcon
                                    className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-800"
                                    onClick={togglePopupFilter}
                                />
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
                                        onChange={(e) => setFilters({ ...filters, classFrom: Number(e.target.value) })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Nhỏ hơn"
                                        className="w-1/2 p-2 border rounded-md"
                                        onChange={(e) => setFilters({ ...filters, classTo: Number(e.target.value) })}
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

                <div className="mt-40 max-h-[calc(100vh-200px)] overflow-y-auto p-6">
                    {filteredTutors.map((tutor) => (
                        <TutorDetailCard
                            key={tutor.id}
                            {...tutor}
                            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tutor;
