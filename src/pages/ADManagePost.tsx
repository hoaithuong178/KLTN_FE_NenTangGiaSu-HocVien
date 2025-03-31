import React, { useState, useEffect } from 'react';
import { Tabs, Modal, Input, Button } from 'antd';
import NavbarAdmin from '../components/NavbarAdmin';
import TopNavbar from '../components/TopNavbar';

import axiosClient from '../configs/axios.config';
import { AxiosError } from 'axios';
import { Notification } from '../components/Notification';

interface Post {
    user: User;
    subject: Subject;
    id: string;
    grade: string;
    postTime: string;
    title: string;
    content: string;
    locations: string[];
    sessionPerWeek: number;
    duration: number;
    schedule: string[];
    requirements: string[];
    mode: boolean;
    feePerSession: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    rejects: Reject[];
}

interface Subject {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
    avatar: string;
}

interface Reject {
    id: string;
    postId: string;
    reason: string;
    createdAt: string;
}

const ADManagePost: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [notification, setNotification] = useState<{
        message: string;
        show: boolean;
        type: 'success' | 'error';
    }>({
        message: '',
        show: false,
        type: 'success',
    });
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    const fetchPostsByStatus = async (status: string) => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/posts/status/${status}`);

            if (response.data) {
                console.log(`Posts with status ${status}:`, response.data);
                setPosts(response.data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tải bài viết';
                setNotification({
                    message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
                    show: true,
                    type: 'error',
                });
            }
            setPosts([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Fetch posts when tab changes
    const handleTabChange = (activeKey: string) => {
        const statusMap: { [key: string]: string } = {
            pending: 'PENDING',
            approved: 'APPROVED',
            rejected: 'REJECTED',
        };
        fetchPostsByStatus(statusMap[activeKey]);
    };

    // Initial fetch for pending posts
    useEffect(() => {
        fetchPostsByStatus('pending');
    }, []);

    const handleApprove = async (post: Post) => {
        try {
            const response = await axiosClient.put(`/posts/${post.id}/approve`);

            if (response.status === 200) {
                setPosts(posts.map((p) => (p.id === post.id ? { ...p, status: 'APPROVED' } : p)));
                setNotification({
                    message: 'Đã duyệt bài đăng',
                    show: true,
                    type: 'success',
                });
            }
        } catch (error) {
            console.error('Error approving post:', error);
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi duyệt bài đăng';
                setNotification({
                    message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
                    show: true,
                    type: 'error',
                });
            }
        }
    };

    const handleReject = (post: Post) => {
        setSelectedPost(post);
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (!selectedPost) return;

        try {
            // TODO: Gọi API reject post
            setPosts(posts.map((p) => (p.id === selectedPost.id ? { ...p, status: 'REJECTED', rejectReason } : p)));
            setNotification({
                message: 'Đã từ chối bài đăng',
                show: true,
                type: 'success',
            });
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedPost(null);
        } catch {
            setNotification({
                message: 'Có lỗi xảy ra',
                show: true,
                type: 'error',
            });
        }
    };

    const renderPostList = (status: Post['status']) => {
        const filteredPosts = posts.filter((post) => post.status === status);

        return (
            <div className="space-y-4">
                {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-grow">
                                <h3 className="text-xl font-semibold text-[#1B223B]">{post.title}</h3>
                                <p className="text-gray-600 mt-2">{post.content}</p>
                            </div>
                            {status === 'pending' && (
                                <div className="flex space-x-2">
                                    <Button
                                        type="primary"
                                        onClick={() => handleApprove(post)}
                                        className="bg-[#1B223B] text-white hover:bg-[#2A3356]"
                                    >
                                        Duyệt
                                    </Button>
                                    <Button danger onClick={() => handleReject(post)}>
                                        Từ chối
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p>
                                    <span className="font-semibold">Môn học:</span> {post.subject.name}
                                </p>
                                <p>
                                    <span className="font-semibold">Khối lớp:</span> {post.grade}
                                </p>
                                <p>
                                    <span className="font-semibold">Học phí:</span>{' '}
                                    {post.feePerSession.toLocaleString('vi-VN')}đ/buổi
                                </p>
                                <p>
                                    <span className="font-semibold">Địa điểm:</span> {post.locations.join(', ')}
                                </p>
                                <p>
                                    <span className="font-semibold">Số buổi/tuần:</span> {post.sessionPerWeek} buổi
                                </p>
                                <p>
                                    <span className="font-semibold">Thời lượng/buổi:</span> {post.duration} giờ
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-semibold">Người đăng:</span> {post.user.name}
                                </p>
                                <p>
                                    <span className="font-semibold">Ngày đăng:</span>{' '}
                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                                <p>
                                    <span className="font-semibold">Hình thức:</span> {post.mode ? 'Online' : 'Offline'}
                                </p>
                                <p>
                                    <span className="font-semibold">Lịch học:</span>
                                </p>
                                <ul className="list-disc list-inside pl-4">
                                    {post.schedule.map((time, index) => (
                                        <li key={index}>{time}</li>
                                    ))}
                                </ul>
                                <p>
                                    <span className="font-semibold">Yêu cầu:</span>
                                </p>
                                <ul className="list-disc list-inside pl-4">
                                    {post.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {post.status === 'rejected' && post.rejects && post.rejects.length > 0 && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
                                <p className="font-semibold">Lý do từ chối:</p>
                                <ul className="list-disc list-inside pl-4">
                                    {post.rejects.map((reject) => (
                                        <li key={reject.id}>{reject.reason}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Không có bài đăng nào</div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavbarAdmin isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />
            <div className={`transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-20'} p-4`}>
                <h1 className="text-2xl font-bold mb-6">Quản lý bài đăng</h1>
                <Tabs defaultActiveKey="pending" onChange={handleTabChange}>
                    <Tabs.TabPane tab="Chờ duyệt" key="pending">
                        {loading ? <LoadingSkeleton /> : renderPostList('pending')}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Đã duyệt" key="approved">
                        {loading ? <LoadingSkeleton /> : renderPostList('approved')}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Đã từ chối" key="rejected">
                        {loading ? <LoadingSkeleton /> : renderPostList('rejected')}
                    </Tabs.TabPane>
                </Tabs>
                <Modal
                    title="Lý do từ chối"
                    open={showRejectModal}
                    onOk={confirmReject}
                    onCancel={() => {
                        setShowRejectModal(false);
                        setRejectReason('');
                        setSelectedPost(null);
                    }}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Input.TextArea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Nhập lý do từ chối (không bắt buộc)"
                        rows={4}
                    />
                </Modal>
                <Notification
                    message={notification.message}
                    show={notification.show}
                    type={notification.type}
                    onClose={() => setNotification({ ...notification, show: false })}
                />
            </div>
        </div>
    );
};

// Loading skeleton component
const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((key) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        ))}
    </div>
);

export default ADManagePost;
