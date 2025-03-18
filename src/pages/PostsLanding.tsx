import Footer from '../components/Footer';
import Header from '../components/Header';
import React, { useState } from 'react';
import Avatar from '../assets/avatar.jpg';
import { CoppyLinkIcon, FilterIcon, HeartIcon } from '../components/icons';
import { Checkbox, ComboBox, InputField, RadioButton } from '../components/InputField';
import { TitleText } from '../components/Text';
import { Notification } from '../components/Notification';

function PostsLanding() {
    const [showPopup, setShowPopup] = useState(false);
    const [minPrice, setMinPrice] = useState(100000);
    const [maxPrice, setMaxPrice] = useState(500000);
    const [availableTimes, setAvailableTimes] = useState([
        { day: '', from: '', to: '' }, // Đảm bảo rằng mỗi phần tử có thuộc tính day, from và to
    ]);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    // Danh sách bài đăng mẫu
    const posts = [
        {
            id: 1,
            avatar: Avatar,
            name: 'Nguyễn Văn A',
            title: 'Tìm gia sư Toán cấp 3',
            subject: 'Toán học',
            grade: 'lớp 3',
            studyMode: 'Online',
            location: 'Hà Nội',
            session: '3 buổi/tuần',
            timePerSession: '2 tiếng',
            price: '100k/buổi',
            requirements: 'Yêu cầu có kinh nghiệm dạy, trình độ học vấn đại học, gia sư nữ, giao tiếp tốt',
            availableTime: '9:00-11:00 Thứ 3; 18:00-20:00 Thứ 5, 9:00-15:00 Thứ 7',
        },
        {
            id: 2,
            avatar: Avatar,
            name: 'Trần Thị B',
            title: 'Tìm gia sư Tiếng Anh giao tiếp',
            subject: 'Tiếng Anh',
            grade: 'kỹ năng mềm',
            studyMode: 'Offline',
            location: 'Hồ Chí Minh',
            session: '2 buổi/tuần',
            timePerSession: '1.5 tiếng',
            price: '150k/buổi',
            requirements: 'Giới thiệu trước khi nhận lớp, có khả năng giao tiếp tốt',
            availableTime: '8:00-10:00 Thứ 2, 10:00-12:00 Thứ 4',
        },
        {
            id: 3,
            avatar: Avatar,
            name: 'Nguyễn Thi C',
            title: 'Tìm gia sư Tiếng Anh giao tiếp',
            subject: 'Tiếng Anh',
            grade: 'kỹ năng mềm',
            studyMode: 'Offline',
            location: 'Đắk Lắk',
            session: '4 buổi/tuần',
            timePerSession: '1 giờ',
            price: '90k/buổi',
            requirements: 'Gia sư nam, có kinh nghiệm dạy',
            availableTime: 'Tối các ngày trong tuần',
        },
        {
            id: 4,
            avatar: Avatar,
            name: 'Lê Minh D',
            title: 'Tìm gia sư Vật lý lớp 12',
            subject: 'Vật lý',
            grade: 'lớp 12',
            studyMode: 'Online',
            location: 'Hà Nội',
            session: '2 buổi/tuần',
            timePerSession: '2 tiếng',
            price: '120k/buổi',
            requirements: 'Giảng viên đại học, có phương pháp giảng dạy sáng tạo',
            availableTime: 'Sáng Thứ 3, 4 và Chiều Thứ 6',
        },
        {
            id: 5,
            avatar: Avatar,
            name: 'Hoàng Minh T',
            title: 'Tìm gia sư Toán lớp 10',
            subject: 'Toán học',
            grade: 'lớp 10',
            studyMode: 'Offline',
            location: 'Đà Nẵng',
            session: '3 buổi/tuần',
            timePerSession: '1.5 tiếng',
            price: '80k/buổi',
            requirements: 'Kiên nhẫn, có kinh nghiệm dạy lớp 10',
            availableTime: 'Chiều các ngày trong tuần',
        },
        {
            id: 6,
            avatar: Avatar,
            name: 'Nguyễn Thị B',
            title: 'Tìm gia sư Tiếng Nhật',
            subject: 'Tiếng Nhật',
            grade: 'kỹ năng mềm',
            studyMode: 'Online',
            location: 'TP Hồ Chí Minh',
            session: '3 buổi/tuần',
            timePerSession: '1 tiếng',
            price: '110k/buổi',
            requirements: 'Năng động, có khả năng giao tiếp bằng Tiếng Nhật',
            availableTime: 'Tối các ngày trong tuần',
        },
    ];

    // Thay đổi màu nền cho các bài đăng
    const bgColors = ['#EBF5FF', '#E6F0FD', '#F0F7FF']; // Các tông màu xanh nhạt

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
        setMinPrice(100000); // Giá trị mặc định ban đầu cho minPrice
        setMaxPrice(500000); // Giá trị mặc định ban đầu cho maxPrice
        setSelectedSubject(''); // Reset môn học
        setSelectedCity(''); // Reset tỉnh/thành phố
        setSelectedDistrict(''); // Reset quận/huyện
        setSelectedWard(''); // Reset phường/xã
        setSelectedStudyMode([]); // Reset hình thức học
        setAvailableTimes([{ day: '', from: '', to: '' }]); // Reset thời gian rảnh
    };
    const [isNegotiationOpen, setIsNegotiationOpen] = useState(false); // Popup cho thương lượng giá
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Popup cho nhận lớp
    const [negotiatedPrice, setNegotiatedPrice] = useState(''); // Giá thương lượng
    const [selectedPost, setSelectedPost] = useState<Post>(posts[0]); // Lưu bài viết được chọn
    const [postTitle, setPostTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [studyMode, setStudyMode] = useState('');
    const [location, setLocation] = useState('Địa chỉ của học viên');
    const [sessionsPerWeek, setSessionsPerWeek] = useState('');
    const [duration, setDuration] = useState('');
    const [requirements, setRequirements] = useState('');

    const [favoritePosts, setFavoritePosts] = useState<number[]>([]);
    {
        /*xử lý yêu thích */
    }
    // Thay đổi state notification
    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });

    // Cập nhật hàm handleFavorite
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

    type Post = {
        id: number;
        avatar: string;
        name: string;
        title: string;
        subject: string;
        studyMode: string;
        location: string;
        session: string;
        timePerSession: string;
        price: string;
        requirements: string;
        availableTime: string;
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

    {
        /*coppy link bai dang */
    }
    const [copyTooltip, setCopyTooltip] = useState<{ show: boolean; x: number; y: number }>({
        show: false,
        x: 0,
        y: 0,
    });

    // Thêm hàm xử lý copy link
    const handleCopyLink = (e: React.MouseEvent, postId: number) => {
        // Lấy vị trí click
        const x = e.clientX;
        const y = e.clientY;

        // Tạo link cho bài viết cụ thể
        const postUrl = `${window.location.origin}/post/${postId}`;

        // Copy link vào clipboard
        navigator.clipboard.writeText(postUrl);

        // Hiển thị tooltip
        setCopyTooltip({ show: true, x, y });

        // Ẩn tooltip sau 2 giây
        setTimeout(() => {
            setCopyTooltip({ show: false, x: 0, y: 0 });
        }, 1000);
    };
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Thanh tìm kiếm */}
                <div className="flex space-x-4 pb-4">
                    <input
                        type="text"
                        placeholder="Nhập nội dung cần tìm kiếm"
                        className="p-3 rounded-md border border-gray-300 flex-1"
                    />
                    <FilterIcon
                        className="h-9 w-9 text-gray-500 mt-1 cursor-pointer hover:text-gray-700 transition-colors"
                        onClick={togglePopupFilter}
                    />
                </div>

                {/* Thanh Avatar và Button yêu cầu tìm gia sư */}
                <div className="flex items-center space-x-4 mb-6">
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

                {/* Popup bài đăng */}
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

                            {/* Form đăng bài */}
                            <form>
                                {/* Tiêu đề bài đăng */}
                                <InputField
                                    type="text"
                                    title="Tiêu đề bài đăng"
                                    placeholder="Nhập tiêu đề bài đăng"
                                    required={true}
                                    onChange={(value) => setPostTitle(value)}
                                />

                                {/* Môn học */}
                                <ComboBox
                                    title="Môn học"
                                    options={['Toán', 'Lý', 'Hóa', 'Anh', 'Văn', 'Sinh', 'Sử', 'Địa']}
                                    required={true}
                                    value={subject}
                                    onChange={(value) => setSubject(value)}
                                />

                                {/* Khối học */}
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

                                {/* Hình thức học */}
                                <RadioButton
                                    title="Hình thức học"
                                    options={['Online', 'Offline']}
                                    required={true}
                                    optionColor="text-gray-700"
                                    value={studyMode}
                                    onChange={(value) => setStudyMode(value)}
                                />

                                {/* Địa điểm */}
                                <InputField
                                    type="text"
                                    title="Địa điểm"
                                    placeholder="Địa chỉ của học viên"
                                    required={true}
                                    value={location}
                                    onChange={(value) => setLocation(value)}
                                />

                                {/* Số buổi/tuần */}
                                <ComboBox
                                    title="Số buổi/tuần"
                                    options={['1 buổi', '2 buổi', '3 buổi', '4 buổi', '5 buổi']}
                                    required={true}
                                    value={sessionsPerWeek}
                                    onChange={(value) => setSessionsPerWeek(value)}
                                />

                                {/* Thời lượng/buổi */}
                                <ComboBox
                                    title="Thời lượng/buổi"
                                    options={['1 giờ', '1.5 giờ', '2 giờ', '2.5 giờ', '3 giờ']}
                                    required={true}
                                    value={duration}
                                    onChange={(value) => setDuration(value)}
                                />

                                {/* Giá/buổi */}
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
                                {/* Yêu cầu đối với gia sư */}
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

                                {/* Thời gian rảnh */}
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

                                {/* Hiển thị thời gian rảnh */}
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

                                            // Đảm bảo time.day có giá trị hợp lệ
                                            const dayName = days[time.day as keyof typeof days] || ''; // Đảm bảo 'day' là key hợp lệ trong 'days'
                                            return (
                                                <li key={index}>
                                                    {dayName} từ {time.from} - {time.to}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Button container */}
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
                                            // Xử lý đăng bài ở đây
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

                {/* Thêm component thông báo */}
                <Notification message={notification.message} show={notification.show} type={notification.type} />
                {/* Danh sách bài đăng */}
                {/*tooltip*/}
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
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            className="relative border p-4  mb-4 shadow-md"
                            style={{ backgroundColor: bgColors[index % bgColors.length] }}
                        >
                            {/* Các button yêu thích và ghim */}
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

                            {/* Nội dung bài đăng */}
                            <div className="flex items-center space-x-4 mb-2">
                                <img src={post.avatar} alt={post.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-lg">{post.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {post.subject} - {post.grade}
                                    </p>
                                </div>
                            </div>
                            <h3 className="font-bold text-xl">{post.title}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <p className="text-lg text-blue-800 font-bold">Giá: {post.price}</p>
                                    <p className="text-sm text-gray-600">Hình thức học: {post.studyMode}</p>
                                </div>
                                <div className="col-span-1">
                                    <p className="text-sm text-gray-600">Số buổi/tuần: {post.session}</p>
                                    <p className="text-sm text-gray-600">Địa điểm: {post.location}</p>
                                </div>
                                <div className="col-span-1">
                                    <p className="text-sm text-gray-600">Thời gian: {post.timePerSession}</p>
                                    <p className="text-sm text-gray-600">Thời gian rảnh: {post.availableTime}</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mt-2">Yêu cầu: {post.requirements}</p>

                            {/* Các button căn phải */}
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
                    ))}
                </div>
            </div>

            {/* Popup Thương lượng giá */}
            {isNegotiationOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-1/2 border border-blue-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4">Thương lượng giá</h2>
                        <p className="text-lg text-gray-600">Giá cũ: {selectedPost?.price}</p>
                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-[#1B223B]">Giá thương lượng:</label>
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

            {/* Popup Xác nhận nhận lớp */}
            {isConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-4">Xác nhận nhận lớp</h2>
                        <p className="text-lg text-gray-600">
                            Bạn muốn gửi yêu cầu nhận lớp đến người dùng {selectedPost?.name}?
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
            {/*popup filter*/}
            {isOpen && (
                <div
                    className="fixed inset-0 overflow-y-auto bg-gray-700 bg-opacity-50 flex justify-center items-start z-50"
                    onClick={closePopupFilter}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-w-full my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Tiêu đề */}
                        <TitleText level={2} size="large" weight="bold">
                            Bộ lọc
                        </TitleText>

                        {/* Môn học */}
                        <ComboBox
                            title="Môn học"
                            options={['Toán', 'Lý', 'Hóa', 'Anh']}
                            value={selectedSubject}
                            onChange={(value) => setSelectedSubject(value)}
                        />

                        {/* Khối học */}
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

                        {/* Địa điểm */}
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
                        {/*sessionPerWeek*/}
                        <Checkbox
                            title="Số buổi / Tuần"
                            options={['1 buổi', '2 buổi', '3 buổi', '4 buổi', '5 buổi']}
                            value={selectedSessionPerWeek}
                            onChange={(value) => setSelectedSessionPerWeek(value)}
                            optionColor="text-gray-700"
                        />
                        {/*duration*/}
                        <Checkbox
                            title="Thời lượng / buổi"
                            options={['1 hr', '1.5 hrs', '2 hrs', '2.5 hrs', '3 hrs', '3.5 hrs']}
                            value={selectedDuration}
                            onChange={(value) => setSelectedDuration(value)}
                            optionColor="text-gray-700"
                        />
                        {/* Khoảng giá */}
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

                        {/* Hình thức học */}
                        <Checkbox
                            title="Hình thức học"
                            options={['Online', 'Offline']}
                            value={selectedStudyMode}
                            onChange={(value) => setSelectedStudyMode(value)}
                            optionColor="text-gray-700"
                        />

                        {/* Thời gian rảnh */}
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

                        {/* Hiển thị thời gian rảnh */}
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

                                    // Đảm bảo time.day có giá trị hợp lệ
                                    const dayName = days[time.day as keyof typeof days] || ''; // Đảm bảo 'day' là key hợp lệ trong 'days'
                                    return (
                                        <li key={index}>
                                            {dayName} từ {time.from} - {time.to}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Button Thiết lập lại & Áp dụng */}
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
            <Footer />
        </div>
    );
}

export default PostsLanding;
