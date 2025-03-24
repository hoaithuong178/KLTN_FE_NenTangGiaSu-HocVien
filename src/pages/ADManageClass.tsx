import React, { useState, useEffect } from 'react';
import { Table, Form, Input, Button, Tag, Modal, Select } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { Notification } from '../components/Notification';
import TopNavbar from '../components/TopNavbar';
import NavbarAdmin from '../components/navbarAdmin';

interface Class {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    meetingLink?: string;
    status: 'active' | 'expired' | 'upcoming';
    subject: string;
    tutor: string;
    student: string;
    roomId?: number;
}

interface OnlineRoom {
    id: number;
    name: string;
    link: string;
    status: 'available' | 'in_use' | 'maintenance';
    currentClass?: number;
    lastUsed?: string;
}

const ADManageClass: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [classes, setClasses] = useState<Class[]>([
        {
            id: 1,
            name: 'Toán 12 - Luyện thi đại học',
            startTime: '2024-03-20T09:00:00',
            endTime: '2024-03-20T11:00:00',
            status: 'active',
            subject: 'Toán',
            tutor: 'Nguyễn Văn A',
            student: 'Trần Thị B',
            roomId: 1,
        },
        {
            id: 2,
            name: 'Tiếng Anh - Giao tiếp cơ bản',
            startTime: '2024-03-31T14:00:00',
            endTime: '2024-03-31T16:00:00',
            status: 'upcoming',
            subject: 'Tiếng Anh',
            tutor: 'Lê Văn C',
            student: 'Phạm Thị D',
        },
        {
            id: 3,
            name: 'Vật lý 11 - Chương 5',
            startTime: '2024-03-20T15:00:00',
            endTime: '2024-03-20T17:00:00',
            status: 'active',
            subject: 'Vật lý',
            tutor: 'Trần Văn E',
            student: 'Nguyễn Thị F',
        },
        {
            id: 4,
            name: 'Hóa học 10 - Ôn tập',
            startTime: '2024-03-18T08:00:00',
            endTime: '2024-03-18T10:00:00',
            status: 'upcoming',
            subject: 'Hóa học',
            tutor: 'Phạm Văn G',
            student: 'Lê Thị H',
        },
        {
            id: 5,
            name: 'Ngữ văn 12 - Phân tích tác phẩm',
            startTime: '2024-03-20T13:00:00',
            endTime: '2024-03-20T15:00:00',
            status: 'active',
            subject: 'Ngữ văn',
            tutor: 'Hoàng Văn I',
            student: 'Trần Thị K',
            roomId: 2,
        },
    ]);

    const [showLinkModal, setShowLinkModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [notification, setNotification] = useState<{
        message: string;
        show: boolean;
        type: 'success' | 'error';
    }>({
        message: '',
        show: false,
        type: 'success',
    });

    const [onlineRooms, setOnlineRooms] = useState<OnlineRoom[]>([
        {
            id: 1,
            name: 'Google Meet Room 1',
            link: 'https://meet.google.com/abc-defg-hij',
            status: 'in_use',
            lastUsed: '2024-03-15T10:00:00',
        },
        {
            id: 2,
            name: 'Zoom Room 1',
            link: 'https://zoom.us/j/123456789',
            status: 'in_use',
            currentClass: 1,
            lastUsed: '2024-03-16T14:00:00',
        },
    ]);

    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [roomForm] = Form.useForm();

    const [form] = Form.useForm();

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    const statusColors: Record<Class['status'], string> = {
        active: 'green',
        expired: 'red',
        upcoming: 'blue',
    };

    const statusTexts: Record<Class['status'], string> = {
        active: 'Đang diễn ra',
        expired: 'Đã diễn ra',
        upcoming: 'Sắp diễn ra',
    };

    const columns = [
        {
            title: 'Tên lớp',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (time: string) => new Date(time).toLocaleString('vi-VN'),
            width: '15%',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (time: string) => new Date(time).toLocaleString('vi-VN'),
            width: '15%',
        },
        {
            title: 'Gia sư',
            dataIndex: 'tutor',
            key: 'tutor',
            width: '15%',
        },
        {
            title: 'Học viên',
            dataIndex: 'student',
            key: 'student',
            width: '15%',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (record: Class) => {
                return <Tag color={statusColors[record.status]}>{statusTexts[record.status]}</Tag>;
            },
            width: '10%',
        },
        {
            title: 'Phòng học',
            key: 'action',
            render: (record: Class) => {
                const room = onlineRooms.find((r) => r.id === record.roomId);
                return (
                    <div className="space-x-2">
                        {room ? (
                            <>
                                <div className="text-gray-600 mb-1">{room.name}</div>
                                <Button
                                    type="link"
                                    icon={<LinkOutlined />}
                                    onClick={() => window.open(room.link, '_blank')}
                                    disabled={record.status === 'expired'}
                                >
                                    Tham gia
                                </Button>
                                <Button
                                    type="link"
                                    onClick={() => {
                                        setSelectedClass(record);
                                        form.setFieldsValue({ roomId: record.roomId });
                                        setShowLinkModal(true);
                                    }}
                                >
                                    Đổi phòng
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="link"
                                onClick={() => {
                                    setSelectedClass(record);
                                    form.resetFields();
                                    setShowLinkModal(true);
                                }}
                            >
                                Chọn phòng
                            </Button>
                        )}
                    </div>
                );
            },
            width: '10%',
        },
    ];

    const handleSubmitLink = async (values: { roomId: number }) => {
        if (!selectedClass) return;

        try {
            if (selectedClass.roomId) {
                setOnlineRooms((rooms) =>
                    rooms.map((room) =>
                        room.id === selectedClass.roomId
                            ? { ...room, status: 'available', currentClass: undefined }
                            : room,
                    ),
                );
            }

            setOnlineRooms((rooms) =>
                rooms.map((room) =>
                    room.id === values.roomId
                        ? {
                              ...room,
                              status: 'in_use',
                              currentClass: selectedClass.id,
                              lastUsed: new Date().toISOString(),
                          }
                        : room,
                ),
            );

            setClasses(classes.map((c) => (c.id === selectedClass.id ? { ...c, roomId: values.roomId } : c)));

            setNotification({
                message: 'Đã cập nhật phòng học',
                show: true,
                type: 'success',
            });
            setShowLinkModal(false);
        } catch {
            setNotification({
                message: 'Có lỗi xảy ra',
                show: true,
                type: 'error',
            });
        }
    };

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    const autoUpdateClassAndRooms = () => {
        const now = new Date().getTime();

        const updatedClasses = classes.map((c) => {
            const startTime = new Date(c.startTime).getTime();
            const endTime = new Date(c.endTime).getTime();

            if (now > endTime && c.status !== 'expired') {
                if (c.roomId) {
                    setOnlineRooms((rooms) =>
                        rooms.map((room) =>
                            room.id === c.roomId
                                ? {
                                      ...room,
                                      status: 'available',
                                      currentClass: undefined,
                                      lastUsed: new Date().toISOString(),
                                  }
                                : room,
                        ),
                    );
                }
                return { ...c, status: 'expired', roomId: undefined };
            }

            if (now < startTime) return { ...c, status: 'upcoming' };
            if (now > endTime) return { ...c, status: 'expired' };
            return { ...c, status: 'active' };
        });

        const upcomingClasses = updatedClasses
            .filter((c) => c.status === 'upcoming' && !c.roomId)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

        const availableRooms = onlineRooms
            .filter((r) => r.status === 'available')
            .sort((a, b) => new Date(a.lastUsed || '').getTime() - new Date(b.lastUsed || '').getTime());

        upcomingClasses.forEach((cls) => {
            const room = availableRooms.shift();
            if (room) {
                setOnlineRooms((rooms) =>
                    rooms.map((r) => (r.id === room.id ? { ...r, status: 'in_use', currentClass: cls.id } : r)),
                );

                updatedClasses.forEach((c) => {
                    if (c.id === cls.id) {
                        c.roomId = room.id;
                        c.meetingLink = room.link;
                    }
                });
            }
        });

        setClasses(updatedClasses as Class[]);
    };

    useEffect(() => {
        const interval = setInterval(autoUpdateClassAndRooms, 60000);
        return () => clearInterval(interval);
    }, [classes, onlineRooms]);

    const renderRoomStatus = (room: OnlineRoom) => {
        const statusConfig = {
            available: { color: 'green', text: 'Sẵn sàng' },
            in_use: { color: 'blue', text: 'Đang sử dụng' },
            maintenance: { color: 'red', text: 'Bảo trì' },
        };

        const currentClass = room.currentClass ? classes.find((c) => c.id === room.currentClass) : null;

        return (
            <div className="border rounded-lg p-4 relative">
                <Button type="text" danger className="absolute top-2 right-2" onClick={() => handleDeleteRoom(room)}>
                    ×
                </Button>
                <h3 className="font-semibold mb-2">{room.name}</h3>
                <p className="text-sm text-gray-600 break-all mb-2">{room.link}</p>
                <div className="flex flex-col gap-2">
                    <Tag color={statusConfig[room.status].color}>{statusConfig[room.status].text}</Tag>
                    {currentClass && (
                        <div className="text-sm text-gray-500">
                            Đang sử dụng: {currentClass.name}
                            <br />
                            Kết thúc: {new Date(currentClass.endTime).toLocaleString('vi-VN')}
                        </div>
                    )}
                    {room.lastUsed && room.status === 'available' && (
                        <div className="text-sm text-gray-500">
                            Sử dụng gần nhất: {new Date(room.lastUsed).toLocaleString('vi-VN')}
                        </div>
                    )}
                    <Button
                        type="link"
                        icon={<LinkOutlined />}
                        onClick={() => window.open(room.link, '_blank')}
                        disabled={room.status === 'maintenance'}
                    >
                        Mở link
                    </Button>
                </div>
            </div>
        );
    };

    const handleDeleteRoom = (room: OnlineRoom) => {
        if (room.status === 'in_use') {
            setNotification({
                message: 'Không thể xóa phòng đang sử dụng',
                show: true,
                type: 'error',
            });
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xóa phòng học',
            content: `Bạn có chắc chắn muốn xóa phòng "${room.name}"?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                setOnlineRooms((rooms) => rooms.filter((r) => r.id !== room.id));
                setNotification({
                    message: 'Đã xóa phòng học',
                    show: true,
                    type: 'success',
                });
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavbarAdmin isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />
            <div className={`transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-20'} p-4`}>
                <h1 className="text-2xl font-bold mb-6">Quản lý lớp học</h1>

                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Quản lý phòng học online</h2>
                        <Button type="primary" onClick={() => setShowAddRoomModal(true)} className="bg-blue-900">
                            Thêm phòng học
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {onlineRooms.map((room) => renderRoomStatus(room))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Danh sách lớp học</h2>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={classes
                            .filter((c) => c.status === 'active')
                            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng số ${total} lớp học đang diễn ra`,
                        }}
                    />
                </div>

                <Modal
                    title="Thêm phòng học online"
                    open={showAddRoomModal}
                    onCancel={() => {
                        setShowAddRoomModal(false);
                        roomForm.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        form={roomForm}
                        onFinish={(values) => {
                            setOnlineRooms((rooms) => [
                                ...rooms,
                                {
                                    id: Date.now(),
                                    ...values,
                                    status: 'available',
                                },
                            ]);
                            setShowAddRoomModal(false);
                            roomForm.resetFields();
                            setNotification({
                                message: 'Đã thêm phòng học mới',
                                show: true,
                                type: 'success',
                            });
                        }}
                        layout="vertical"
                    >
                        <Form.Item
                            name="name"
                            label="Tên phòng học"
                            rules={[{ required: true, message: 'Vui lòng nhập tên phòng học' }]}
                        >
                            <Input placeholder="VD: Google Meet Room 1" />
                        </Form.Item>
                        <Form.Item
                            name="link"
                            label="Link phòng học"
                            rules={[
                                { required: true, message: 'Vui lòng nhập link phòng học' },
                                { type: 'url', message: 'Link không hợp lệ' },
                            ]}
                        >
                            <Input placeholder="https://meet.google.com/..." />
                        </Form.Item>
                        <div className="flex justify-end space-x-2">
                            <Button
                                onClick={() => {
                                    setShowAddRoomModal(false);
                                    roomForm.resetFields();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" className="bg-blue-900">
                                Thêm
                            </Button>
                        </div>
                    </Form>
                </Modal>

                <Modal
                    title={`${selectedClass?.roomId ? 'Đổi' : 'Chọn'} phòng học`}
                    open={showLinkModal}
                    onCancel={() => setShowLinkModal(false)}
                    footer={null}
                >
                    <Form form={form} onFinish={handleSubmitLink} layout="vertical">
                        <Form.Item
                            name="roomId"
                            label="Phòng học"
                            rules={[{ required: true, message: 'Vui lòng chọn phòng học' }]}
                        >
                            <Select placeholder="Chọn phòng học">
                                {onlineRooms
                                    .filter((room) => room.status === 'available')
                                    .map((room) => (
                                        <Select.Option key={room.id} value={room.id}>
                                            {room.name}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        <div className="flex justify-end space-x-2">
                            <Button onClick={() => setShowLinkModal(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" className="bg-blue-900">
                                {selectedClass?.roomId ? 'Cập nhật' : 'Chọn'}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                <Notification message={notification.message} show={notification.show} type={notification.type} />
            </div>
        </div>
    );
};

export default ADManageClass;
