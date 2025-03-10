import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Text, TitleText } from '../components/Text';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../configs/axios.config';

const VerifyOTP: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { registrationData, type } = location.state || {};
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Mỗi ô nhập ký tự
    const [timer, setTimer] = useState(60); // Đồng hồ đếm ngược

    useEffect(() => {
        // Bắt đầu đếm ngược khi vào trang
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Cleanup để tránh bị chạy nhiều lần khi component bị unmount
        return () => clearInterval(countdown);
    }, [timer]);

    const handleResendOTP = async () => {
        try {
            if (type === 'register' && registrationData?.email) {
                // Gửi lại OTP bất cứ khi nào
                await axiosClient.post('/auth/otp-register', {
                    email: registrationData.email,
                });
                // Reset OTP inputs
                setOtp(['', '', '', '', '', '']);
                // Reset timer
                setTimer(60);
            }
        } catch (error: unknown) {
            console.error('Error resending OTP:', error);
        }
    };

    const handleChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const updatedOtp = [...otp];
            updatedOtp[index] = value;
            setOtp(updatedOtp);

            // Tự động chuyển sang ô tiếp theo nếu nhập
            if (value && index < otp.length - 1) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
            // Tự động submit khi nhập xong ô cuối cùng
            if (value && index === otp.length - 1) {
                handleSubmit();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Submit khi nhấn Enter ở bất kỳ ô nào
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            if (type === 'register') {
                const finalRegistrationData = {
                    ...registrationData,
                    otp: otp.join(''),
                };

                await axiosClient.post('/auth/register', finalRegistrationData);

                navigate('/notify-success', {
                    state: {
                        title: 'Đăng ký thành công!',
                        description: 'Bạn có thể đăng nhập ngay bây giờ.',
                        register: true,
                    },
                });
            }
        } catch (error: unknown) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="absolute top-0 left-0 flex flex-col justify-center items-center bg-white h-screen w-screen">
            {/* Tiêu đề */}
            <TitleText level={1} className="text-center mb-4" color="text-blue-900">
                Xác minh
            </TitleText>
            {/* Mô tả */}
            <Text size="medium" color="text-gray-600" className="mb-8">
                Mã xác thực đã được gửi đến email của bạn
            </Text>
            {/* Nhập mã OTP */}
            <div className="flex space-x-4 mb-6">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                        className="w-14 h-14 text-center text-lg font-bold border-2 border-blue-900 rounded-md bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={1}
                    />
                ))}
            </div>
            {/* Nút xác thực */}
            <Button
                title="Xác thực"
                foreColor="white"
                backgroundColor="#1E3A8A"
                className="w-60 h-12 mb-4 hover:bg-blue-800 transition-colors"
                onClick={handleSubmit}
            />
            {/* Gửi lại mã xác thực */}
            <div className="flex items-center space-x-2 mb-2">
                <button
                    className="text-sm text-blue-700 hover:text-blue-800 hover:underline transition-colors"
                    onClick={handleResendOTP}
                >
                    Gửi lại mã xác thực
                </button>
                {/* Đồng hồ đếm ngược */}
                <Text size="small" color="text-red-500" className="font-bold">
                    {timer}s
                </Text>
            </div>
            <div className="flex items-center space-x-1">
                {/* Quay lại Đăng nhập */}
                <Text size="small" color="text-gray-600">
                    Quay lại
                </Text>
                <a href="/sign-in">
                    <Text size="small" color="text-blue-700" className="hover:text-blue-800 hover:underline">
                        Đăng nhập
                    </Text>
                </a>
            </div>
        </div>
    );
};

export default VerifyOTP;
