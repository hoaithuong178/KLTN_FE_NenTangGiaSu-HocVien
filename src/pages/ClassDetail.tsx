import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/icons';
import { Modal, Button, Input, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadIcon, DownloadIcon } from '../components/icons';

// Mock data cho chi tiết lớp học
const mockClassDetail = {
    id: 1,
    name: 'Toán 12',
    description:
        'Khóa học Toán 12 tập trung vào các chuyên đề trọng tâm, giúp học sinh nắm vững kiến thức cơ bản và nâng cao',
    teacher: {
        id: 1,
        name: 'Nguyễn Văn A',
        avatar: 'https://via.placeholder.com/100',
        profileUrl: '/teacher/1',
    },
    contract: {
        id: 'HD001',
        status: 'Đã ký',
        date: '2024-03-15',
        amount: 2000000,
    },
    priceNegotiations: [
        {
            id: 1,
            date: '2024-03-10',
            originalPrice: 2200000,
            negotiatedPrice: 2000000,
            status: 'Đã chấp nhận',
        },
    ],
    payments: [
        {
            id: 1,
            date: '2024-03-15',
            amount: 1000000,
            status: 'Đã thanh toán',
            description: 'Thanh toán đợt 1',
        },
        {
            id: 2,
            date: '2024-04-15',
            amount: 1000000,
            status: 'Chưa thanh toán',
            description: 'Thanh toán đợt 2',
        },
    ],
    timeline: [
        {
            id: 1,
            name: 'Buổi 1: Giới thiệu tổng quan',
            date: '2024-03-20',
            time: '09:00 - 10:30',
            paymentStatus: 'Đã thanh toán',
            homeworkStatus: 'Đã nộp',
            homeworkUrl: '/homework/1',
        },
        {
            id: 2,
            name: 'Buổi 2: Hàm số và đồ thị',
            date: '2024-03-22',
            time: '09:00 - 10:30',
            paymentStatus: 'Đã thanh toán',
            homeworkStatus: 'Chưa nộp',
            homeworkUrl: '/homework/2',
        },
        {
            id: 3,
            name: 'Buổi 3: Đạo hàm',
            date: '2024-03-24',
            time: '09:00 - 10:30',
            paymentStatus: 'Chưa thanh toán',
            homeworkStatus: 'Chưa có bài tập',
            homeworkUrl: null,
        },
    ],
};

// Thêm interface cho bài tập
interface Assignment {
    id: string;
    title: string;
    content: string;
    dueDate: string;
    dueTime: string;
    attachments?: string[];
    submission?: {
        content?: string;
        files?: string[];
        submittedAt?: string;
    };
    evaluation?: {
        score: number;
        feedback: string;
        correctedFiles?: string[];
        evaluatedAt: string;
    };
}

const ClassDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const classDetail = mockClassDetail; // Trong thực tế sẽ fetch data dựa vào id

    // Log id để sử dụng (trong thực tế sẽ dùng để fetch data)
    console.log('Class ID:', id);

    const [isViewAssignmentModal, setIsViewAssignmentModal] = useState(false);
    const [isViewEvaluationModal, setIsViewEvaluationModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submissionFiles, setSubmissionFiles] = useState<UploadFile[]>([]);

    // Modal xem bài tập và nộp bài
    const ViewAssignmentModal = () => (
        <Modal
            title={selectedAssignment?.title}
            open={isViewAssignmentModal}
            onCancel={() => setIsViewAssignmentModal(false)}
            footer={[
                <Button key="cancel" onClick={() => setIsViewAssignmentModal(false)}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmitAssignment}>
                    Nộp bài
                </Button>,
            ]}
            width={800}
        >
            <div className="space-y-6">
                {/* Thông tin bài tập */}
                <div>
                    <h3 className="font-medium text-gray-900">Đề bài:</h3>
                    <p className="mt-2 text-gray-600">{selectedAssignment?.content}</p>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                    <span>
                        Hạn nộp: {selectedAssignment?.dueDate} {selectedAssignment?.dueTime}
                    </span>
                    {selectedAssignment?.submission?.submittedAt && (
                        <span>Đã nộp: {selectedAssignment.submission.submittedAt}</span>
                    )}
                </div>

                {/* Form nộp bài */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nội dung bài làm</label>
                        <Input.TextArea
                            rows={4}
                            value={submissionContent}
                            onChange={(e) => setSubmissionContent(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">File đính kèm</label>
                        <Upload fileList={submissionFiles} onChange={({ fileList }) => setSubmissionFiles(fileList)}>
                            <Button icon={<UploadIcon className="w-4 h-4" />}>Tải file lên</Button>
                        </Upload>
                    </div>
                </div>

                {/* Nút xem đánh giá nếu đã có */}
                {selectedAssignment?.evaluation && (
                    <Button
                        type="link"
                        onClick={() => {
                            setIsViewAssignmentModal(false);
                            setIsViewEvaluationModal(true);
                        }}
                    >
                        Xem đánh giá của gia sư
                    </Button>
                )}
            </div>
        </Modal>
    );

    // Modal xem đánh giá
    const ViewEvaluationModal = () => (
        <Modal
            title="Đánh giá của gia sư"
            open={isViewEvaluationModal}
            onCancel={() => setIsViewEvaluationModal(false)}
            footer={[
                <Button key="close" onClick={() => setIsViewEvaluationModal(false)}>
                    Đóng
                </Button>,
            ]}
            width={600}
        >
            {selectedAssignment?.evaluation && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Thời gian chấm:</span>
                        <span>{selectedAssignment.evaluation.evaluatedAt}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Điểm số:</span>
                        <span className="text-xl font-medium">{selectedAssignment.evaluation.score}/10</span>
                    </div>

                    <div>
                        <h3 className="text-gray-600 mb-2">Nhận xét:</h3>
                        <p className="text-gray-900">{selectedAssignment.evaluation.feedback}</p>
                    </div>

                    {selectedAssignment.evaluation.correctedFiles && (
                        <div>
                            <h3 className="text-gray-600 mb-2">Bài đã sửa:</h3>
                            <div className="space-y-2">
                                {selectedAssignment.evaluation.correctedFiles.map((file: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                    >
                                        <span>{file}</span>
                                        <Button
                                            type="link"
                                            icon={<DownloadIcon className="w-4 h-4" />}
                                            onClick={() => handleDownload(file)}
                                        >
                                            Tải về
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );

    const handleSubmitAssignment = () => {
        // Xử lý nộp bài
        console.log('Submitting:', {
            content: submissionContent,
            files: submissionFiles,
        });
        message.success('Đã nộp bài thành công');
        setIsViewAssignmentModal(false);
    };

    const handleDownload = (file: string) => {
        // Xử lý tải file
        console.log('Downloading:', file);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate('/my-class')}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        <span>Quay lại lớp học của tôi</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Class Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">{classDetail.name}</h1>
                            <p className="text-gray-600 mb-6">{classDetail.description}</p>

                            {/* Teacher Info */}
                            <div className="flex items-center space-x-4">
                                <img
                                    src={classDetail.teacher.avatar}
                                    alt={classDetail.teacher.name}
                                    className="h-12 w-12 rounded-full"
                                />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{classDetail.teacher.name}</h3>
                                    <a
                                        href={classDetail.teacher.profileUrl}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Xem trang cá nhân
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tiến độ lớp học</h2>
                            <div className="space-y-8">
                                {classDetail.timeline.map((session, index) => (
                                    <div key={session.id} className="relative pl-8">
                                        {/* Timeline line */}
                                        {index !== classDetail.timeline.length - 1 && (
                                            <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                                        )}
                                        {/* Timeline dot */}
                                        <div className="absolute left-0 top-2 h-6 w-6 rounded-full border-4 border-blue-500 bg-white"></div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-medium text-gray-900">{session.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {session.date} | {session.time}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span
                                                    className={`text-sm ${
                                                        session.paymentStatus === 'Đã thanh toán'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {session.paymentStatus}
                                                </span>
                                                <div className="flex items-center space-x-4">
                                                    {session.homeworkUrl && (
                                                        <Button
                                                            type="link"
                                                            onClick={() => {
                                                                setSelectedAssignment({
                                                                    id: session.id.toString(),
                                                                    title: session.name,
                                                                    content: 'Nội dung bài tập...',
                                                                    dueDate: '2024-03-25',
                                                                    dueTime: '23:59',
                                                                    submission: {
                                                                        content: 'Bài làm của học viên...',
                                                                        submittedAt: '2024-03-24 15:30',
                                                                    },
                                                                    evaluation: {
                                                                        score: 8,
                                                                        feedback: 'Bài làm tốt...',
                                                                        correctedFiles: ['bai_da_sua.pdf'],
                                                                        evaluatedAt: '2024-03-25 10:00',
                                                                    },
                                                                });
                                                                setIsViewAssignmentModal(true);
                                                            }}
                                                        >
                                                            Xem bài tập
                                                        </Button>
                                                    )}
                                                    <span
                                                        className={`text-sm ${
                                                            session.homeworkStatus === 'Đã nộp'
                                                                ? 'text-green-600'
                                                                : 'text-yellow-600'
                                                        }`}
                                                    >
                                                        {session.homeworkStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contract & Payment Info */}
                    <div className="space-y-8">
                        {/* Contract Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin hợp đồng</h2>
                            <div className="space-y-3">
                                <p className="flex justify-between">
                                    <span className="text-gray-600">Mã hợp đồng:</span>
                                    <span className="font-medium">{classDetail.contract.id}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className="text-green-600">{classDetail.contract.status}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">Ngày ký:</span>
                                    <span>{classDetail.contract.date}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">Tổng giá trị:</span>
                                    <span className="font-medium">
                                        {classDetail.contract.amount.toLocaleString('vi-VN')}đ
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Price Negotiations */}
                        {classDetail.priceNegotiations.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Lịch sử thương lượng giá</h2>
                                <div className="space-y-4">
                                    {classDetail.priceNegotiations.map((negotiation) => (
                                        <div key={negotiation.id} className="border-b pb-4">
                                            <p className="text-sm text-gray-500">{negotiation.date}</p>
                                            <div className="mt-2 space-y-2">
                                                <p className="flex justify-between">
                                                    <span className="text-gray-600">Giá ban đầu:</span>
                                                    <span>{negotiation.originalPrice.toLocaleString('vi-VN')}đ</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-gray-600">Giá đề xuất:</span>
                                                    <span>{negotiation.negotiatedPrice.toLocaleString('vi-VN')}đ</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-gray-600">Trạng thái:</span>
                                                    <span className="text-green-600">{negotiation.status}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment History */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Lịch sử thanh toán</h2>
                            <div className="space-y-4">
                                {classDetail.payments.map((payment) => (
                                    <div key={payment.id} className="border-b pb-4">
                                        <p className="text-sm text-gray-500">{payment.date}</p>
                                        <p className="font-medium mt-1">{payment.description}</p>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span
                                                className={`text-sm ${
                                                    payment.status === 'Đã thanh toán'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {payment.status}
                                            </span>
                                            <span className="font-medium">
                                                {payment.amount.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ViewAssignmentModal />
            <ViewEvaluationModal />
        </div>
    );
};

export default ClassDetail;
