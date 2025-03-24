import React, { useState, useEffect } from 'react';
import { Table, Switch, Input, Select, Button, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Notification } from '../components/Notification';
import TopNavbar from '../components/TopNavbar';
import NavbarAdmin from '../components/navbarAdmin';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'STUDENT' | 'TUTOR' | 'ADMIN';
    status: boolean; // true = active, false = locked
    violations: number;
    identityCard: string;
    address: string;
}

interface SearchFormValues {
    search?: string;
    role?: 'STUDENT' | 'TUTOR' | 'ADMIN';
    status?: 'active' | 'locked';
    violations?: string;
}

const ADManageUser: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [users, setUsers] = useState<User[]>([
        {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
            role: 'STUDENT',
            status: true,
            violations: 0,
            identityCard: '123456789012',
            address: 'Quận 1, TP.HCM',
        },
        {
            id: 2,
            name: 'Trần Thị B',
            email: 'tranthib@gmail.com',
            role: 'TUTOR',
            status: true,
            violations: 1,
            identityCard: '123456789013',
            address: 'Quận 7, TP.HCM',
        },
        // Thêm mock data...
    ]);

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

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleStatusChange = async (checked: boolean, userId: number) => {
        try {
            // TODO: Call API to update user status
            setUsers(users.map((user) => (user.id === userId ? { ...user, status: checked } : user)));
            setNotification({
                message: `Đã ${checked ? 'mở khóa' : 'khóa'} tài khoản`,
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

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: User, b: User) => a.name.localeCompare(b.name),
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
                    checked={record.status}
                    onChange={(checked) => handleStatusChange(checked, record.id)}
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Khóa"
                />
            ),
        },
        {
            title: 'Số lần vi phạm',
            dataIndex: 'violations',
            key: 'violations',
            sorter: (a: User, b: User) => a.violations - b.violations,
        },
    ];

    const handleSearch = (values: SearchFormValues) => {
        // TODO: Implement search logic with API
        console.log('Search values:', values);
    };

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 2000);
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
                            <Input placeholder="Tên, email hoặc CCCD" prefix={<SearchOutlined />} />
                        </Form.Item>
                        <Form.Item name="role" label="Vai trò">
                            <Select placeholder="Chọn vai trò">
                                <Select.Option value="STUDENT">Học viên</Select.Option>
                                <Select.Option value="TUTOR">Gia sư</Select.Option>
                                <Select.Option value="ADMIN">Quản trị viên</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value="active">Hoạt động</Select.Option>
                                <Select.Option value="locked">Đã khóa</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="violations" label="Số lần vi phạm">
                            <Select placeholder="Chọn số lần vi phạm">
                                <Select.Option value="0">0</Select.Option>
                                <Select.Option value="1">1</Select.Option>
                                <Select.Option value="2">2</Select.Option>
                                <Select.Option value="3">≥ 3</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="flex justify-end">
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
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng số ${total} người dùng`,
                        }}
                    />
                </div>

                <Notification message={notification.message} show={notification.show} type={notification.type} />
            </div>
        </div>
    );
};

export default ADManageUser;
