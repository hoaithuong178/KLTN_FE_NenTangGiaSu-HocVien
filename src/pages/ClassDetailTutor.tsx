import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Input, Form, Upload, Rate, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import TextArea from 'antd/lib/input/TextArea';
import { ArrowLeftIcon, UploadIcon } from '../components/icons';

// Mock data giống ClassDetail.tsx
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

interface Assignment {
    id: string;
    title: string;
    content?: string;
    attachments?: string[];
    submissions?: {
        content?: string;
        files?: string[];
        feedback?: string;
        score?: number;
    }[];
}

interface AssignmentFormValues {
    title: string;
    content?: string;
    attachments?: UploadFile[];
    dueDate?: string; // thêm trường dueDate
    dueTime?: string; // thêm trường dueTime
}

const ClassDetailTutor: React.FC = () => {
    const navigate = useNavigate();
    // const { id } = useParams<{ id: string }>();
    const classDetail = mockClassDetail;
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [form] = Form.useForm();

    const handleAddAssignment = (values: AssignmentFormValues) => {
        console.log('New assignment:', values);
        setIsAddModalVisible(false);
        message.success('Đã thêm bài tập mới');
    };

    const handleSaveFeedback = () => {
        const values = form.getFieldsValue();
        console.log('Feedback saved:', values);
        setIsViewModalVisible(false);
        message.success('Đã lưu nhận xét và điểm số');
    };

    // Modal components
    const AddAssignmentModal = () => (
        <Modal
            title="Thêm Bài Tập Mới"
            open={isAddModalVisible}
            onOk={() => form.submit()}
            onCancel={() => setIsAddModalVisible(false)}
        >
            <Form form={form} onFinish={handleAddAssignment}>
                <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="content" label="Nội dung bài tập">
                    <TextArea rows={4} />
                </Form.Item>

                {/* Thêm trường chọn ngày và giờ hạn nộp */}
                <div className="flex gap-4">
                    <Form.Item
                        name="dueDate"
                        label="Ngày hạn nộp"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày hạn nộp' }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        name="dueTime"
                        label="Giờ hạn nộp"
                        rules={[{ required: true, message: 'Vui lòng chọn giờ hạn nộp' }]}
                    >
                        <Input type="time" />
                    </Form.Item>
                </div>

                <Form.Item name="attachments" label="File đính kèm">
                    <Upload>
                        <Button icon={<UploadIcon className="w-4 h-4" />}>Tải file lên</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );

    const ViewSubmissionModal = () => (
        <Modal
            title={`Bài tập: ${selectedAssignment?.title}`}
            open={isViewModalVisible}
            onOk={handleSaveFeedback}
            onCancel={() => setIsViewModalVisible(false)}
            width={800}
        >
            <div className="submission-content">
                <h3>Đề bài:</h3>
                <p>{selectedAssignment?.content}</p>

                <h3>Bài nộp của học viên:</h3>
                {selectedAssignment?.submissions?.[0]?.content && <p>{selectedAssignment.submissions[0].content}</p>}

                <Form form={form}>
                    {/* Thêm field upload bài đã sửa */}
                    <Form.Item name="correctedWork" label="Bài đã sửa">
                        <Upload>
                            <Button icon={<UploadIcon className="w-4 h-4" />}>Tải lên bài đã sửa</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="feedback" label="Nhận xét">
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item name="score" label="Điểm số">
                        <Rate count={10} />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );

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
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">{classDetail.name}</h1>
                            <p className="text-gray-600 mb-6">{classDetail.description}</p>
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

                        {/* Timeline with Assignments */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Tiến độ lớp học</h2>
                                <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                                    Thêm bài tập
                                </Button>
                            </div>
                            <div className="space-y-8">
                                {classDetail.timeline.map((session, index) => (
                                    <div key={session.id} className="relative pl-8">
                                        {index !== classDetail.timeline.length - 1 && (
                                            <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                                        )}
                                        <div
                                            className={`absolute left-0 top-2 h-6 w-6 rounded-full border-4 
                                            ${
                                                session.paymentStatus === 'Đã thanh toán'
                                                    ? 'border-blue-500 bg-white'
                                                    : 'border-gray-300 bg-gray-100'
                                            }`}
                                        ></div>

                                        <div
                                            className={`rounded-lg p-4 
                                            ${session.paymentStatus === 'Đã thanh toán' ? 'bg-white' : 'bg-gray-100'}`}
                                        >
                                            <h3
                                                className={`font-medium 
                                                ${
                                                    session.paymentStatus === 'Đã thanh toán'
                                                        ? 'text-gray-900'
                                                        : 'text-gray-500'
                                                }`}
                                            >
                                                {session.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {session.date} | {session.time}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span
                                                    className={`text-sm ${
                                                        session.paymentStatus === 'Đã thanh toán'
                                                            ? 'text-green-600'
                                                            : 'text-gray-500'
                                                    }`}
                                                >
                                                    {session.paymentStatus}
                                                </span>
                                                {session.homeworkStatus === 'Đã nộp' ? (
                                                    <Button
                                                        type="link"
                                                        onClick={() => {
                                                            setSelectedAssignment({
                                                                id: session.id.toString(),
                                                                title: session.name,
                                                                content: 'Nội dung bài tập...',
                                                                submissions: [
                                                                    {
                                                                        content: 'Bài làm của học viên...',
                                                                    },
                                                                ],
                                                            });
                                                            setIsViewModalVisible(true);
                                                        }}
                                                    >
                                                        Xem và chấm điểm
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-yellow-600">
                                                        {session.homeworkStatus}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
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

            <AddAssignmentModal />
            <ViewSubmissionModal />
        </div>
    );
};

export default ClassDetailTutor;
