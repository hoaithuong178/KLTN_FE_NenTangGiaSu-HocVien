// Post.tsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Đảm bảo đúng đường dẫn
import TopNavbar from '../components/TopNavbar';
import Avatar from '../assets/avatar.jpg';
import { CoppyLinkIcon, DisLikeIcon, FilterIcon, HeartIcon, LikeIcon, MarkIcon } from '../components/icons';

const Post: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        // Kiểm tra trạng thái từ localStorage
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true; // Mặc định là true
    });
    const [showPopup, setShowPopup] = useState(false);

    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    // Danh sách bài đăng mẫu
    const posts = [
        {
            id: 1,
            avatar: Avatar,
            name: 'Nguyễn Văn A',
            title: 'Tìm gia sư Toán cấp 3',
            subject: 'Toán học',
            studyMode: 'Online',
            location: 'Hà Nội',
            session: '3 buổi/tuần',
            timePerSession: '2 tiếng',
            price: '100k/giờ',
            requirements: 'Yêu cầu có kinh nghiệm dạy, trình độ học vấn đại học, gia sư nữ, giao tiếp tốt',
            availableTime: '9:00-11:00 Thứ 3; 18:00-20:00 Thứ 5, 9:00-15:00 Thứ 7',
            likes: 10, // Số lượng likes
            dislikes: 2,
        },
        {
            id: 2,
            avatar: Avatar,
            name: 'Trần Thị B',
            title: 'Tìm gia sư Tiếng Anh giao tiếp',
            subject: 'Tiếng Anh',
            studyMode: 'Offline',
            location: 'Hồ Chí Minh',
            session: '2 buổi/tuần',
            timePerSession: '1.5 tiếng',
            price: '150k/giờ',
            requirements: 'Giới thiệu trước khi nhận lớp, có khả năng giao tiếp tốt',
            availableTime: '8:00-10:00 Thứ 2, 10:00-12:00 Thứ 4',
            likes: 13,
            dislikes: 1,
        },
        {
            id: 3,
            avatar: Avatar,
            name: 'Nguyễn Thi C',
            title: 'Tìm gia sư Tiếng Anh giao tiếp',
            subject: 'Tiếng Anh',
            studyMode: 'Offline',
            location: 'Đắk Lắk',
            session: '4 buổi/tuần',
            timePerSession: '1 giờ',
            price: '90k/giờ',
            requirements: 'Gia sư nam, có kinh nghiệm dạy',
            availableTime: 'Tối các ngày trong tuần',
            likes: 20,
            dislikes: 0,
        },
        {
            id: 4,
            avatar: Avatar,
            name: 'Lê Minh D',
            title: 'Tìm gia sư Vật lý lớp 12',
            subject: 'Vật lý',
            studyMode: 'Online',
            location: 'Hà Nội',
            session: '2 buổi/tuần',
            timePerSession: '2 tiếng',
            price: '120k/giờ',
            requirements: 'Giảng viên đại học, có phương pháp giảng dạy sáng tạo',
            availableTime: 'Sáng Thứ 3, 4 và Chiều Thứ 6',
            likes: 14,
            dislikes: 1,
        },
        {
            id: 5,
            avatar: Avatar,
            name: 'Hoàng Minh T',
            title: 'Tìm gia sư Toán lớp 10',
            subject: 'Toán học',
            studyMode: 'Offline',
            location: 'Đà Nẵng',
            session: '3 buổi/tuần',
            timePerSession: '1.5 tiếng',
            price: '80k/giờ',
            requirements: 'Kiên nhẫn, có kinh nghiệm dạy lớp 10',
            availableTime: 'Chiều các ngày trong tuần',
            likes: 13,
            dislikes: 1,
        },
        {
            id: 6,
            avatar: Avatar,
            name: 'Nguyễn Thị B',
            title: 'Tìm gia sư Tiếng Nhật',
            subject: 'Tiếng Nhật',
            studyMode: 'Online',
            location: 'TP Hồ Chí Minh',
            session: '3 buổi/tuần',
            timePerSession: '1 tiếng',
            price: '110k/giờ',
            requirements: 'Năng động, có khả năng giao tiếp bằng Tiếng Nhật',
            availableTime: 'Tối các ngày trong tuần',
            likes: 13,
            dislikes: 5,
        },
    ];

    // Mảng màu nền cho bài đăng
    const bgColors = ['#e3f5ef', '#fadfdf', '#FDEDD7'];

    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen bg-white z-10">
            {/* Sử dụng Navbar với các props */}
            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />

            {/* Main Content */}
            <div className={`flex-1 p-6 transition-all duration-300 ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                {/* Thanh tìm kiếm */}
                <div className="fixed top-12 w-full flex space-x-4 pb-4 z-10">
                    <input
                        type="text"
                        placeholder="Nhập nội dung cần tìm kiếm"
                        className="p-3 rounded-md border border-gray-300 w-[90%]"
                    />
                    <FilterIcon className="h-9 w-9 text-gray-500 mr-4 mt-1" />
                </div>

                {/* Thanh Avatar và Button yêu cầu tìm gia sư */}
                <div className="fixed top-28 w-full flex items-center space-x-4 mb-6 z-10">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={Avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button
                        onClick={togglePopup}
                        className="text-left p-3 bg-[#FFC569] text-[#1B223B] rounded-lg w-[90%]"
                    >
                        Bạn có nhu cầu tìm gia sư ư?
                    </button>
                </div>

                {/* Popup bài đăng */}
                {showPopup && (
                    <div className="pt-40 overflow-y-auto absolute top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-md w-1/2">
                            <h2 className="text-xl font-semibold mb-4">Tạo bài đăng</h2>
                            {/* Form đăng bài */}
                            <form>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#1B223B]">Tiêu đề:</label>
                                    <input
                                        type="text"
                                        value={posts[0].title}
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#1B223B]">Môn học:</label>
                                    <input
                                        type="text"
                                        value={posts[0].subject}
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#1B223B]">Hình thức học:</label>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#1B223B]">Địa điểm:</label>
                                    <input
                                        type="text"
                                        value={posts[0].location}
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#1B223B]">Giá:</label>
                                    <input
                                        type="text"
                                        value={posts[0].price}
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#1B223B]">Yêu cầu:</label>
                                    <textarea
                                        value={posts[0].requirements}
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#1B223B]">
                                        Thời gian rảnh:
                                    </label>
                                    <input
                                        type="text"
                                        value={posts[0].availableTime}
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                {/* Button container */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={togglePopup}
                                        className="bg-[#F97564] text-[#1B223B] px-4 py-2 rounded-md"
                                    >
                                        Đóng
                                    </button>
                                    <button type="button" className="bg-[#7beed7] text-[#1B223B] px-4 py-2 rounded-md">
                                        Đăng bài
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Danh sách bài đăng */}
                <div className="mt-40 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            className="relative border p-4 rounded-md mb-4"
                            style={{ backgroundColor: bgColors[index % bgColors.length] }}
                        >
                            {/* Các button yêu thích và ghim */}
                            <div className="absolute top-2 right-2 flex space-x-4">
                                <HeartIcon />
                                <MarkIcon />
                                <CoppyLinkIcon />
                            </div>

                            {/* Nội dung bài đăng */}
                            <div className="flex items-center space-x-4 mb-2">
                                <img src={post.avatar} alt={post.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-lg">{post.name}</p>
                                    <p className="text-sm text-gray-600">{post.subject}</p>
                                </div>
                            </div>
                            <h3 className="font-bold text-xl">{post.title}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <p className="text-lg text-[#e4655f] font-bold">Giá: {post.price}</p>
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

                            {/* Buttons */}
                            <div className="mt-4 flex justify-between items-center">
                                {/* Các icon (Like và Dislike) căn trái */}
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <LikeIcon />
                                        <span className="ml-2">{post.likes}</span> {/* Hiển thị số lượng likes */}
                                    </div>
                                    <div className="flex items-center">
                                        <DisLikeIcon />
                                        <span className="ml-2">{post.dislikes}</span> {/* Hiển thị số lượng dislikes */}
                                    </div>
                                </div>

                                {/* Các button căn phải */}
                                <div className="flex space-x-4">
                                    <button className="px-4 py-2 bg-[#F97564] text-[#1B223B] rounded-md">
                                        Thương lượng giá
                                    </button>
                                    <button className="px-4 py-2 bg-[#7beed7] text-[#1B223B] rounded-md font-bold">
                                        Nhận lớp
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Post;
