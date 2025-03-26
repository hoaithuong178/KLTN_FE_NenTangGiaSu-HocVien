import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { FilterIcon, ResetIcon } from '../components/icons';
import TutorDetailCard from '../components/TutorDetailCard';
import TutorSkeleton from '../components/TutorSkeleton';
import { TutorProfileComponentProps } from '../components/TutorProfileComponent';
import { Button } from '../components/Button';

const Tutor: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true;
    });

    const [tutors, setTutors] = useState<TutorProfileComponentProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<TutorProfileComponentProps | null>(null);
    const [requestForm, setRequestForm] = useState({
        title: '',
        content: '',
        subject: '',
        location: '',
        duration: 60,
        mode: 'online' as 'online' | 'offline',
        pricePerSession: 0,
    });
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [sessionCount, setSessionCount] = useState<number>(1);
    const [notification, setNotification] = useState<{
        message: string;
        show: boolean;
        type: 'success' | 'error';
    }>({
        message: '',
        show: false,
        type: 'success',
    });

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
                email: tutor.email || tutor.userProfile?.email || '',
                phone: tutor.phone || tutor.userProfile?.phone || '',
                isFavorite: false,
                learningTypes: tutor.tutorProfile?.learningTypes || 'Unknown',
                subjects: tutor.tutorProfile?.specializations ?? [],
                gender: tutor.userProfile?.gender || 'UNKNOWN',
                educationLevel: tutor.tutorProfile?.level || 'Unknown',
                experience: tutor.tutorProfile?.experiences ?? 0,
                birthYear: tutor.userProfile?.dob ? new Date(tutor.userProfile.dob).getFullYear() : 2000,
                totalClasses: tutor.tutorProfile?.taughtStudentsCount ?? 0,
                location: tutor.tutorProfile?.tutorLocations?.[0] ?? 'Unknown',
                tutorLocations: tutor.tutorProfile?.tutorLocations ?? [],
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
                .catch((error) => {
                    console.error('Lỗi khi lấy danh sách môn học:', error);
                });
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

    const handleRequestClick = (tutor: TutorProfileComponentProps) => {
        setSelectedTutor(tutor);
        setRequestForm({
            title: '',
            content: '',
            subject: tutor.subjects.length > 0 ? tutor.subjects[0] : '',
            location:
                Array.isArray(tutor.tutorLocations) && tutor.tutorLocations.length > 0
                    ? tutor.tutorLocations[0]
                    : tutor.location || '',
            duration: 60,
            mode: 'online',
            pricePerSession: tutor.pricePerSession,
        });
        setShowRequestModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRequestForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'duration' &&
                selectedTutor && {
                    pricePerSession: (parseInt(value) / 60) * selectedTutor.pricePerSession,
                }),
        }));
    };

    const toggleTimeSelection = (timeRange: string) => {
        setSelectedTimes((prev) => {
            if (prev.includes(timeRange)) {
                return prev.filter((t) => t !== timeRange);
            }
            if (prev.length >= sessionCount) {
                setNotification({
                    message: `Bạn chỉ có thể chọn tối đa ${sessionCount} khung giờ`,
                    show: true,
                    type: 'error',
                });
                setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
                return prev;
            }
            return [...prev, timeRange];
        });
    };

    const handleSubmit = async () => {
        if (!selectedTutor) return;

        try {
            const response = await fetch('/api/send-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...requestForm,
                    tutorId: selectedTutor.id,
                    selectedTimes,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Gửi yêu cầu thất bại');
            }
            setNotification({ message: 'Gửi yêu cầu thành công!', show: true, type: 'success' });
            setShowRequestModal(false);
        } catch (error) {
            setNotification({
                message: error instanceof Error ? error.message : 'Lỗi khi gửi yêu cầu',
                show: true,
                type: 'error',
            });
        }
    };

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
            <div className="absolute top-0">
                <TopNavbar />
            </div>
            {/* Nội dung chính */}
            <div className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                {/* Thanh tìm kiếm và bộ lọc */}
                <div className="sticky top-[60px] bg-white shadow-md px-6 py-4 flex items-center gap-4">
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative z-[10000]">
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
                                    onRequestClick={() => handleRequestClick(tutor)}
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

            {/* Modal Gửi yêu cầu dạy */}
            {showRequestModal && selectedTutor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto relative z-[10000]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#1B223B]">Gửi yêu cầu dạy</h2>
                            <button
                                onClick={() => setShowRequestModal(false)}
                                className="text-gray-500 hover:text-gray-700"
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
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-2 text-left">Tiêu đề</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={requestForm.title}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                    placeholder="Nhập tiêu đề yêu cầu"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-2 text-left">
                                    Yêu cầu đối với gia sư
                                </label>
                                <textarea
                                    name="content"
                                    value={requestForm.content}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                    rows={4}
                                    placeholder="Mô tả chi tiết yêu cầu của bạn"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2 text-left">Môn học</label>
                                    <select
                                        name="subject"
                                        value={requestForm.subject}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                    >
                                        {selectedTutor.subjects?.length > 0 ? (
                                            selectedTutor.subjects.map((subj) => (
                                                <option key={subj} value={subj}>
                                                    {subj}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">Không có môn học</option>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2 text-left">Địa điểm</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={requestForm.location}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                        placeholder="Nhập địa điểm học"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2 text-left">
                                        Số buổi/tuần
                                    </label>
                                    <input
                                        type="number"
                                        name="sessions"
                                        value={sessionCount}
                                        onChange={(e) => setSessionCount(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2 text-left">
                                        Thời lượng/Buổi (phút)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={requestForm.duration}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                        min="30"
                                        step="30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-2 text-left">
                                    Hình thức học
                                </label>
                                <div className="flex space-x-6">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="online"
                                            checked={requestForm.mode === 'online'}
                                            onChange={handleChange}
                                            className="text-[#1B223B] focus:ring-[#FFC569]"
                                        />
                                        <span className="text-gray-700">Online</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="offline"
                                            checked={requestForm.mode === 'offline'}
                                            onChange={handleChange}
                                            className="text-[#1B223B] focus:ring-[#FFC569]"
                                        />
                                        <span className="text-gray-700">Offline</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-2 text-left">
                                    Chọn ngày và giờ học
                                </label>
                                <div className="space-y-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {Object.keys(selectedTutor.schedule || {}).map((day) => (
                                            <Button
                                                key={day}
                                                title={day}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    selectedDay === day
                                                        ? 'bg-[#1B223B] text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                                onClick={() => setSelectedDay(day)}
                                            />
                                        ))}
                                    </div>

                                    {selectedDay && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-left">
                                                Chọn khung giờ:
                                            </h3>
                                            <div className="flex gap-2 flex-wrap">
                                                {Object.entries(selectedTutor.schedule[selectedDay] || {}).map(
                                                    ([period]) => {
                                                        const timeRange = `${period}`;
                                                        return (
                                                            <Button
                                                                key={timeRange}
                                                                title={timeRange}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                                    selectedTimes.includes(timeRange)
                                                                        ? 'bg-[#1B223B] text-white shadow-md'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                                onClick={() => toggleTimeSelection(timeRange)}
                                                                disabled={
                                                                    selectedTimes.length >= sessionCount &&
                                                                    !selectedTimes.includes(timeRange)
                                                                }
                                                            />
                                                        );
                                                    },
                                                )}
                                            </div>
                                            <div className="mt-3 text-right">
                                                <span className="text-sm text-gray-600">
                                                    Đã chọn {selectedTimes.length}/{sessionCount} khung giờ
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block font-semibold text-gray-700 mb-2 text-left">Giá/giờ:</label>
                                <input
                                    type="number"
                                    name="pricePerSession"
                                    value={requestForm.pricePerSession}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                                    placeholder={new Intl.NumberFormat('vi-VN').format(
                                        (requestForm.duration / 60) * selectedTutor.pricePerSession,
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    title="Hủy"
                                    backgroundColor="#D1D5DB"
                                    hoverBackgroundColor="#B3B8C2"
                                    foreColor="#1B223B"
                                    className="px-6 py-2.5 rounded-lg text-sm font-semibold"
                                    onClick={() => setShowRequestModal(false)}
                                />
                                <Button
                                    title="Gửi yêu cầu"
                                    backgroundColor="#1B223B"
                                    hoverBackgroundColor="#2A3349"
                                    foreColor="white"
                                    className="px-6 py-2.5 rounded-lg text-sm font-semibold"
                                    onClick={handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default Tutor;
