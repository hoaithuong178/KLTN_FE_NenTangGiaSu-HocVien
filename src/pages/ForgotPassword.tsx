import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Text, TitleText } from '../components/Text';
import { InputField } from '../components/InputField';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(''); // Lưu thông báo lỗi

    const navigate = useNavigate();

    const handleInputChange = (value: string) => {
        setEmail(value);
    };

    const handleSubmit = () => {
        // Kiểm tra điều kiện lỗi khi người dùng không nhập email
        if (!email) {
            setError('Vui lòng nhập email!');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            // Kiểm tra nếu email không hợp lệ
            setError('Email không hợp lệ!');
        } else {
            // Reset lỗi khi email hợp lệ
            setError('');
            // Chuyển sang trang OTP và truyền props là 'forgot-password'
            navigate('/verify-otp', { state: { type: 'forgot-password' } });
        }
    };

    return (
        <div className="absolute top-0 left-0 flex flex-col justify-center items-center bg-white h-screen w-screen">
            {/* Tiêu đề */}
            <TitleText level={1} className="text-center mb-4" color="text-blue-900">
                Quên mật khẩu
            </TitleText>
            {/* Mô tả */}
            <Text size="medium" color="text-gray-600" className="mb-8">
                Nhập email để nhận mã xác thực
            </Text>

            {/* Email Input */}
            <InputField
                type="text"
                title="Email"
                placeholder="Enter your email to reset your password"
                errorTitle={error} // Đảm bảo lỗi sẽ được hiển thị ở đây
                titleColor="text-blue-900"
                regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                onChange={handleInputChange}
                required
                className="w-full max-w-2xl px-4"
            />

            {/* Nút xác nhận */}
            <Button
                title="Gửi mã xác thực"
                foreColor="white"
                backgroundColor="#1E3A8A"
                hoverBackgroundColor="#1E40AF"
                className="w-60 h-12 mt-4"
                onClick={handleSubmit}
            />
            {/* Quay lại đăng nhập */}
            <div className="flex mt-4">
                <a href="/sign-in" className="flex items-center space-x-1">
                    <Text size="small" color="text-gray-600">
                        Quay lại
                    </Text>
                    <Text size="small" color="text-blue-700" className="hover:text-blue-800 hover:underline">
                        Đăng nhập
                    </Text>
                </a>
            </div>
        </div>
    );
};

export default ForgotPassword;
