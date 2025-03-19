import { Slider } from 'antd';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Avatar from '../assets/avatar.jpg';
import FreeTimeSelection from '../components/FreeTimeSelection';
import { CoppyLinkIcon, FilterIcon, HeartIcon } from '../components/icons';
import { Checkbox, ComboBox } from '../components/InputField';
import { Notification } from '../components/Notification';
import axiosClient from '../configs/axios.config';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Schedule = {
    startTime: string;
    endTime: string;
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

type APIPost = Omit<Post, 'mode'> & { mode: string };

const Content: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [favoritePosts, setFavoritePosts] = useState<number[]>([]);
    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });
    const [copyTooltip, setCopyTooltip] = useState<{ show: boolean; x: number; y: number }>({
        show: false,
        x: 0,
        y: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(100000);
    const [maxPrice, setMaxPrice] = useState(500000);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedStudyMode, setSelectedStudyMode] = useState<string[]>([]);
    const [selectedSessionPerWeek, setSelectedSessionPerWeek] = useState<string[]>([]);
    const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
    const [filterAvailableTimes, setFilterAvailableTimes] = useState([{ day: '', from: '', to: '' }]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [subjects, setSubjects] = useState<string[]>([]);

    // Fetch posts từ API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/posts');
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

    // Fetch subjects từ API
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

    // Xử lý tìm kiếm
    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            try {
                setLoading(true);
                if (!searchTerm.trim()) {
                    const response = await axiosClient.get('/posts');
                    const formattedPosts = response.data.map((post: APIPost) => ({
                        ...post,
                        mode: post.mode === 'true' ? true : false,
                    }));
                    setPosts(formattedPosts);
                } else {
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
                        setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 2000);
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

    // Xử lý áp dụng bộ lọc
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
            const formattedPosts = response.data.map((post: APIPost) => ({
                ...post,
                mode: post.mode === 'true' ? true : false,
            }));
            setPosts(formattedPosts);
            setIsFilterOpen(false);
        } catch (error) {
            console.error('Error filtering posts:', error);
            if (error instanceof Error) {
                console.log('Error details:', (error as AxiosError).response);
            }
        } finally {
            setLoading(false);
        }
    };

    // Reset bộ lọc
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

    // Xử lý yêu thích
    const handleFavorite = (postId: number) => {
        const isFavorite = favoritePosts.includes(postId);
        if (isFavorite) {
            setFavoritePosts((prev) => prev.filter((id) => id !== postId));
            setNotification({
                message: 'Đã xóa bài đăng khỏi yêu thích',
                show: true,
                type: 'success',
            });
        } else {
            setFavoritePosts((prev) => [...prev, postId]);
            setNotification({
                message: 'Đã thêm bài đăng vào yêu thích',
                show: true,
                type: 'success',
            });
        }
        setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
    };

    // Xử lý sao chép link
    const handleCopyLink = (e: React.MouseEvent, postId: number) => {
        const x = e.clientX;
        const y = e.clientY;
        const postUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(postUrl);
        setCopyTooltip({ show: true, x, y });
        setTimeout(() => setCopyTooltip({ show: false, x: 0, y: 0 }), 1000);
    };

    // Component hiển thị văn bản đa dòng
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
                            - {time.startTime} - {time.endTime}
                        </div>
                    ))}
                </div>
            );
        }
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

    const bgColors = ['#EBF5FF', '#E6F0FD', '#F0F7FF'];

    return (
        <>
            <Helmet>
                <title>Tìm gia sư | TeachMe</title>
                <meta
                    name="description"
                    content="Khám phá các bài đăng tìm gia sư phù hợp với nhu cầu học tập của bạn."
                />
                <meta property="og:title" content="Tìm gia sư | TeachMe" />
                <meta property="og:description" content="Khám phá các bài đăng tìm gia sư phù hợp với bạn." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <section className="py-20 px-6 bg-gray-50 mt-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#1B223B] tracking-tight">
                            Các bài đăng tìm gia sư
                        </h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Khám phá danh sách các bài đăng để tìm gia sư phù hợp với bạn.
                        </p>
                    </div>

                    {/* Thanh tìm kiếm và bộ lọc */}
                    <div className="flex items-center space-x-4 mb-8">
                        <input
                            type="text"
                            placeholder="Nhập nội dung cần tìm kiếm"
                            className="p-3 rounded-lg border border-gray-300 flex-1 shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <FilterIcon
                            className="h-9 w-9 text-gray-500 cursor-pointer hover:text-[#FFC569] transition-colors"
                            onClick={() => setIsFilterOpen(true)}
                        />
                    </div>

                    {/* Thông báo */}
                    <Notification message={notification.message} show={notification.show} type={notification.type} />
                    {copyTooltip.show && (
                        <div
                            className="fixed bg-gray-800 text-white px-3 py-1 rounded text-sm z-50 shadow-lg"
                            style={{
                                left: copyTooltip.x + 10,
                                top: copyTooltip.y + 10,
                                transform: 'translate(-50%, -100%)',
                            }}
                        >
                            Đã sao chép link bài đăng
                        </div>
                    )}

                    {/* Danh sách bài đăng */}
                    {loading ? (
                        <p className="text-center text-gray-600">Đang tải bài đăng...</p>
                    ) : posts.length === 0 ? (
                        <p className="text-center text-gray-600">Không có bài đăng nào.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className="relative border p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                                    style={{ backgroundColor: bgColors[index % bgColors.length] }}
                                >
                                    <div className="absolute top-4 right-4 flex space-x-4">
                                        <HeartIcon
                                            className={`h-5 w-5 cursor-pointer transition-colors duration-200 ${
                                                favoritePosts.includes(post.id)
                                                    ? 'text-red-500 fill-current'
                                                    : 'text-gray-400'
                                            }`}
                                            onClick={() => handleFavorite(post.id)}
                                        />
                                        <CoppyLinkIcon
                                            className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-600"
                                            onClick={(e) => handleCopyLink(e, post.id)}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <img
                                            src={Avatar}
                                            alt={post.user.name}
                                            className="w-12 h-12 rounded-full shadow-sm"
                                        />
                                        <div>
                                            <p className="font-semibold text-lg text-[#1B223B]">{post.user.name}</p>
                                            <span className="text-sm text-gray-500">
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
                                    <h3 className="font-bold text-xl text-[#1B223B] mb-2">{post.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {post.subject.name} - {post.grade}
                                    </p>
                                    <div className="space-y-2">
                                        <p className="text-lg text-blue-800 font-semibold">
                                            Giá: {post.feePerSession} VNĐ/giờ
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Địa điểm: <MultiLineText locations={post.locations} />
                                        </p>
                                        <p className="text-sm text-gray-600">Số buổi/tuần: {post.sessionPerWeek}</p>
                                        <p className="text-sm text-gray-600">
                                            Hình thức: {post.mode ? 'Trực tuyến' : 'Trực tiếp'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Thời gian rảnh: <MultiLineText schedule={post.schedule} />
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Yêu cầu: </span>
                                            <MultiLineText text={post.requirements.join(', ')} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Popup bộ lọc */}
                {isFilterOpen && (
                    <div
                        className="fixed inset-0 overflow-y-auto bg-gray-700 bg-opacity-50 flex justify-center items-start z-50"
                        onClick={() => setIsFilterOpen(false)}
                    >
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-w-full my-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-[#1B223B] mb-4">Bộ lọc</h2>
                            <div className="mt-4">
                                <label className="block text-gray-700 font-bold mb-2">Môn học</label>
                                <input
                                    list="subjects"
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="Chọn hoặc nhập môn học"
                                    className="border p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none"
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
                                        className="border px-2 py-1 w-24 text-center rounded shadow-sm"
                                        value={`${minPrice.toLocaleString('vi-VN')}đ`}
                                        readOnly
                                    />
                                    <span>-</span>
                                    <input
                                        type="text"
                                        className="border px-2 py-1 w-24 text-center rounded shadow-sm"
                                        value={`${maxPrice.toLocaleString('vi-VN')}đ`}
                                        readOnly
                                    />
                                </div>
                                <div className="relative mt-2">
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
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors shadow-sm"
                                    onClick={resetFilters}
                                >
                                    Thiết lập lại
                                </button>
                                <button
                                    className="px-4 py-2 bg-[#1B223B] text-white rounded hover:bg-[#2A3349] transition-colors shadow-sm"
                                    onClick={handleApplyFilter}
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

const PostLanding = () => {
    return (
        <>
            <Header />
            <Content />
            <Footer />
        </>
    );
};

export default PostLanding;
