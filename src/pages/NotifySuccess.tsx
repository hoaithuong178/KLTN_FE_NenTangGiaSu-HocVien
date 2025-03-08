import React from 'react';
import { Text, TitleText } from '../components/Text';
import { useLocation } from 'react-router-dom';

const NotifySuccess: React.FC = () => {
    const location = useLocation();
    const { type } = location.state || {}; // Lấy type từ state được truyền qua navigate

    const getMessage = () => {
        if (type === 'register') {
            return {
                title: 'Đăng ký thành công!',
                description: 'Bạn đã đăng ký tài khoản thành công. Bạn có thể đăng nhập để bắt đầu sử dụng dịch vụ.',
            };
        }
        if (type === 'new-password') {
            return {
                title: 'Mật khẩu đã được cập nhật thành công',
                description: 'Mật khẩu của bạn đã được thay đổi thành công. Bạn có thể đăng nhập bằng mật khẩu mới.',
            };
        }
        return {
            title: 'Thông báo',
            description: 'Hành động không xác định.',
        };
    };

    const { title, description } = getMessage();

    return (
        <div className="absolute top-0 left-0 flex flex-col justify-center items-center bg-white text-blue-900 h-screen w-screen">
            {/* Tiêu đề */}
            <TitleText level={1} className="text-center mb-4" color="text-blue-900">
                {title}
            </TitleText>
            {/* Mô tả */}
            <Text size="medium" color="text-gray-600" className="mb-8">
                {description}
            </Text>

            <div className="flex items-center space-x-1">
                {/* Quay lại Đăng nhập */}
                <Text size="small" color="text-gray-600">
                    Quay lại
                </Text>
                <a href="/login">
                    <Text size="small" color="text-blue-700" className="hover:text-blue-800 hover:underline">
                        Đăng nhập
                    </Text>
                </a>
            </div>
        </div>
    );
};

export default NotifySuccess;
