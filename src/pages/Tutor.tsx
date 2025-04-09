import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { FilterIcon, ResetIcon } from '../components/icons';
import TutorDetailCard from '../components/TutorDetailCard';
import TutorSkeleton from '../components/TutorSkeleton';
import { TutorProfileComponentTutor } from './TutorProfile';
import { RequestModal } from '../components/ModalComponent';
import defaultAvatar from '../assets/avatar.jpg';

const Tutor: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true;
    });

    const [tutors, setTutors] = useState<TutorProfileComponentTutor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<TutorProfileComponentTutor | null>(null);
    const [requestForm, setRequestForm] = useState({
        title: '',
        content: '',
        specializations: '', // Thay subject bằng specializations
        location: '',
        duration: 60,
        mode: 'online' as 'online' | 'offline',
        hourlyPrice: 0, // Thay pricePerSession bằng hourlyPrice
        learningTypes: '', // Thêm thuộc tính này
        level: '', // Thêm thuộc tính này
        sessionsPerWeek: 1, // Thêm thuộc tính này
    });
    const [selectedTimes] = useState<string[]>([]);
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

            let response;
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userRole = user?.role;

            // Kiểm tra vai trò người dùng và gọi API tương ứng
            if (userRole === 'TUTOR') {
                // Nếu là gia sư, lấy danh sách gia sư được đề xuất cho gia sư
                response = await axios.get(`${API_URL}/recommend/tutor-for-tutor`);
            } else if (userRole === 'STUDENT') {
                // Nếu là học sinh, lấy danh sách gia sư được đề xuất cho học sinh
                response = await axios.get(`${API_URL}/recommend/tutor-for-student`);
            } else {
                // Trường hợp khác hoặc chưa đăng nhập, lấy tất cả gia sư
                response = await axios.get(`${API_URL}/tutors/search?page=1&limit=10`);
            }

            const tutorsData = response.data?.data;

            if (!Array.isArray(tutorsData)) throw new Error('Invalid tutor list from API');

            const mappedTutors = tutorsData.map((tutor: TutorProfileComponentTutor) => ({
                ...tutor,
                currentUserId: tutor.currentUserId,
                status: tutor.status || 'ACTIVE',
                violate: tutor.violate || 0,
                userProfile: tutor.userProfile || {
                    avatar: defaultAvatar,
                    gender: 'Unknown',
                    dob: '',
                    address: '',
                },
                tutorProfile: tutor.tutorProfile
                    ? {
                          ...tutor.tutorProfile,
                          hourlyPrice: tutor.tutorProfile.hourlyPrice || 0,
                          experiences: tutor.tutorProfile.experiences || 0,
                          taughtStudentsCount: tutor.tutorProfile.taughtStudentsCount || 0,
                          rating: tutor.tutorProfile.rating || 0,
                          description: tutor.tutorProfile.description || '',
                          tutorLocations: tutor.tutorProfile.tutorLocations || [],
                          specializations: tutor.tutorProfile.specializations || [],
                          learningTypes: tutor.tutorProfile.learningTypes || [],
                          reviews: tutor.tutorProfile.reviews || [],
                          isFavorite: tutor.tutorProfile.isFavorite ?? false,
                          freeTime: tutor.tutorProfile.freeTime || [],
                          qualification: tutor.tutorProfile.qualification || '',
                      }
                    : undefined,
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
            (!filters.priceFrom || (tutor.tutorProfile?.hourlyPrice ?? 0) >= filters.priceFrom) &&
            (!filters.priceTo || (tutor.tutorProfile?.hourlyPrice ?? 0) <= filters.priceTo) &&
            (!filters.selectedSubject || tutor.tutorProfile?.specializations?.includes(filters.selectedSubject)) &&
            (!filters.selectedRating || (tutor.tutorProfile?.rating ?? 0) >= filters.selectedRating) &&
            (!filters.countFrom || (tutor.tutorProfile?.taughtStudentsCount ?? 0) >= filters.countFrom) &&
            (!filters.countTo || (tutor.tutorProfile?.taughtStudentsCount ?? 0) <= filters.countTo) &&
            (!filters.isFavorited || tutor.tutorProfile?.isFavorite)
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

    const handleRequestClick = (tutor: TutorProfileComponentTutor) => {
        setSelectedTutor(tutor);
        setRequestForm({
            title: '',
            content: '',
            specializations: tutor.tutorProfile?.specializations?.[0] || '',
            location: tutor.tutorProfile?.tutorLocations?.[0] || '',
            duration: 60,
            mode: 'online',
            hourlyPrice: tutor.tutorProfile?.hourlyPrice || 0,
            learningTypes: tutor.tutorProfile?.learningTypes?.[0] || '',
            level: tutor.tutorProfile?.level || '',
            sessionsPerWeek: 1,
        });
        setShowRequestModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRequestForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'duration' &&
                selectedTutor?.tutorProfile && {
                    hourlyPrice: (parseInt(value) / 60) * selectedTutor.tutorProfile.hourlyPrice,
                }),
        }));
    };

    // const toggleTimeSelection = (timeRange: string) => {
    //     setSelectedTimes((prev) => {
    //         if (prev.includes(timeRange)) {
    //             return prev.filter((t) => t !== timeRange);
    //         }
    //         if (prev.length >= sessionCount) {
    //             setNotification({
    //                 message: `Bạn chỉ có thể chọn tối đa ${sessionCount} khung giờ`,
    //                 show: true,
    //                 type: 'error',
    //             });
    //             setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
    //             return prev;
    //         }
    //         return [...prev, timeRange];
    //     });
    // };

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
            setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
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
            <Navbar isExpanded={isExpanded} toggleNavbar={() => setIsExpanded((prev) => !prev)} />
            <div className="absolute top-0">
                <TopNavbar />
            </div>
            <div className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-56' : 'ml-16'}`}>
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
                                    <label className="block text-gray-700 font-medium mb-1">Số học sinh</label>
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

            {showRequestModal && selectedTutor && (
                <RequestModal
                    show={showRequestModal}
                    onClose={() => setShowRequestModal(false)}
                    onSubmit={handleSubmit}
                    requestForm={requestForm}
                    handleChange={handleChange}
                    tutorSpecializations={selectedTutor.tutorProfile?.specializations || []}
                    tutorLearningTypes={selectedTutor.tutorProfile?.learningTypes || []}
                    tutorHourlyPrice={selectedTutor.tutorProfile?.hourlyPrice || 0}
                />
            )}

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
