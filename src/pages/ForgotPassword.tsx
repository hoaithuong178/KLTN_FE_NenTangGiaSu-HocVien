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
        <div className="absolute top-0 left-0 flex flex-col justify-center items-center bg-[#1B223B] text-white h-screen w-screen">
            {/* Tiêu đề */}
            <TitleText level={1} className="text-center mb-4" color="text-customYellow">
                Quên mật khẩu
            </TitleText>
            {/* Mô tả */}
            <Text size="medium" color="text-gray-400" className="mb-8">
                Nhập email để nhận mã xác thực
            </Text>

            {/* Email Input */}
            <InputField
                type="text"
                title="Email"
                placeholder="Enter your email to reset your password"
                errorTitle={error} // Đảm bảo lỗi sẽ được hiển thị ở đây
                titleColor="text-customYellow"
                regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                onChange={handleInputChange}
                required
                className="w-[400px]"
            />

            {/* Nút xác nhận */}
            <Button
                title="Gửi mã xác thực"
                foreColor="#1B223B"
                backgroundColor="#FFC569"
                className="w-60 h-12 mt-4"
                onClick={handleSubmit}
            />
            {/* Quay lại đăng nhập */}
            <div className="flex mt-4">
                <a href="/sign-in">
                    <Text size="small" color="text-gray-400">
                        Quay lại{'  '}
                    </Text>
                    <Text size="small" color="text-blue-500">
                        Đăng nhập
                    </Text>
                </a>
            </div>
        </div>
    );
};

export default ForgotPassword;
