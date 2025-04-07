import React, { useState, useEffect } from 'react';
import { Table, Switch, Input, Select, Button, Form, Modal } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Notification } from '../components/Notification';
import TopNavbar from '../components/TopNavbar';
import NavbarAdmin from '../components/NavbarAdmin';
import axiosClient from '../configs/axios.config';
import { AxiosError } from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: 'STUDENT' | 'TUTOR' | 'ADMIN';
    status: 'ACTIVE' | 'BLOCKED';
    violate: number;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}

interface SearchFormValues {
    search?: string;
    role?: 'STUDENT' | 'TUTOR' | 'ADMIN';
    status?: 'ACTIVE' | 'BLOCKED';
    violations?: string;
}

const ADManageUser: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchForm] = Form.useForm();
    const [notification, setNotification] = useState<{
        message: string;
        show: boolean;
        type: 'success' | 'error';
    }>({
        message: '',
        show: false,
        type: 'success',
    });
    const { confirm } = Modal;
    const [updateTrigger] = useState(0);
    const [forceUpdate] = useState(0);

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/users/admin');
            if (response.data) {
                console.log('First user data:', response.data[0]); // Log dữ liệu người dùng đầu tiên

                // Sắp xếp users theo violate giảm dần, sau đó theo tên (alphabet)
                const sortedUsers = [...response.data].sort((a, b) => {
                    // Sắp xếp theo violate giảm dần
                    if (b.violate !== a.violate) {
                        return b.violate - a.violate;
                    }
                    // Nếu violate bằng nhau, sắp xếp theo tên (alphabet)
                    return a.name.localeCompare(b.name);
                });

                setUsers(sortedUsers);
                console.log('Sorted users:', sortedUsers);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách người dùng';
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

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (updateTrigger > 0) {
            fetchUsers();
        }
    }, [updateTrigger]);

    const handleStatusChange = (userId: string, currentStatus: 'ACTIVE' | 'BLOCKED') => {
        const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        const actionText = newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa';

        confirm({
            title: `Xác nhận ${actionText} tài khoản`,
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc chắn muốn ${actionText} tài khoản này không?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true); // Hiển thị loading

                    // Gọi API để cập nhật trạng thái người dùng
                    await axiosClient.patch(`/users/admin/${userId}`, {
                        status: newStatus,
                    });

                    // Hiển thị thông báo thành công
                    setNotification({
                        message: `Đã ${actionText} tài khoản thành công`,
                        show: true,
                        type: 'success',
                    });

                    // Gọi lại API để lấy dữ liệu mới nhất
                    const updatedResponse = await axiosClient.get('/users/admin');
                    if (updatedResponse.data) {
                        // Sắp xếp users theo violate giảm dần, sau đó theo tên (alphabet)
                        const sortedUsers = [...updatedResponse.data].sort((a, b) => {
                            // Sắp xếp theo violate giảm dần
                            if (b.violate !== a.violate) {
                                return b.violate - a.violate;
                            }
                            // Nếu violate bằng nhau, sắp xếp theo tên (alphabet)
                            return a.name.localeCompare(b.name);
                        });

                        setUsers(sortedUsers);
                    }
                } catch (error) {
                    console.error('Error updating user status:', error);
                    if (error instanceof AxiosError) {
                        const errorMessage =
                            error.response?.data?.message || `Có lỗi xảy ra khi ${actionText} tài khoản`;
                        setNotification({
                            message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
                            show: true,
                            type: 'error',
                        });
                    }
                } finally {
                    setLoading(false); // Ẩn loading
                }
            },
        });
    };

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                const roleMap = {
                    STUDENT: 'Học viên',
                    TUTOR: 'Gia sư',
                    ADMIN: 'Quản trị viên',
                };
                return roleMap[role as keyof typeof roleMap];
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (record: User) => (
                <Switch
                    checked={record.status === 'ACTIVE'}
                    onChange={() => handleStatusChange(record.id, record.status)}
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Khóa"
                />
            ),
        },
        {
            title: 'Số lần vi phạm',
            dataIndex: 'violate',
            key: 'violate',
        },
    ];

    const handleSearch = async (values: SearchFormValues) => {
        try {
            setLoading(true);

            // Gọi API để lấy tất cả người dùng
            const response = await axiosClient.get('/users/admin');

            if (response.data) {
                let filteredUsers = [...response.data];

                // Lọc người dùng dựa trên các tiêu chí tìm kiếm
                if (values.search) {
                    const searchTerm = values.search.toLowerCase();
                    filteredUsers = filteredUsers.filter(
                        (user) =>
                            user.name.toLowerCase().includes(searchTerm) ||
                            user.email.toLowerCase().includes(searchTerm) ||
                            (user.phone && user.phone.toLowerCase().includes(searchTerm)),
                    );
                }

                if (values.role) {
                    filteredUsers = filteredUsers.filter((user) => user.role === values.role);
                }

                if (values.status) {
                    filteredUsers = filteredUsers.filter((user) => user.status === values.status);
                }

                if (values.violations) {
                    const violationCount = parseInt(values.violations);
                    if (values.violations === '3') {
                        // Nếu chọn "≥ 3"
                        filteredUsers = filteredUsers.filter((user) => user.violate >= 3);
                    } else {
                        filteredUsers = filteredUsers.filter((user) => user.violate === violationCount);
                    }
                }

                // Sắp xếp users theo violate giảm dần, sau đó theo tên (alphabet)
                const sortedUsers = [...filteredUsers].sort((a, b) => {
                    // Sắp xếp theo violate giảm dần
                    if (b.violate !== a.violate) {
                        return b.violate - a.violate;
                    }
                    // Nếu violate bằng nhau, sắp xếp theo tên (alphabet)
                    return a.name.localeCompare(b.name);
                });

                setUsers(sortedUsers);
            }
        } catch (error) {
            console.error('Error searching users:', error);
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm người dùng';
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

    const resetSearch = () => {
        searchForm.resetFields();
        fetchUsers();
    };

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    return (
        <div className="min-h-screen bg-gray-100">
            <NavbarAdmin isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />
            <div className={`transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-20'} p-4`}>
                <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

                {/* Search Form */}
                <Form form={searchForm} onFinish={handleSearch} className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item name="search" label="Tìm kiếm">
                            <Input placeholder="Tên hoặc email" prefix={<SearchOutlined />} />
                        </Form.Item>
                        <Form.Item name="role" label="Vai trò">
                            <Select placeholder="Chọn vai trò" allowClear>
                                <Select.Option value="STUDENT">Học viên</Select.Option>
                                <Select.Option value="TUTOR">Gia sư</Select.Option>
                                <Select.Option value="ADMIN">Quản trị viên</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái">
                            <Select placeholder="Chọn trạng thái" allowClear>
                                <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                                <Select.Option value="BLOCKED">Đã khóa</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="violations" label="Số lần vi phạm">
                            <Select placeholder="Chọn số lần vi phạm" allowClear>
                                <Select.Option value="0">0</Select.Option>
                                <Select.Option value="1">1</Select.Option>
                                <Select.Option value="2">2</Select.Option>
                                <Select.Option value="3">≥ 3</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={resetSearch}>Đặt lại</Button>
                        <Button type="primary" htmlType="submit" className="bg-blue-900">
                            Tìm kiếm
                        </Button>
                    </div>
                </Form>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow">
                    <Table
                        columns={columns}
                        dataSource={users}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng số ${total} người dùng`,
                        }}
                        key={forceUpdate}
                    />
                </div>

                <Notification
                    message={notification.message}
                    show={notification.show}
                    type={notification.type}
                    onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
                />
            </div>
        </div>
    );
};

export default ADManageUser;
