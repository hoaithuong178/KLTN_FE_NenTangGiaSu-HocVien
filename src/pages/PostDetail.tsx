import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../configs/axios.config';
import { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { HeartIcon, ArrowLeftIcon, ChatIcon, StarIcon } from '../components/icons';
import SEO from '../components/SEO';
import Avatar from '../assets/avatar.jpg';
import { MultiLineText } from '../components/Text';

// Interface cho dữ liệu bài viết
interface Post {
    id: string;
    title: string;
    content: string;
    subject: {
        id: string;
        name: string;
    };
    grade: string;
    locations: string[];
    schedule: string[];
    requirements: string[];
    sessionPerWeek: number;
    duration: number;
    mode: boolean;
    feePerSession: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
        userProfile?: {
            avatar?: string;
        };
        tutorProfile?: {
            rating?: number;
            experiences?: number;
        };
    };
}

// Interface cho bài viết yêu thích
interface FavoritePost {
    id: string;
    // Thêm các trường khác nếu cần
}

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [notification, setNotification] = useState<{
        message: string;
        show: boolean;
        type: 'success' | 'error';
    }>({
        message: '',
        show: false,
        type: 'success',
    });

    // Fetch dữ liệu bài viết
    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get(`/posts/${id}`);

                if (response.data) {
                    setPost({
                        ...response.data,
                        mode: String(response.data.mode).toLowerCase() === 'true',
                    });

                    // Kiểm tra xem bài viết có trong danh sách yêu thích không
                    if (user?.id) {
                        const favResponse = await axiosClient.get('/favorite-posts');
                        if (favResponse.data) {
                            const isFav = favResponse.data.some((favPost: FavoritePost) => favPost.id === id);
                            setIsFavorite(isFav);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching post detail:', error);
                if (error instanceof AxiosError) {
                    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tải chi tiết bài viết';
                    setNotification({
                        message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
                        show: true,
                        type: 'error',
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPostDetail();
        }
    }, [id, user?.id]);

    // Xử lý thêm/xóa bài viết khỏi danh sách yêu thích
    const handleFavorite = async () => {
        try {
            if (!user || !user.id) {
                setNotification({
                    message: 'Vui lòng đăng nhập để thêm bài viết vào danh sách yêu thích',
                    show: true,
                    type: 'error',
                });
                return;
            }

            if (isFavorite) {
                // Xóa khỏi danh sách yêu thích
                await axiosClient.delete(`/favorite-posts/${id}`);
                setIsFavorite(false);
                setNotification({
                    message: 'Đã xóa bài viết khỏi danh sách yêu thích',
                    show: true,
                    type: 'success',
                });
            } else {
                // Thêm vào danh sách yêu thích
                await axiosClient.post(`/favorite-posts/${id}`);
                setIsFavorite(true);
                setNotification({
                    message: 'Đã thêm bài viết vào danh sách yêu thích',
                    show: true,
                    type: 'success',
                });
            }
        } catch (error) {
            console.error('Error toggling favorite post:', error);
            setLoading(false);
            setNotification({
                message: 'Có lỗi xảy ra khi thao tác với bài viết yêu thích',
                show: true,
                type: 'error',
            });
        }
    };

    // Xử lý gửi yêu cầu dạy
    const handleSendRequest = () => {
        if (!user) {
            setNotification({
                message: 'Vui lòng đăng nhập để gửi yêu cầu dạy',
                show: true,
                type: 'error',
            });
            return;
        }

        if (user.role !== 'TUTOR') {
            setNotification({
                message: 'Chỉ gia sư mới có thể gửi yêu cầu dạy',
                show: true,
                type: 'error',
            });
            return;
        }

        // Chuyển hướng đến trang gửi yêu cầu dạy với ID bài viết
        navigate(`/send-request/${id}`);
    };

    // Xử lý nhắn tin với người đăng bài
    const handleChat = () => {
        if (!user) {
            setNotification({
                message: 'Vui lòng đăng nhập để nhắn tin',
                show: true,
                type: 'error',
            });
            return;
        }

        if (post?.user.id) {
            // Chuyển hướng đến trang chat với ID người đăng bài
            navigate(`/conversation?userId=${post.user.id}`);
        }
    };

    // Xử lý thương lượng giá
    const handleNegotiatePrice = () => {
        if (!user) {
            setNotification({
                message: 'Vui lòng đăng nhập để thương lượng giá',
                show: true,
                type: 'error',
            });
            return;
        }

        if (user.role !== 'TUTOR') {
            setNotification({
                message: 'Chỉ gia sư mới có thể thương lượng giá',
                show: true,
                type: 'error',
            });
            return;
        }

        // Chuyển hướng đến trang thương lượng giá với ID bài viết
        navigate(`/negotiate-price/${id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
                <Button
                    variant="primary"
                    onClick={() => navigate('/post')}
                    className="px-4 py-2"
                    title="Quay lại danh sách bài viết"
                >
                    Quay lại danh sách bài viết
                </Button>
            </div>
        );
    }

    return (
        <>
            <SEO title={`${post.title} - Chi tiết bài viết`} description={post.content?.substring(0, 150) || ''} />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 mb-6 hover:underline">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Quay lại
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        {/* Header: Icons */}
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
                            <div className="flex space-x-2">
                                <HeartIcon
                                    className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                                        isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                                    }`}
                                    onClick={handleFavorite}
                                />
                                <ChatIcon
                                    className="h-6 w-6 cursor-pointer text-gray-400 hover:text-blue-500"
                                    onClick={handleChat}
                                />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center mb-6">
                            <img
                                src={
                                    (post.user as { userProfile?: { avatar?: string } })?.userProfile?.avatar ||
                                    post.user?.avatar ||
                                    Avatar
                                }
                                alt={post.user?.name || 'User'}
                                className="h-10 w-10 rounded-full mr-3 object-cover"
                            />
                            <div>
                                <Link
                                    to={`/tutor/${post.user.id}`}
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    {post.user.name}
                                </Link>
                                <div className="flex items-center text-sm text-gray-500">
                                    {post.user.tutorProfile?.rating && (
                                        <div className="flex items-center mr-2">
                                            <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                                            <span className="ml-1">{post.user.tutorProfile.rating}</span>
                                        </div>
                                    )}
                                    {post.user.tutorProfile?.experiences && (
                                        <span>{post.user.tutorProfile.experiences} năm kinh nghiệm</span>
                                    )}
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

                        {/* Subject Info */}
                        <p className="text-sm text-gray-600 p-1 mb-4">
                            {post.subject?.name || 'Không có môn học'} - {post.grade || 'Không có lớp'}
                        </p>

                        {/* Main Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 mb-6">
                            <div className="col-span-1">
                                <p className="text-lg text-blue-800 font-bold">
                                    Giá: {post.feePerSession?.toLocaleString('vi-VN') || 0} {'vnđ/ giờ'}
                                </p>
                                <p className="text-sm text-gray-600 pt-2">
                                    Địa điểm:{' '}
                                    <MultiLineText locations={Array.isArray(post.locations) ? post.locations : []} />
                                </p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-sm text-gray-600">Số buổi/tuần: {post.sessionPerWeek || 0}</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Hình thức học: {post.mode ? 'Trực tuyến' : 'Trực tiếp'}
                                </p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-sm text-gray-600 mt-2">Thời lượng: {post.duration || 0} phút</p>
                                <p className="text-sm text-gray-600">
                                    Thời gian rảnh:
                                    <MultiLineText schedule={Array.isArray(post.schedule) ? post.schedule : []} />
                                </p>
                            </div>
                        </div>

                        {/* Requirements Section */}
                        {post.requirements && post.requirements.length > 0 && (
                            <div className="mt-3 p-2 bg-gray-50 rounded-md mb-6">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Yêu cầu: </span>
                                    <MultiLineText
                                        text={Array.isArray(post.requirements) ? post.requirements.join(', ') : ''}
                                    />
                                </p>
                            </div>
                        )}

                        {/* Content Section */}
                        {post.content && (
                            <div className="prose max-w-none mb-6">
                                <h3 className="font-semibold text-gray-700 mb-2">Mô tả chi tiết</h3>
                                <p className="whitespace-pre-line">{post.content}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {user?.role === 'TUTOR' && user.id !== post.user.id && (
                            <div className="mt-6 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                                <Button
                                    variant="primary"
                                    onClick={handleNegotiatePrice}
                                    className="px-4 py-3 text-lg font-semibold"
                                    title="Thương lượng giá"
                                >
                                    Thương lượng giá
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSendRequest}
                                    className="px-4 py-3 text-lg font-semibold"
                                    title="Gửi yêu cầu dạy"
                                >
                                    Gửi yêu cầu dạy
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {notification.show && (
                    <div
                        className={`fixed bottom-5 right-5 p-3 rounded-md shadow-lg ${
                            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white`}
                    >
                        <div className="flex justify-between items-center">
                            <span>{notification.message}</span>
                            <button
                                onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
                                className="ml-3 text-white"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PostDetail;
