import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import Avatar from '../assets/avatar.jpg';
import FreeTimeSelection from '../components/FreeTimeSelection';
import { CoppyLinkIcon, FilterIcon } from '../components/icons';
import { Checkbox, ComboBox, InputField, RadioButton } from '../components/InputField';
import Navbar from '../components/Navbar'; // Đảm bảo đúng đường dẫn
import { Notification } from '../components/Notification';
import { MultiLineText, TitleText } from '../components/Text';
import TopNavbar from '../components/TopNavbar';
import axiosClient from '../configs/axios.config';
import { Helmet } from 'react-helmet-async';
import { PostSkeleton } from '../components/TutorSkeleton';
import { useAuthStore } from '../store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { Slider } from 'antd';
import { TimeSlotSelector } from '../components/WeeklySchedule';
import type { TimeSlot } from '../components/WeeklySchedule';

interface Subject {
    id: string;
    name: string;
}

interface User {
    id: string;
    avatar?: string;
    name: string;
    user?: {
        avatar?: string;
    };
}

// Thêm interfaces cho dữ liệu địa chỉ
interface Province {
    code: string;
    name: string;
}

interface District {
    code: string;
    name: string;
}

interface Ward {
    code: string;
    name: string;
}

const Post: React.FC = () => {
    const [postAvailableTimes, setPostAvailableTimes] = useState([{ day: '', from: '', to: '' }]);
    const [filterAvailableTimes, setFilterAvailableTimes] = useState([{ day: '', from: '', to: '' }]);
    const locationState = useLocation();
    const showCreatePostModal = locationState.state?.showCreatePostModal || false;

    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true;
    });
    const [showPopup, setShowPopup] = useState(showCreatePostModal);
    const [minPrice, setMinPrice] = useState(20000);
    const [maxPrice, setMaxPrice] = useState(50000);
    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const { user } = useAuthStore();
    const isStudent = user?.role === 'STUDENT';
    const isTutor = user?.role === 'TUTOR';
    type APIPost = Omit<Post, 'mode'> & { mode: string };
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true); // Thêm state để theo dõi trạng thái tải dữ liệu

    const [postTitle, setPostTitle] = useState('');
    const [content, setContent] = useState('');

    // Thêm state để lưu địa chỉ nhập vào
    const [location] = useState<string>(Array.isArray(user?.location) ? user.location[0] || '' : user?.location || '');
    const [showLocationInput] = useState<boolean>(!user?.location);

    const navigate = useNavigate();

    // State cho danh sách địa chỉ
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');

    // Fetch danh sách tỉnh/thành phố khi component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/?depth=1');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
            }
        };

        fetchProvinces();
    }, []);

    // Fetch danh sách quận/huyện khi chọn tỉnh/thành phố
    const handleProvinceChange = (provinceCode: string) => {
        setSelectedProvince(provinceCode);
        setSelectedDistrict('');
        setSelectedWard('');

        if (!provinceCode) {
            setDistricts([]);
            return;
        }

        const fetchDistricts = async () => {
            try {
                const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
                const data = await response.json();
                setDistricts(data.districts);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách quận/huyện:', error);
            }
        };

        fetchDistricts();
    };

    // Fetch danh sách phường/xã khi chọn quận/huyện
    const handleDistrictChange = (districtCode: string) => {
        setSelectedDistrict(districtCode);
        setSelectedWard('');

        if (!districtCode) {
            setWards([]);
            return;
        }

        const fetchWards = async () => {
            try {
                const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
                const data = await response.json();
                setWards(data.wards);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách phường/xã:', error);
            }
        };

        fetchWards();
    };

    const bgColors = ['#EBF5FF', '#E6F0FD', '#F0F7FF'];

    const [isOpen, setIsOpen] = useState(false);

    const togglePopupFilter = () => {
        console.log('togglePopupFilter được gọi, isOpen hiện tại:', isOpen);
        setIsOpen(!isOpen);
    };

    const closePopupFilter = () => {
        setIsOpen(false);
    };

    const closePopupPost = () => {
        console.log('Closing post popup');
        setShowPopup(false);
    };

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedStudyMode, setSelectedStudyMode] = useState<string[]>([]);
    const [selectedSessionPerWeek, setSelectedSessionPerWeek] = useState<string[]>([]);
    const [selectedDuration, setSelectedDuration] = useState<string[]>([]);

    const resetFilters = () => {
        setMinPrice(100000);
        setMaxPrice(500000);
        setSelectedSubject('');
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedWard('');
        setSelectedStudyMode([]);
        setSelectedGrade('');
        setSelectedSessionPerWeek([]);
        setSelectedDuration([]);
        setFilterAvailableTimes([{ day: '', from: '', to: '' }]);
    };

    const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [negotiatedPrice, setNegotiatedPrice] = useState('');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null); // Sửa để ban đầu là null
    const [, setSubject] = useState<string>('');
    const [grade, setGrade] = useState('');
    const [studyMode, setStudyMode] = useState('');
    const [sessionsPerWeek, setSessionsPerWeek] = useState('');
    const [duration, setDuration] = useState('');
    const [requirements, setRequirements] = useState('');

    // const [favoritePosts, setFavoritePosts] = useState<string[]>([]);

    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });

    // const handleFavorite = async (postId: string) => {
    //     try {
    //         // Kiểm tra xem người dùng đã đăng nhập chưa
    //         if (!user || !user.id) {
    //             setNotification({
    //                 message: 'Vui lòng đăng nhập để thêm bài viết vào danh sách yêu thích',
    //                 show: true,
    //                 type: 'error',
    //             });
    //             setTimeout(() => {
    //                 setNotification((prev) => ({ ...prev, show: false }));
    //             }, 3000);
    //             return;
    //         }

    //         // Kiểm tra xem bài viết đã được yêu thích chưa
    //         const isFavorited = favoritePosts.includes(postId);

    //         if (isFavorited) {
    //             // Nếu đã yêu thích, gọi API để xóa khỏi danh sách yêu thích
    //             await axiosClient.delete(`/favorite-posts/${postId}`);

    //             // Cập nhật state để xóa khỏi danh sách yêu thích
    //             setFavoritePosts(favoritePosts.filter((id) => id !== postId));

    //             setNotification({
    //                 message: 'Đã xóa bài viết khỏi danh sách yêu thích',
    //                 show: true,
    //                 type: 'success',
    //             });
    //         } else {
    //             // Nếu chưa yêu thích, gọi API để thêm vào danh sách yêu thích
    //             await axiosClient.post(`/favorite-posts/${postId}`);

    //             // Cập nhật state để thêm vào danh sách yêu thích
    //             setFavoritePosts([...favoritePosts, postId]);

    //             setNotification({
    //                 message: 'Đã thêm bài viết vào danh sách yêu thích',
    //                 show: true,
    //                 type: 'success',
    //             });
    //         }

    //         setTimeout(() => {
    //             setNotification((prev) => ({ ...prev, show: false }));
    //         }, 3000);
    //     } catch (error) {
    //         console.error('Error toggling favorite post:', error);

    //         setNotification({
    //             message: 'Có lỗi xảy ra khi thao tác với bài viết yêu thích',
    //             show: true,
    //             type: 'error',
    //         });

    //         setTimeout(() => {
    //             setNotification((prev) => ({ ...prev, show: false }));
    //         }, 3000);
    //     }
    // };

    type Post = {
        id: number;
        user: {
            id: string;
            avatar: string;
            name: string;
        };
        content: string;
        subject: {
            id: string;
            name: string;
        };
        grade: string;
        mode: boolean;
        locations: string[];
        sessionPerWeek: string;
        duration: string[];
        feePerSession: string;
        requirements: string[];
        schedule: string[];
        title: string;
        createdAt: string;
    };
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axiosClient.get('/subjects');
                console.log('Fetched subjects:', response.data); // Log để debug
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };
        fetchSubjects();
    }, []);

    // const openNegotiationPopup = (post: Post) => {
    //     setSelectedPost(post);
    //     setIsNegotiationOpen(true);
    // };

    const closeNegotiationPopup = () => {
        setIsNegotiationOpen(false);
        setNegotiatedPrice('');
    };

    const openConfirmPopup = (post: Post) => {
        setSelectedPost(post);
        setIsConfirmOpen(true);
    };

    const closeConfirmPopup = () => {
        setIsConfirmOpen(false);
    };

    const [copyTooltip, setCopyTooltip] = useState<{ show: boolean; x: number; y: number }>({
        show: false,
        x: 0,
        y: 0,
    });

    const handleCopyLink = (e: React.MouseEvent, postId: string) => {
        e.stopPropagation(); // Ngăn sự kiện click lan truyền đến div cha

        // Tạo URL đầy đủ đến trang chi tiết bài viết
        const postDetailUrl = `${window.location.origin}/post-detail/${postId}`;

        // Copy URL vào clipboard
        navigator.clipboard
            .writeText(postDetailUrl)
            .then(() => {
                // Hiển thị tooltip thành công
                setCopyTooltip({
                    show: true,
                    x: e.clientX,
                    y: e.clientY,
                });

                // Ẩn tooltip sau 2 giây
                setTimeout(() => {
                    setCopyTooltip({ show: false, x: 0, y: 0 });
                }, 2000);
            })
            .catch((error) => {
                console.error('Không thể copy link:', error);
                // Hiển thị thông báo lỗi nếu cần
                setNotification({
                    message: 'Không thể copy link bài viết',
                    show: true,
                    type: 'error',
                });
                setTimeout(() => {
                    setNotification((prev) => ({ ...prev, show: false }));
                }, 3000);
            });
    };

    const userRole = 'TUTOR';

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            try {
                setLoading(true);
                if (!searchTerm.trim()) {
                    // Nếu thanh tìm kiếm trống, lấy tất cả bài viết
                    const response = await axiosClient.get('/posts');
                    const formattedPosts = response.data.map((post: APIPost) => ({
                        ...post,
                        mode: String(post.mode).toLowerCase() === 'true',
                    }));
                    setPosts(formattedPosts);
                } else {
                    // Tìm kiếm theo title
                    const response = await axiosClient.get('/posts/search', {
                        params: {
                            page: 1,
                            limit: 5,
                            title: searchTerm.trim(),
                        },
                    });

                    if (response.data.length === 0) {
                        setPosts([]);
                        setNotification({
                            message: 'Không tìm thấy kết quả phù hợp',
                            show: true,
                            type: 'error',
                        });
                        setTimeout(() => {
                            setNotification((prev) => ({ ...prev, show: false }));
                        }, 2000);
                    } else {
                        const formattedPosts = response.data.map((post: APIPost) => ({
                            ...post,
                            mode: String(post.mode).toLowerCase() === 'true',
                        }));
                        setPosts(formattedPosts);
                    }
                }
            } catch (error) {
                console.error('Error searching posts:', error);
                if (error instanceof Error) {
                    console.log('Error details:', (error as AxiosError).response);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleApplyFilter = () => {
        console.log('Áp dụng bộ lọc với các giá trị:', {
            subject: selectedSubject,
            city: selectedCity,
            district: selectedDistrict,
            ward: selectedWard,
            studyMode: selectedStudyMode,
            sessionPerWeek: selectedSessionPerWeek,
            duration: selectedDuration,
            minPrice,
            maxPrice,
        });

        // Định nghĩa filteredPosts
        const filteredPosts = posts.filter((post) => {
            // Ví dụ về điều kiện lọc sử dụng post
            if (selectedSubject && post.subject.id !== selectedSubject) return false;
            // Thêm các điều kiện lọc khác nếu cần
            return true;
        });

        console.log('Kết quả sau khi lọc:', filteredPosts);

        // Nếu muốn cập nhật state để hiển thị bài đăng đã lọc
        // setPosts(filteredPosts);
    };
    const [selectedGrade, setSelectedGrade] = useState('');

    // Thêm state để lưu subject đã chọn
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

    // Thêm state để theo dõi trạng thái đang gửi request
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitPost = async () => {
        // Nếu đang trong quá trình gửi, không cho phép gửi lại
        if (isSubmitting) return;

        try {
            setIsSubmitting(true); // Đánh dấu đang gửi request

            // Kiểm tra các trường bắt buộc
            if (!postTitle || !content || !selectedSubjectId || !grade || !studyMode || !sessionsPerWeek || !duration) {
                setNotification({
                    message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
                    show: true,
                    type: 'error',
                });
                setTimeout(() => {
                    setNotification((prev) => ({ ...prev, show: false }));
                }, 3000);
                setIsSubmitting(false); // Reset trạng thái
                return;
            }

            // Đảm bảo các giá trị số đúng định dạng
            const sessionPerWeekValue = parseInt(sessionsPerWeek.replace(/\D/g, ''));

            // Chuyển đổi duration từ giờ sang phút
            let durationValue = 0;
            if (duration.includes('giờ')) {
                // Trích xuất số từ chuỗi (ví dụ: "1.5 giờ" -> 1.5)
                const hourMatch = duration.match(/(\d+(\.\d+)?)/);
                if (hourMatch) {
                    const hours = parseFloat(hourMatch[0]);
                    durationValue = Math.round(hours * 60); // Chuyển giờ sang phút và làm tròn
                }
            } else {
                // Nếu đã là phút thì chỉ cần lấy số
                durationValue = parseInt(duration.replace(/\D/g, ''));
            }

            console.log(`Chuyển đổi thời lượng: ${duration} -> ${durationValue} phút`);

            // Lọc thời gian rảnh hợp lệ
            const validSchedules = postAvailableTimes
                .filter((t) => t.day && t.from && t.to)
                .map((t) => `${t.day} từ ${t.from} - ${t.to}`);

            if (validSchedules.length === 0) {
                setNotification({
                    message: 'Vui lòng chọn ít nhất một khung thời gian rảnh',
                    show: true,
                    type: 'error',
                });
                return;
            }

            // Sử dụng địa chỉ từ input nếu đã nhập, nếu không thì dùng địa chỉ của user
            const userLocation = showLocationInput ? location : user?.location || '';

            // Thêm thời gian đăng bài (thời gian hiện tại)
            const postTime = new Date().toISOString();

            // Trước khi gửi request
            console.log('Selected subject ID:', selectedSubjectId);

            // Định dạng dữ liệu theo mẫu API yêu cầu
            const formattedData = {
                title: postTitle,
                content: content,
                subject: selectedSubjectId, // Gửi ID dưới dạng chuỗi, không phải đối tượng
                grade: grade,
                mode: studyMode === 'Online',
                locations: [userLocation],
                sessionPerWeek: sessionPerWeekValue,
                duration: durationValue,
                requirements: requirements.split('\n').filter((r) => r),
                schedule: validSchedules,
                feePerSession: parseInt(String(maxPrice)),
                postTime: postTime,
            };

            console.log('Sending data:', JSON.stringify(formattedData));

            await axiosClient.post('/posts', formattedData);

            console.log('Post created successfully');

            // Đóng popup
            setShowPopup(false);

            // Reset form
            setPostTitle('');
            setContent('');
            setSelectedSubjectId('');
            setGrade('');
            setStudyMode('');
            setSessionsPerWeek('');
            setDuration('');
            setRequirements('');
            setPostAvailableTimes([{ day: '', from: '', to: '' }]);
            setMaxPrice(30000);

            // Hiển thị thông báo thành công
            setNotification({
                message: 'Đăng bài thành công, vui lòng chờ admin phê duyệt',
                show: true,
                type: 'success',
            });

            // Tự động ẩn thông báo sau 3 giây
            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 3000);
        } catch (error) {
            console.error('Error posting:', error);
            if (error instanceof AxiosError) {
                console.log('Request data:', error.config?.data);
                console.log('Error response:', error.response?.data);

                // Hiển thị thông báo lỗi cụ thể từ server nếu có
                if (error.response?.data?.message) {
                    const errorMessage = Array.isArray(error.response.data.message)
                        ? error.response.data.message[0]
                        : error.response.data.message;

                    setNotification({
                        message: errorMessage,
                        show: true,
                        type: 'error',
                    });
                    setTimeout(() => {
                        setNotification((prev) => ({ ...prev, show: false }));
                    }, 3000);
                } else {
                    setNotification({
                        message: 'Có lỗi xảy ra khi đăng bài',
                        show: true,
                        type: 'error',
                    });
                    setTimeout(() => {
                        setNotification((prev) => ({ ...prev, show: false }));
                    }, 3000);
                }
            }
        } finally {
            setIsSubmitting(false); // Reset trạng thái khi hoàn thành
        }
    };

    // Component để chọn thời gian và chu kỳ lặp lại
    interface TimeSelectionData {
        sessionPerWeek: number;
        selectedSlots: Array<{ day: string; startTime: string; endTime: string }>;
        feePerSession: number;
        mode: boolean;
        repeatWeeks: number;
    }

    const TimeSelectionModal = ({
        post,
        onClose,
        onSubmit,
    }: {
        post: Post;
        onClose: () => void;
        onSubmit: (data: TimeSelectionData) => void;
    }) => {
        const [sessionPerWeek, setSessionPerWeek] = useState<number>(Number(post.sessionPerWeek));
        const [selectedSlots, setSelectedSlots] = useState<Array<{ day: string; startTime: string; endTime: string }>>(
            [],
        );
        const [feePerSession, setFeePerSession] = useState<number>(Number(post.feePerSession));
        const [mode, setMode] = useState<boolean>(post.mode);
        const [repeatWeeks, setRepeatWeeks] = useState<number>(1);

        const handleSlotsChange = (slots: TimeSlot[]) => {
            const formattedSlots = slots.map((slot) => ({
                day: slot.day,
                startTime: `${slot.startHour}:${slot.startMinute}`,
                endTime: `${slot.endHour}:${slot.endMinute}`,
            }));
            setSelectedSlots(formattedSlots);
        };

        const handleSubmit = () => {
            if (selectedSlots.length !== sessionPerWeek) {
                setNotification({
                    message: `Vui lòng chọn đủ ${sessionPerWeek} khung thời gian`,
                    show: true,
                    type: 'error',
                });
                setTimeout(() => {
                    setNotification((prev) => ({ ...prev, show: false }));
                }, 3000);
                return;
            }

            onSubmit({
                sessionPerWeek,
                selectedSlots,
                feePerSession,
                mode,
                repeatWeeks,
            });
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-[600px] max-w-full max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Xác nhận nhận lớp</h2>

                    {/* Hiển thị thông tin từ post */}
                    <div className="mb-4 space-y-2">
                        <div>
                            <span className="font-semibold">Môn học:</span> {post.subject.name}
                        </div>
                        <div>
                            <span className="font-semibold">Khối học:</span> {post.grade}
                        </div>
                        <div>
                            <span className="font-semibold">Địa điểm:</span> {post.locations.join(', ')}
                        </div>
                        <div>
                            <span className="font-semibold">Thời lượng/buổi:</span> {post.duration} phút
                        </div>
                        <div>
                            <span className="font-semibold">Học phí/giờ:</span>
                            <input
                                type="number"
                                value={feePerSession}
                                onChange={(e) => setFeePerSession(Number(e.target.value))}
                                className="ml-2 p-1 border rounded w-32"
                            />
                            <span className="ml-1">đ</span>
                        </div>
                        <div>
                            <span className="font-semibold">Hình thức học:</span>
                            <select
                                value={mode ? 'Online' : 'Offline'}
                                onChange={(e) => setMode(e.target.value === 'Online')}
                                className="ml-2 p-1 border rounded"
                            >
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Số buổi/tuần</label>
                        <select
                            value={sessionPerWeek}
                            onChange={(e) => setSessionPerWeek(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                        >
                            {Array.from({ length: Number(post.sessionPerWeek) }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num} buổi
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Chọn khung thời gian</label>
                        <TimeSlotSelector
                            availableSlots={post.schedule}
                            sessionPerWeek={sessionPerWeek}
                            onSlotsChange={handleSlotsChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Lặp lại trong</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={repeatWeeks}
                            onChange={(e) => setRepeatWeeks(Number(e.target.value))}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'tuần' : 'tuần'}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">Chọn số tuần lặp lại lịch học</p>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleTeachRequest = async (post: Post, data: TimeSelectionData) => {
        try {
            // Tạo ngày bắt đầu từ tuần tới
            const startOfNextWeek = new Date();
            startOfNextWeek.setDate(startOfNextWeek.getDate() + (8 - startOfNextWeek.getDay()));

            // Map ngày trong tuần sang tiếng Anh
            const dayMap: { [key: string]: string } = {
                'Thứ 2': 'Monday',
                'Thứ 3': 'Tuesday',
                'Thứ 4': 'Wednesday',
                'Thứ 5': 'Thursday',
                'Thứ 6': 'Friday',
                'Thứ 7': 'Saturday',
                'Chủ nhật': 'Sunday',
            };

            // Tạo schedule cho mỗi tuần
            interface ScheduleItem {
                day: string;
                startTime: string;
                endTime: string;
            }

            const formattedSchedule: ScheduleItem[] = [];
            for (let weekIndex = 0; weekIndex < data.repeatWeeks; weekIndex++) {
                // Tính ngày bắt đầu của mỗi tuần
                const weekStartDate = new Date(startOfNextWeek);
                weekStartDate.setDate(weekStartDate.getDate() + weekIndex * 7);

                // Thêm tất cả các slot đã chọn vào tuần này
                data.selectedSlots.forEach((slot) => {
                    const dayInEnglish = dayMap[slot.day];
                    const [startHour, startMinute] = slot.startTime.split(':');
                    const [endHour, endMinute] = slot.endTime.split(':');

                    const slotDate = new Date(weekStartDate);
                    const daysUntilSlot =
                        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(
                            dayInEnglish,
                        ) - weekStartDate.getDay();
                    slotDate.setDate(slotDate.getDate() + daysUntilSlot);

                    // Set giờ và phút cho thời gian bắt đầu
                    const startTime = new Date(slotDate);
                    startTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

                    // Set giờ và phút cho thời gian kết thúc
                    const endTime = new Date(slotDate);
                    endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

                    formattedSchedule.push({
                        day: dayInEnglish,
                        startTime: startTime.toISOString(),
                        endTime: endTime.toISOString(),
                    });
                });
            }

            const requestData = {
                type: 'RECEIVE_CLASS',
                toId: post.user.id,
                grade: post.grade,
                locations: post.locations,
                sessionPerWeek: data.sessionPerWeek,
                duration: Number(post.duration),
                subjectId: post.subject.id,
                schedule: formattedSchedule,
                mode: data.mode,
                feePerSession: data.feePerSession,
            };

            // Log ra để debug
            console.log('Request data:', JSON.stringify(requestData, null, 2));

            await axiosClient.post('/requests', requestData);
            setNotification({
                message: 'Đã gửi yêu cầu nhận lớp thành công',
                show: true,
                type: 'success',
            });
            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 3000);
            closeConfirmPopup();
        } catch (error) {
            console.error('Error sending teach request:', error);
            if (error instanceof AxiosError) {
                console.log('Error details:', error.response?.data);
            }
            setNotification({
                message: 'Có lỗi xảy ra khi gửi yêu cầu',
                show: true,
                type: 'error',
            });
            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 3000);
        }
    };

    // Thêm hàm xử lý khi bấm vào bài post
    const handlePostClick = (postId: string) => {
        navigate(`/post-detail/${postId}`);
    };

    // Trong useEffect để fetch bài đăng
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                console.log('Đang gọi API lấy bài đăng...');
                const response = await axiosClient.get('/posts');
                console.log('Kết quả API:', response.data);

                if (response.data) {
                    setPosts(
                        response.data.map((post: APIPost) => ({
                            ...post,
                            mode: post.mode === 'ONLINE',
                        })),
                    );
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài đăng:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Thêm useEffect để kiểm tra state posts
    useEffect(() => {
        console.log('State posts:', posts);
    }, [posts]);

    // Thêm log để kiểm tra state isOpen
    useEffect(() => {
        console.log('isOpen state:', isOpen);
    }, [isOpen]);

    return (
        <>
            <Helmet>
                <title>Đăng bài tìm gia sư | TeachMe</title>
                <meta
                    name="description"
                    content="Đăng bài tìm gia sư phù hợp với nhu cầu học tập của bạn. Chọn môn học, thời gian, địa điểm và mức học phí phù hợp."
                />
                <meta property="og:title" content="Đăng bài tìm gia sư | TeachMe" />
                <meta property="og:description" content="Đăng bài tìm gia sư phù hợp với nhu cầu học tập của bạn." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <div className="absolute top-0 left-0 flex h-screen w-screen bg-white z-10">
                <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
                <TopNavbar />
                <div
                    className={`flex-1 p-6 transition-all duration-300 ${
                        isExpanded ? 'ml-56' : 'ml-16'
                    } overflow-y-auto mt-[56px]`}
                >
                    <div
                        className={` top-14 flex space-x-4 pb-4 z-20 ${
                            isExpanded ? 'left-60 right-5' : 'left-20 right-5'
                        }`}
                    >
                        <input
                            type="text"
                            placeholder="Nhập nội dung cần tìm kiếm"
                            className="p-3 rounded-md border border-gray-300 flex-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <FilterIcon className="h-9 w-9 text-gray-500 mt-1 cursor-pointer" onClick={togglePopupFilter} />
                    </div>
                    {isStudent && (
                        <div
                            className={`top-36 flex items-center space-x-4 mb-6 z-20 ${
                                isExpanded ? 'left-60 right-5' : 'left-20 right-5'
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={user?.avatar || Avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <button
                                onClick={togglePopup}
                                className="text-left p-3 bg-blue-100 text-blue-900 rounded-lg flex-1 hover:bg-blue-200 transition-colors"
                            >
                                Bạn có nhu cầu tìm gia sư ư?
                            </button>
                        </div>
                    )}
                    {showPopup && (
                        <div
                            className="fixed inset-0 overflow-y-auto bg-gray-700 bg-opacity-50 flex justify-center items-start z-50"
                            onClick={closePopupPost}
                        >
                            <div
                                className="bg-white p-6 rounded-md w-[700px] max-w-full my-8"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <TitleText level={2} size="large" weight="bold">
                                    Tạo bài đăng
                                </TitleText>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSubmitPost();
                                    }}
                                >
                                    <InputField
                                        type="text"
                                        title="Tiêu đề bài đăng"
                                        placeholder="Nhập tiêu đề bài đăng"
                                        required={true}
                                        value={postTitle}
                                        onChange={(value) => setPostTitle(value)}
                                    />
                                    <InputField
                                        type="textarea"
                                        title="Nội dung"
                                        placeholder="Nhập nội dung bài đăng"
                                        required={true}
                                        value={content}
                                        onChange={(value) => setContent(value)}
                                    />
                                    <div className="mt-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Môn học <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={selectedSubjectId}
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                setSelectedSubjectId(id);
                                                // Tìm tên subject tương ứng với ID
                                                const selected = subjects.find((s) => s.id === id);
                                                if (selected) {
                                                    setSubject(selected.name);
                                                }
                                            }}
                                        >
                                            <option value="">-- Chọn môn học --</option>
                                            {subjects.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <ComboBox
                                        title="Khối học"
                                        options={[
                                            'GRADE_1',
                                            'GRADE_2',
                                            'GRADE_3',
                                            'GRADE_4',
                                            'GRADE_5',
                                            'GRADE_6',
                                            'GRADE_7',
                                            'GRADE_8',
                                            'GRADE_9',
                                            'GRADE_10',
                                            'GRADE_11',
                                            'GRADE_12',
                                            'UNIVERSITY',
                                            'AFTER_UNIVERSITY',
                                            'OTHER',
                                        ]}
                                        required={true}
                                        value={grade}
                                        onChange={(value) => setGrade(value)}
                                    />
                                    <RadioButton
                                        title="Hình thức học"
                                        options={['Online', 'Offline']}
                                        required={true}
                                        optionColor="text-gray-700"
                                        value={studyMode}
                                        onChange={(value) => setStudyMode(value)}
                                    />
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2">Địa điểm</label>
                                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                            <div className="w-full md:w-1/3">
                                                <select
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    value={selectedProvince}
                                                    onChange={(e) => handleProvinceChange(e.target.value)}
                                                >
                                                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                                    {provinces && provinces.length > 0 ? (
                                                        provinces.map((province) => (
                                                            <option key={province.code} value={province.code}>
                                                                {province.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">-- Không có dữ liệu --</option>
                                                    )}
                                                </select>
                                            </div>

                                            <div className="w-full md:w-1/3">
                                                <select
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    value={selectedDistrict}
                                                    onChange={(e) => handleDistrictChange(e.target.value)}
                                                    disabled={!selectedProvince}
                                                >
                                                    <option value="">-- Chọn Quận/Huyện --</option>
                                                    {districts && districts.length > 0 ? (
                                                        districts.map((district) => (
                                                            <option key={district.code} value={district.code}>
                                                                {district.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">-- Không có dữ liệu --</option>
                                                    )}
                                                </select>
                                            </div>

                                            <div className="w-full md:w-1/3">
                                                <select
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    value={selectedWard}
                                                    onChange={(e) => setSelectedWard(e.target.value)}
                                                    disabled={!selectedDistrict}
                                                >
                                                    <option value="">-- Chọn Phường/Xã --</option>
                                                    {wards && wards.length > 0 ? (
                                                        wards.map((ward) => (
                                                            <option key={ward.code} value={ward.code}>
                                                                {ward.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">-- Không có dữ liệu --</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <ComboBox
                                        title="Số buổi/tuần"
                                        options={['1 buổi', '2 buổi', '3 buổi', '4 buổi', '5 buổi']}
                                        required={true}
                                        value={sessionsPerWeek}
                                        onChange={(value) => setSessionsPerWeek(value)}
                                    />
                                    <ComboBox
                                        title="Thời lượng/buổi"
                                        options={['1 giờ', '1.5 giờ', '2 giờ', '2.5 giờ', '3 giờ']}
                                        required={true}
                                        value={duration}
                                        onChange={(value) => setDuration(value)}
                                    />
                                    <div className="mt-4 mb-4">
                                        <label className="block text-gray-700 font-bold mb-2">Khoảng giá / Giờ</label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                className="border px-2 py-1 w-24 text-center"
                                                value={maxPrice.toLocaleString('vi-VN') + 'đ'}
                                                readOnly
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="range"
                                                min="0"
                                                max="500000"
                                                step="10000"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                                className="relative w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-gray-700 font-bold mb-2">
                                            Yêu cầu đối với gia sư
                                        </label>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            rows={4}
                                            placeholder="Nhập yêu cầu đối với gia sư"
                                            value={requirements}
                                            onChange={(e) => setRequirements(e.target.value)}
                                        />
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                className="px-3 py-1 bg-gray-200 rounded text-sm"
                                                onClick={() => setRequirements((prev) => prev + 'Phải là nam\n')}
                                            >
                                                Phải là nam
                                            </button>
                                            <button
                                                type="button"
                                                className="px-3 py-1 bg-gray-200 rounded text-sm"
                                                onClick={() => setRequirements((prev) => prev + 'Phải là nữ\n')}
                                            >
                                                Phải là nữ
                                            </button>
                                            <button
                                                type="button"
                                                className="px-3 py-1 bg-gray-200 rounded text-sm"
                                                onClick={() =>
                                                    setRequirements((prev) => prev + 'Trình độ học vấn 12/12\n')
                                                }
                                            >
                                                Trình độ học vấn 12/12
                                            </button>
                                            <button
                                                type="button"
                                                className="px-3 py-1 bg-gray-200 rounded text-sm"
                                                onClick={() => setRequirements((prev) => prev + 'Có kinh nghiệm dạy\n')}
                                            >
                                                Có kinh nghiệm dạy
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <FreeTimeSelection
                                            times={postAvailableTimes}
                                            onTimesChange={setPostAvailableTimes}
                                        />
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                                            onClick={closePopupPost}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <Notification message={notification.message} show={notification.show} type={notification.type} />
                    {copyTooltip.show && (
                        <div
                            className="fixed bg-gray-400 text-white px-3 py-1 rounded text-sm z-50"
                            style={{
                                left: copyTooltip.x + 10,
                                top: copyTooltip.y + 10,
                                transform: 'translate(-50%, -100%)',
                                animation: 'fadeInOut 2s ease-in-out',
                            }}
                        >
                            Đã copy link bài đăng
                        </div>
                    )}

                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                        {loading ? (
                            <>
                                <PostSkeleton />
                                <PostSkeleton />
                                <PostSkeleton />
                            </>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Không có bài đăng nào</p>
                            </div>
                        ) : (
                            posts.map((post, index) => (
                                <div
                                    key={post.id || index}
                                    className="relative border p-4 mb-4 shadow-md rounded-lg cursor-pointer"
                                    style={{ backgroundColor: bgColors[index % bgColors.length] }}
                                    onClick={() => handlePostClick(post.id.toString())}
                                >
                                    {/* Header: Icons */}
                                    <div
                                        className="absolute top-2 right-2 flex space-x-4"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* <HeartIcon
                                            className={`h-5 w-5 cursor-pointer transition-colors duration-200 ${
                                                favoritePosts.includes(post.id.toString())
                                                    ? 'text-red-500 fill-current'
                                                    : ''
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFavorite(post.id.toString());
                                            }}
                                        /> */}
                                        <CoppyLinkIcon
                                            className="h-5 w-5 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyLink(e, post.id.toString());
                                            }}
                                        />
                                    </div>
                                    {/* User Info & Title Section */}
                                    <div className="flex items-center space-x-4 mb-2">
                                        <img
                                            src={(post.user as User)?.user?.avatar || post.user?.avatar || Avatar}
                                            alt={post.user?.name || 'User'}
                                            className="w-10 h-10 rounded-full"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/50';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-lg">{post.user?.name}</p>
                                            </div>
                                            <span className="text-sm text-gray-500 block mt-1">
                                                {new Date(post.createdAt).toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Title & Subject Info */}
                                    <h3 className="font-bold text-xl p-1">{post.title}</h3>
                                    <p className="text-sm text-gray-600 p-1">
                                        {post.subject.name} - {post.grade}
                                    </p>
                                    {/* Main Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                                        <div className="col-span-1">
                                            <p className="text-lg text-blue-800 font-bold">
                                                Giá: {post.feePerSession} {'vnđ/ giờ'}
                                            </p>
                                            <p className="text-sm text-gray-600 pt-2">
                                                Địa điểm:{' '}
                                                <MultiLineText
                                                    locations={Array.isArray(post.locations) ? post.locations : []}
                                                />
                                            </p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="text-sm text-gray-600">Số buổi/tuần: {post.sessionPerWeek}</p>
                                            <p className="text-sm text-gray-600 mt-2">
                                                Hình thức học: {post.mode ? 'Trực tuyến' : 'Trực tiếp'}
                                            </p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="text-sm text-gray-600 mt-2">
                                                Thời lượng: {post.duration} phút
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Thời gian rảnh:
                                                <MultiLineText
                                                    schedule={Array.isArray(post.schedule) ? post.schedule : []}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                    {/* Requirements Section */}
                                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Yêu cầu: </span>
                                            <MultiLineText
                                                text={
                                                    Array.isArray(post.requirements) ? post.requirements.join(', ') : ''
                                                }
                                            />
                                        </p>
                                    </div>
                                    {/* Action Buttons */}
                                    {isTutor && (
                                        <div
                                            className="flex justify-end space-x-4 mt-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openNegotiationPopup(post);
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Thương lượng giá
                                            </button> */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openConfirmPopup(post);
                                                }}
                                                className="px-4 py-2 bg-blue-900 text-white rounded-md font-bold hover:bg-blue-800 transition-colors"
                                            >
                                                Nhận lớp
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {userRole === 'TUTOR' && (
                    <>
                        {isNegotiationOpen && selectedPost && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div
                                    className="bg-white p-6 rounded-lg shadow-lg w-1/2 border border-blue-100"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h2 className="text-xl font-semibold mb-4">Thương lượng giá</h2>
                                    <p className="text-lg text-gray-600">Giá cũ: {selectedPost.feePerSession}</p>
                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-[#1B223B]">
                                            Giá thương lượng:
                                        </label>
                                        <input
                                            type="number"
                                            value={negotiatedPrice}
                                            onChange={(e) => setNegotiatedPrice(e.target.value)}
                                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={closeNegotiationPopup}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log('Yêu cầu thương lượng giá:', negotiatedPrice);
                                                closeNegotiationPopup();
                                            }}
                                            className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                                        >
                                            Gửi yêu cầu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isConfirmOpen && selectedPost && (
                            <TimeSelectionModal
                                post={selectedPost}
                                onClose={closeConfirmPopup}
                                onSubmit={(data) => {
                                    setSelectedSessionPerWeek([data.sessionPerWeek.toString()]);
                                    handleTeachRequest(selectedPost, data);
                                }}
                            />
                        )}
                    </>
                )}
                {/*popup filter */}
                {isOpen && (
                    <div
                        className="fixed inset-0 overflow-y-auto bg-gray-700 bg-opacity-50 flex justify-center items-start z-50"
                        onClick={closePopupFilter}
                    >
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-w-full my-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <TitleText level={2} size="large" weight="bold">
                                Bộ lọc
                            </TitleText>
                            <div className="mt-4">
                                <label className="block text-gray-700 font-bold mb-2">Môn học</label>
                                <input
                                    list="subjects"
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    onFocus={(e) => e.target.select()} // Tự động bôi đen khi focus
                                    placeholder="Chọn hoặc nhập môn học"
                                    className="border p-2 rounded w-full"
                                />
                                <datalist id="subjects">
                                    {subjects.map((subject, index) => (
                                        <option key={index} value={subject.name} />
                                    ))}
                                </datalist>
                            </div>
                            <ComboBox
                                title="Khối học"
                                options={[
                                    'GRADE_1',
                                    'GRADE_2',
                                    'GRADE_3',
                                    'GRADE_4',
                                    'GRADE_5',
                                    'GRADE_6',
                                    'GRADE_7',
                                    'GRADE_8',
                                    'GRADE_9',
                                    'GRADE_10',
                                    'GRADE_11',
                                    'GRADE_12',
                                    'UNIVERSITY',
                                    'AFTER UNIVERSITY',
                                    'SOFT SKILL',
                                    'OTHER',
                                ]}
                                value={selectedGrade}
                                onChange={(value) => setSelectedGrade(value)}
                            />
                            <div className="mt-4">
                                <label className="block text-gray-700 font-bold mb-2">Địa điểm</label>
                                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                    <div className="w-full md:w-1/3">
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={selectedProvince}
                                            onChange={(e) => handleProvinceChange(e.target.value)}
                                        >
                                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                            {provinces && provinces.length > 0 ? (
                                                provinces.map((province) => (
                                                    <option key={province.code} value={province.code}>
                                                        {province.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">-- Không có dữ liệu --</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="w-full md:w-1/3">
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={selectedDistrict}
                                            onChange={(e) => handleDistrictChange(e.target.value)}
                                            disabled={!selectedProvince}
                                        >
                                            <option value="">-- Chọn Quận/Huyện --</option>
                                            {districts && districts.length > 0 ? (
                                                districts.map((district) => (
                                                    <option key={district.code} value={district.code}>
                                                        {district.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">-- Không có dữ liệu --</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="w-full md:w-1/3">
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={selectedWard}
                                            onChange={(e) => setSelectedWard(e.target.value)}
                                            disabled={!selectedDistrict}
                                        >
                                            <option value="">-- Chọn Phường/Xã --</option>
                                            {wards && wards.length > 0 ? (
                                                wards.map((ward) => (
                                                    <option key={ward.code} value={ward.code}>
                                                        {ward.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">-- Không có dữ liệu --</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <Checkbox
                                title="Số buổi / Tuần"
                                options={['1 buổi', '2 buổi', '3 buổi', '4 buổi', '5 buổi']}
                                value={selectedSessionPerWeek}
                                onChange={(value) => setSelectedSessionPerWeek(value)}
                                optionColor="text-gray-700"
                            />
                            <Checkbox
                                title="Thời lượng / buổi"
                                options={['1 hr', '1.5 hrs', '2 hrs', '2.5 hrs', '3 hrs', '3.5 hrs']}
                                value={selectedDuration}
                                onChange={(value) => setSelectedDuration(value)}
                                optionColor="text-gray-700"
                            />
                            <div className="mt-4 mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Khoảng giá / Buổi</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        className="border px-2 py-1 w-24 text-center"
                                        value={`${minPrice.toLocaleString('vi-VN')}đ`}
                                        readOnly
                                    />
                                    <span>-</span>
                                    <input
                                        type="text"
                                        className="border px-2 py-1 w-24 text-center"
                                        value={`${maxPrice.toLocaleString('vi-VN')}đ`}
                                        readOnly
                                    />
                                </div>
                                <div className="relative">
                                    <Slider
                                        range
                                        min={100000}
                                        max={500000}
                                        step={10000}
                                        defaultValue={[minPrice, maxPrice]}
                                        onChange={(values) => {
                                            if (Array.isArray(values)) {
                                                setMinPrice(values[0]);
                                                setMaxPrice(values[1]);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <Checkbox
                                title="Hình thức học"
                                options={['Online', 'Offline']}
                                value={selectedStudyMode}
                                onChange={(value) => setSelectedStudyMode(value)}
                                optionColor="text-gray-700"
                            />
                            <div className="mt-4">
                                <FreeTimeSelection
                                    times={filterAvailableTimes}
                                    onTimesChange={setFilterAvailableTimes}
                                />
                            </div>
                            <div className="flex justify-between mt-6">
                                <button
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                    onClick={resetFilters}
                                >
                                    Thiết lập lại
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
                                    onClick={handleApplyFilter}
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Post;
