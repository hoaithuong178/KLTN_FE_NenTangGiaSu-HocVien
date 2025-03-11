// Post.tsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Đảm bảo đúng đường dẫn
import TopNavbar from '../components/TopNavbar';
import Avatar from '../assets/avatar.jpg';
import { CoppyLinkIcon, FilterIcon, HeartIcon } from '../components/icons';
import { Checkbox, ComboBox, InputField, RadioButton } from '../components/InputField';
import { TitleText } from '../components/Text';
import { Notification } from '../components/Notification';
import axiosClient from '../configs/axios.config';

const Post: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true;
    });
    const [showPopup, setShowPopup] = useState(false);
    const [minPrice, setMinPrice] = useState(100000);
    const [maxPrice, setMaxPrice] = useState(500000);
    const [availableTimes, setAvailableTimes] = useState([{ day: '', from: '', to: '' }]);
    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

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
        setAvailableTimes([{ day: '', from: '', to: '' }]);
    };

    const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [negotiatedPrice, setNegotiatedPrice] = useState('');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null); // Sửa để ban đầu là null
    const [postTitle, setPostTitle] = useState('');
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
    };

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

    const formatTime = (timeString: string) => {
        const time = new Date(timeString);
        return time.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };
    const getDayOfWeek = (timeString: string) => {
        const date = new Date(timeString);
        const day = date.getDay();
        switch (day) {
            case 0:
                return 'Chủ nhật';
            case 1:
                return 'Thứ 2';
            case 2:
                return 'Thứ 3';
            case 3:
                return 'Thứ 4';
            case 4:
                return 'Thứ 5';
            case 5:
                return 'Thứ 6';
            case 6:
                return 'Thứ 7';
            default:
                return '';
        }
    };
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

    const MultiLineText = ({ text }: { text: string }) => (
        <>
            {text.split('\n').map((line, i) => (
                <span key={i}>
                    {line}
                    <br />
                </span>
            ))}
        </>
    );

    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen bg-white z-10">
            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />

            <div className={`flex-1 p-6 transition-all duration-300 ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                <div
                    className={`fixed top-14 flex space-x-4 pb-4 z-20 ${
                        isExpanded ? 'left-60 right-5' : 'left-20 right-5'
                    }`}
                >
                    <input
                        type="text"
                        placeholder="Nhập nội dung cần tìm kiếm"
                        className="p-3 rounded-md border border-gray-300 flex-1"
                    />
                    <FilterIcon className="h-9 w-9 text-gray-500 mt-1 cursor-pointer" onClick={togglePopupFilter} />
                </div>

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
                                    <label className="block text-gray-700 font-bold mb-2">Khoảng giá / Buổi</label>
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
                                    <label className="block text-gray-700 font-bold mb-2">Yêu cầu đối với gia sư</label>
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
                                            onClick={() => setRequirements((prev) => prev + 'Trình độ học vấn 12/12\n')}
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
                                    <label className="block text-gray-700 font-bold mb-2">Thời gian rảnh</label>
                                    {availableTimes.map((time, index) => (
                                        <div key={index} className="flex space-x-2 mt-2">
                                            <select
                                                value={time.day}
                                                onChange={(e) => {
                                                    const newTimes = [...availableTimes];
                                                    newTimes[index].day = e.target.value;
                                                    setAvailableTimes(newTimes);
                                                }}
                                                className="border p-2 rounded w-1/3"
                                            >
                                                <option value="">Chọn thứ</option>
                                                <option value="2">Thứ 2</option>
                                                <option value="3">Thứ 3</option>
                                                <option value="4">Thứ 4</option>
                                                <option value="5">Thứ 5</option>
                                                <option value="6">Thứ 6</option>
                                                <option value="7">Thứ 7</option>
                                                <option value="CN">Chủ nhật</option>
                                            </select>
                                            <input
                                                type="time"
                                                value={time.from}
                                                onChange={(e) => {
                                                    const newTimes = [...availableTimes];
                                                    newTimes[index].from = e.target.value;
                                                    setAvailableTimes(newTimes);
                                                }}
                                                className="border p-2 rounded w-1/3"
                                            />
                                            <input
                                                type="time"
                                                value={time.to}
                                                onChange={(e) => {
                                                    const newTimes = [...availableTimes];
                                                    newTimes[index].to = e.target.value;
                                                    setAvailableTimes(newTimes);
                                                }}
                                                className="border p-2 rounded w-1/3"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        className="mt-2 px-3 py-1 bg-gray-300 rounded text-sm"
                                        onClick={() =>
                                            setAvailableTimes([...availableTimes, { day: '', from: '', to: '' }])
                                        }
                                    >
                                        + Thêm thời gian rảnh
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-bold">Hiển thị thời gian rảnh:</h3>
                                    <ul>
                                        {availableTimes.map((time, index) => {
                                            const days: { [key: string]: string } = {
                                                '2': 'Thứ 2',
                                                '3': 'Thứ 3',
                                                '4': 'Thứ 4',
                                                '5': 'Thứ 5',
                                                '6': 'Thứ 6',
                                                '7': 'Thứ 7',
                                                CN: 'Chủ nhật',
                                            };
                                            const dayName = days[time.day as keyof typeof days] || '';
                                            return (
                                                <li key={index}>
                                                    {dayName} từ {time.from} - {time.to}
                                                </li>
                                            );
                                        })}
                                    </ul>
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
                                                postTitle,
                                                subject,
                                                grade,
                                                studyMode,
                                                location,
                                                sessionsPerWeek,
                                                duration,
                                                requirements,
                                                minPrice,
                                                maxPrice,
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

                <div className="mt-40 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {loading ? (
                        <p>Đang tải bài đăng...</p> // Hiển thị thông báo khi đang tải dữ liệu
                    ) : posts.length === 0 ? (
                        <p>Không có bài đăng nào.</p> // Hiển thị thông báo khi không có dữ liệu
                    ) : (
                        posts.map((post, index) => (
                            <div
                                key={post.id}
                                className="relative border p-4 mb-4 shadow-md"
                                style={{ backgroundColor: bgColors[index % bgColors.length] }}
                            >
                                <div className="absolute top-2 right-2 flex space-x-4">
                                    <HeartIcon
                                        className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                                            favoritePosts.includes(post.id) ? 'text-red-500 fill-current' : ''
                                        }`}
                                        onClick={() => handleFavorite(post.id)}
                                    />
                                    <CoppyLinkIcon
                                        className="h-6 w-6 cursor-pointer"
                                        onClick={(e) => handleCopyLink(e, post.id)}
                                    />
                                </div>

                                <div className="flex items-center space-x-4 mb-2">
                                    {/* Sử dụng ảnh mặc định nếu avatar không phải URL hợp lệ */}
                                    <img
                                        src={Avatar} // Thay vì post.user.avatar, sử dụng ảnh mặc định
                                        alt={post.user.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-lg">{post.user.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {post.subject.name} - {post.grade}
                                        </p>
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl">{post.title}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <p className="text-lg text-blue-800 font-bold">
                                            Giá: {post.feePerSession} {'vnđ/ giờ'}
                                        </p>
                                        <p className="text-sm text-gray-600 pt-2">
                                            Thời gian rảnh:{'\n'}
                                            {post.schedule.map((time, index) => (
                                                <span key={index}>
                                                    {getDayOfWeek(time.startTime)} {formatTime(time.startTime)} -{' '}
                                                    {formatTime(time.endTime)}
                                                    <br />
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                    <div className="col-span-1">
                                        <p className="text-sm text-gray-600">Số buổi/tuần: {post.sessionPerWeek}</p>
                                    </div>
                                    <div className="col-span-1">
                                        <p className="text-sm text-gray-600">
                                            Hình thức học: {post.mode ? 'Trực tuyến' : 'Trực tiếp'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 pt-2">
                                    Địa điểm:{' '}
                                    <MultiLineText
                                        text={Array.isArray(post.locations) ? post.locations.join('\n') : ''}
                                    />
                                </p>

                                <p className="text-sm text-gray-600 mt-2">
                                    Yêu cầu:{' '}
                                    <MultiLineText
                                        text={Array.isArray(post.requirements) ? post.requirements.join(', ') : ''}
                                    />
                                </p>

                                <div className="flex justify-end space-x-4 pt-3 mr-0">
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
                        <ComboBox
                            title="Môn học"
                            options={['Toán', 'Lý', 'Hóa', 'Anh']}
                            value={selectedSubject}
                            onChange={(value) => setSelectedSubject(value)}
                        />
                        <ComboBox
                            title="Khôi học"
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
                                'Ký năng mềm',
                                'Khác',
                            ]}
                            value={selectedSubject}
                            onChange={(value) => setSelectedSubject(value)}
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
                                    value={minPrice.toLocaleString('vi-VN') + 'đ'}
                                    readOnly
                                />
                                <span>-</span>
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
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    className="absolute top-2 left-0 w-full opacity-50"
                                />
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
                        <Checkbox
                            title="Hình thức học"
                            options={['Online', 'Offline']}
                            value={selectedStudyMode}
                            onChange={(value) => setSelectedStudyMode(value)}
                            optionColor="text-gray-700"
                        />
                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2">Thời gian rảnh</label>
                            {availableTimes.map((time, index) => (
                                <div key={index} className="flex space-x-2 mt-2">
                                    <select
                                        value={time.day}
                                        onChange={(e) => {
                                            const newTimes = [...availableTimes];
                                            newTimes[index].day = e.target.value;
                                            setAvailableTimes(newTimes);
                                        }}
                                        className="border p-2 rounded w-1/3"
                                    >
                                        <option value="">Chọn thứ</option>
                                        <option value="2">Thứ 2</option>
                                        <option value="3">Thứ 3</option>
                                        <option value="4">Thứ 4</option>
                                        <option value="5">Thứ 5</option>
                                        <option value="6">Thứ 6</option>
                                        <option value="7">Thứ 7</option>
                                        <option value="CN">Chủ nhật</option>
                                    </select>
                                    <input
                                        type="time"
                                        value={time.from}
                                        onChange={(e) => {
                                            const newTimes = [...availableTimes];
                                            newTimes[index].from = e.target.value;
                                            setAvailableTimes(newTimes);
                                        }}
                                        className="border p-2 rounded w-1/3"
                                    />
                                    <input
                                        type="time"
                                        value={time.to}
                                        onChange={(e) => {
                                            const newTimes = [...availableTimes];
                                            newTimes[index].to = e.target.value;
                                            setAvailableTimes(newTimes);
                                        }}
                                        className="border p-2 rounded w-1/3"
                                    />
                                </div>
                            ))}
                            <button
                                className="mt-2 px-3 py-1 bg-gray-300 rounded text-sm"
                                onClick={() => setAvailableTimes([...availableTimes, { day: '', from: '', to: '' }])}
                            >
                                + Thêm thời gian rảnh
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-bold">Hiển thị thời gian rảnh:</h3>
                            <ul>
                                {availableTimes.map((time, index) => {
                                    const days: { [key: string]: string } = {
                                        '2': 'Thứ 2',
                                        '3': 'Thứ 3',
                                        '4': 'Thứ 4',
                                        '5': 'Thứ 5',
                                        '6': 'Thứ 6',
                                        '7': 'Thứ 7',
                                        CN: 'Chủ nhật',
                                    };
                                    const dayName = days[time.day as keyof typeof days] || '';
                                    return (
                                        <li key={index}>
                                            {dayName} từ {time.from} - {time.to}
                                        </li>
                                    );
                                })}
                            </ul>
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
                                onClick={() => {
                                    console.log('Áp dụng filter');
                                    closePopupFilter();
                                }}
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
