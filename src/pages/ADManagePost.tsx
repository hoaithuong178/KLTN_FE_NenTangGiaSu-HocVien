import React, { useState, useEffect } from 'react';
import { Tabs, Modal, Input, Button } from 'antd';
// import { useAuthStore } from '../store/authStore';
import NavbarAdmin from '../components/navbarAdmin';
import { Notification } from '../components/Notification';
import TopNavbar from '../components/TopNavbar';

interface Post {
    id: number;
    title: string;
    content: string;
    subject: string;
    fee: number;
    location: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    author: {
        name: string;
        email: string;
    };
    rejectReason?: string;
}

const ADManagePost: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            title: 'Cần tìm gia sư Toán lớp 12',
            content: 'Tìm gia sư dạy Toán cho học sinh lớp 12, tập trung ôn thi đại học...',
            subject: 'Toán',
            fee: 200000,
            location: 'Quận 1, TP.HCM',
            status: 'pending',
            createdAt: '2024-03-15',
            author: {
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@gmail.com',
            },
        },
        {
            id: 2,
            title: 'Tìm gia sư Tiếng Anh',
            content: 'Cần gia sư dạy Tiếng Anh giao tiếp cơ bản...',
            subject: 'Tiếng Anh',
            fee: 180000,
            location: 'Quận 7, TP.HCM',
            status: 'approved',
            createdAt: '2024-03-14',
            author: {
                name: 'Trần Thị B',
                email: 'tranthib@gmail.com',
            },
        },
        {
            id: 3,
            title: 'Tìm gia sư Vật lý',
            content: 'Tìm gia sư Vật lý lớp 11, dạy kèm tại nhà...',
            subject: 'Vật lý',
            fee: 150000,
            location: 'Quận 3, TP.HCM',
            status: 'rejected',
            createdAt: '2024-03-13',
            author: {
                name: 'Lê Văn C',
                email: 'levanc@gmail.com',
            },
            rejectReason: 'Nội dung không phù hợp với quy định',
        },
    ]);

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

    const handleApprove = async (post: Post) => {
        try {
            // TODO: Gọi API approve post
            setPosts(posts.map((p) => (p.id === post.id ? { ...p, status: 'approved' } : p)));
            setNotification({
                message: 'Đã duyệt bài đăng',
                show: true,
                type: 'success',
            });
        } catch {
            setNotification({
                message: 'Có lỗi xảy ra',
                show: true,
                type: 'error',
            });
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
            setPosts(posts.map((p) => (p.id === selectedPost.id ? { ...p, status: 'rejected', rejectReason } : p)));
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
                            <div>
                                <h3 className="text-xl font-semibold">{post.title}</h3>
                                <p className="text-gray-600">{post.content}</p>
                            </div>
                            {status === 'pending' && (
                                <div className="flex space-x-2">
                                    <Button type="primary" onClick={() => handleApprove(post)} className="bg-blue-900">
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
                                    <span className="font-semibold">Môn học:</span> {post.subject}
                                </p>
                                <p>
                                    <span className="font-semibold">Học phí:</span> {post.fee.toLocaleString()}đ/buổi
                                </p>
                                <p>
                                    <span className="font-semibold">Địa điểm:</span> {post.location}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-semibold">Người đăng:</span> {post.author.name}
                                </p>
                                <p>
                                    <span className="font-semibold">Email:</span> {post.author.email}
                                </p>
                                <p>
                                    <span className="font-semibold">Ngày đăng:</span>{' '}
                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                        {post.status === 'rejected' && post.rejectReason && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
                                <p className="font-semibold">Lý do từ chối:</p>
                                <p>{post.rejectReason}</p>
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
                <Tabs defaultActiveKey="pending">
                    <Tabs.TabPane tab="Chờ duyệt" key="pending">
                        {renderPostList('pending')}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Đã duyệt" key="approved">
                        {renderPostList('approved')}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Đã từ chối" key="rejected">
                        {renderPostList('rejected')}
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
                {/* Notification component */}
                <Notification message={notification.message} show={notification.show} type={notification.type} />
            </div>
        </div>
    );
};

export default ADManagePost;
