// Post.tsx
import { Slider } from 'antd';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import Avatar from '../assets/avatar.jpg';
import FreeTimeSelection from '../components/FreeTimeSelection';
import { CoppyLinkIcon, FilterIcon, HeartIcon } from '../components/icons';
import { Checkbox, ComboBox, InputField, RadioButton } from '../components/InputField';
import Navbar from '../components/Navbar'; // Đảm bảo đúng đường dẫn
import { Notification } from '../components/Notification';
import { TitleText } from '../components/Text';
import TopNavbar from '../components/TopNavbar';
import axiosClient from '../configs/axios.config';
import { Helmet } from 'react-helmet-async';
import { PostSkeleton } from '../components/TutorSkeleton';
import { useAuthStore } from '../store/authStore';

const Post: React.FC = () => {
    const [postAvailableTimes, setPostAvailableTimes] = useState([{ day: '', from: '', to: '' }]);
    const [filterAvailableTimes, setFilterAvailableTimes] = useState([{ day: '', from: '', to: '' }]);

    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true;
    });
    const [showPopup, setShowPopup] = useState(false);
    const [minPrice, setMinPrice] = useState(20000);
    const [maxPrice, setMaxPrice] = useState(50000);
    // const [availableTimes] = useState([{ day: '', from: '', to: '' }]);
    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const { user } = useAuthStore.getState();
    const isStudent = user?.role === 'STUDENT';
    const isTutor = user?.role === 'TUTOR';
    type APIPost = Omit<Post, 'mode'> & { mode: string };
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true); // Thêm state để theo dõi trạng thái tải dữ liệu
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/posts');
                console.log('Posts data:', response.data);
                // Chuyển đổi dữ liệu API để khớp với kiểu Post
                const formattedPosts = response.data.map((post: APIPost) => ({
                    ...post,
                    mode: post.mode === 'true' ? true : false,
                }));
                setPosts(formattedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const bgColors = ['#EBF5FF', '#E6F0FD', '#F0F7FF'];

    const [isOpen, setIsOpen] = useState(false);

    const togglePopupFilter = () => {
        setIsOpen((prev) => !prev);
    };

    const closePopupFilter = () => {
        setIsOpen(false);
    };

    const closePopupPost = () => {
        setShowPopup(false);
    };

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
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
        setFilterAvailableTimes([{ day: '', from: '', to: '' }]); // Reset filter times
    };

    const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [negotiatedPrice, setNegotiatedPrice] = useState('');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null); // Sửa để ban đầu là null
    const [, setPostTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [studyMode, setStudyMode] = useState('');
    const [location, setLocation] = useState('Địa chỉ của học viên');
    const [sessionsPerWeek, setSessionsPerWeek] = useState('');
    const [duration, setDuration] = useState('');
    const [requirements, setRequirements] = useState('');

    const [favoritePosts, setFavoritePosts] = useState<number[]>([]);

    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });

    const handleFavorite = (postId: number) => {
        const isFavorite = favoritePosts.includes(postId);
        if (isFavorite) {
            setFavoritePosts((prev) => prev.filter((id) => id !== postId));
            setNotification({
                message: 'Đã xóa yêu thích bài viết',
                show: true,
                type: 'success',
            });
        } else {
            setFavoritePosts((prev) => [...prev, postId]);
            setNotification({
                message: 'Đã thêm bài viết vào yêu thích',
                show: true,
                type: 'success',
            });
        }

        setTimeout(() => {
            setNotification((prev) => ({ ...prev, show: false }));
        }, 3000);
    };

    type Schedule = {
        startTime: string; // Thời gian bắt đầu (ISO string)
        endTime: string; // Thời gian kết thúc (ISO string)
    };
    type Post = {
        id: number;
        user: {
            avatar: string;
            name: string;
        };
        content: string;
        subject: {
            name: string;
        };
        grade: string;
        mode: boolean;
        locations: string[];
        sessionPerWeek: string;
        duration: string[];
        feePerSession: string;
        requirements: string[];
        schedule: Schedule[];
        title: string;
        createdAt: string;
    };
    const [subjects, setSubjects] = useState<string[]>([]);
    // const [customSubject, setCustomSubject] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axiosClient.get('/subjects');
                setSubjects(response.data.map((subject: { name: string }) => subject.name));
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };
        fetchSubjects();
    }, []);

    const openNegotiationPopup = (post: Post) => {
        setSelectedPost(post);
        setIsNegotiationOpen(true);
    };

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

    const handleCopyLink = (e: React.MouseEvent, postId: number) => {
        const x = e.clientX;
        const y = e.clientY;
        const postUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(postUrl);
        setCopyTooltip({ show: true, x, y });
        setTimeout(() => {
            setCopyTooltip({ show: false, x: 0, y: 0 });
        }, 1000);
    };

    const userRole = 'TUTOR';

    const MultiLineText = ({
        text,
        locations,
        schedule,
    }: {
        text?: string;
        locations?: string[];
        schedule?: Schedule[];
    }) => {
        if (locations) {
            return (
                <>
                    {locations.map((location, i) => (
                        <span key={i} className="mr-8">
                            {location}
                        </span>
                    ))}
                </>
            );
        }
        if (schedule) {
            return (
                <div className="mt-1">
                    {schedule.map((time, i) => (
                        <div key={i} className="ml-2">
                            {'- '}
                            {String(time)}
                        </div>
                    ))}
                </div>
            );
        }
        // Giữ lại logic cũ cho text thông thường
        return (
            <>
                {text?.split('\n').map((line, i) => (
                    <span key={i}>
                        {line}
                        <br />
                    </span>
                ))}
            </>
        );
    };

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
                        mode: post.mode === 'true' ? true : false,
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
                            mode: post.mode === 'true' ? true : false,
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

    const handleApplyFilter = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/posts/search', {
                params: {
                    page: 1,
                    limit: 5,
                    grade: selectedGrade || null,
                    title: null,
                    content: null,
                    location: selectedCity || selectedDistrict || selectedWard || null,
                    minSessionPerWeek: selectedSessionPerWeek.length > 0 ? selectedSessionPerWeek[0] : null,
                    maxSessionPerWeek: selectedSessionPerWeek.length > 0 ? selectedSessionPerWeek[0] : null,
                    minDuration: selectedDuration.length > 0 ? selectedDuration[0] : null,
                    maxDuration: selectedDuration.length > 0 ? selectedDuration[0] : null,
                    subject: selectedSubject || null,
                    requirements: null,
                    mode: selectedStudyMode.length > 0 ? (selectedStudyMode[0] === 'Online' ? 'true' : 'false') : null,
                    minFeePerSession: minPrice || null,
                    maxFeePerSession: maxPrice || null,
                    sessionPerWeek: null,
                },
            });

            console.log('Filter response:', response.data); // Log để debug
            const formattedPosts = response.data.map((post: APIPost) => ({
                ...post,
                mode: post.mode === 'true' ? true : false,
            }));
            setPosts(formattedPosts);
            closePopupFilter();
        } catch (error) {
            console.error('Error filtering posts:', error);
            if (error instanceof Error) {
                console.log('Error details:', (error as AxiosError).response);
            }
        } finally {
            setLoading(false);
        }
    };
    const [selectedGrade, setSelectedGrade] = useState('');

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
                            className={`fixed top-28 flex items-center space-x-4 mb-6 z-20 ${
                                isExpanded ? 'left-60 right-5' : 'left-20 right-5'
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={Avatar} alt="Avatar" className="w-full h-full object-cover" />
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
                                <form>
                                    <InputField
                                        type="text"
                                        title="Tiêu đề bài đăng"
                                        placeholder="Nhập tiêu đề bài đăng"
                                        required={true}
                                        onChange={(value) => setPostTitle(value)}
                                    />
                                    <ComboBox
                                        title="Môn học"
                                        options={['Toán', 'Lý', 'Hóa', 'Anh', 'Văn', 'Sinh', 'Sử', 'Địa']}
                                        required={true}
                                        value={subject}
                                        onChange={(value) => setSubject(value)}
                                    />
                                    <ComboBox
                                        title="Khối học"
                                        options={[
                                            '1',
                                            '2',
                                            '3',
                                            '4',
                                            '5',
                                            '6',
                                            '7',
                                            '8',
                                            '9',
                                            '10',
                                            '11',
                                            '12',
                                            'Đại học',
                                            'Sau đại học',
                                            'Kỹ năng mềm',
                                            'Khác',
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
                                    <InputField
                                        type="text"
                                        title="Địa điểm"
                                        placeholder="Địa chỉ của học viên"
                                        required={true}
                                        value={location}
                                        onChange={(value) => setLocation(value)}
                                    />
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
                                    <div className="flex justify-between mt-6">
                                        <button
                                            type="button"
                                            onClick={togglePopup}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
                                        >
                                            Đóng
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                                            onClick={() => {
                                                console.log({
                                                    // ... other data ...
                                                    availableTimes: postAvailableTimes,
                                                });
                                                togglePopup();
                                            }}
                                        >
                                            Đăng bài
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
                            <p>Không có bài đăng nào.</p>
                        ) : (
                            posts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className="relative border p-4 mb-4 shadow-md rounded-lg"
                                    style={{ backgroundColor: bgColors[index % bgColors.length] }}
                                >
                                    {/* Header: Icons */}
                                    <div className="absolute top-2 right-2 flex space-x-4">
                                        <HeartIcon
                                            className={`h-5 w-5 cursor-pointer transition-colors duration-200 ${
                                                favoritePosts.includes(post.id) ? 'text-red-500 fill-current' : ''
                                            }`}
                                            onClick={() => handleFavorite(post.id)}
                                        />
                                        <CoppyLinkIcon
                                            className="h-5 w-5 cursor-pointer"
                                            onClick={(e) => handleCopyLink(e, post.id)}
                                        />
                                    </div>
                                    {/* User Info & Title Section */}
                                    <div className="flex items-center space-x-4 mb-2">
                                        <img
                                            src={post.user.avatar}
                                            alt={post.user.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-lg">{post.user.name}</p>
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
                                        <div className="flex justify-end space-x-4 mt-4">
                                            <button
                                                onClick={() => openNegotiationPopup(post)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Thương lượng giá
                                            </button>
                                            <button
                                                onClick={() => openConfirmPopup(post)}
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
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div
                                    className="bg-white p-6 rounded-lg shadow-lg w-1/2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h2 className="text-xl font-semibold mb-4">Xác nhận nhận lớp</h2>
                                    <p className="text-lg text-gray-600">
                                        Bạn muốn gửi yêu cầu nhận lớp đến người dùng {selectedPost.user.name}?
                                    </p>
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={closeConfirmPopup}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log('Gửi yêu cầu nhận lớp');
                                                closeConfirmPopup();
                                            }}
                                            className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                                        >
                                            Gửi yêu cầu
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                                        <option key={index} value={subject} />
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
                                <div className="flex space-x-2">
                                    <ComboBox
                                        title="Tỉnh/Thành phố"
                                        options={['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng']}
                                        value={selectedCity}
                                        onChange={(v) => setSelectedCity(v)}
                                    />
                                    <ComboBox
                                        title="Quận/Huyện"
                                        options={['Quận 1', 'Quận 2', 'Quận 3']}
                                        value={selectedDistrict}
                                        onChange={(v) => setSelectedDistrict(v)}
                                    />
                                    <ComboBox
                                        title="Phường/Xã"
                                        options={['Phường 1', 'Phường 2', 'Phường 3']}
                                        value={selectedWard}
                                        onChange={(v) => setSelectedWard(v)}
                                    />
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
