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
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Kiểm tra dữ liệu cần thiết khi component mount
    useEffect(() => {
        if (!location.state || !type || !registrationData) {
            navigate('/sign-in', { replace: true });
        }
    }, [location.state, type, registrationData, navigate]);

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
                    name: registrationData.name,
                    phone: registrationData.phone,
                    password: registrationData.password,
                    role: registrationData.role,
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

    const handleSubmit = async () => {
        // Kiểm tra xem đã nhập đủ 6 số chưa
        // if (otp.some((digit) => digit === '')) {
        //     setError('Vui lòng nhập đầy đủ mã OTP');
        //     return;
        // }

        // Kiểm tra lại dữ liệu cần thiết
        if (!type || !registrationData) {
            setError('Dữ liệu không hợp lệ. Vui lòng thử lại.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            if (type === 'register') {
                // Gửi request để xác thực OTP và tạo tài khoản
                await axiosClient.post('/auth/register', {
                    ...registrationData,
                    otp: otp.join(''),
                });

                navigate('/notify-success', {
                    state: {
                        title: 'Đăng ký thành công!',
                        description: 'Bạn có thể đăng nhập ngay bây giờ.',
                        register: true,
                    },
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const errorResponse = error.response as { data?: { message?: string } };
                setError(errorResponse?.data?.message || 'Mã OTP không chính xác. Vui lòng thử lại');
            } else {
                setError('Mã OTP không chính xác. Vui lòng thử lại');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6); // Lấy 6 ký tự đầu
        const newOtp = [...otp];

        // Điền từng ký tự vào mảng OTP
        for (let i = 0; i < Math.min(6, pastedData.length); i++) {
            newOtp[i] = pastedData[i];
        }

        setOtp(newOtp);

        // Nếu đủ 6 số thì tự động submit
        if (pastedData.length >= 6) {
            handleSubmit();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const currentIndex = parseInt(e.currentTarget.id.split('-')[1]);

        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Backspace' && !otp[currentIndex]) {
            // Nếu ô hiện tại trống và nhấn Backspace
            if (currentIndex > 0) {
                const prevInput = document.getElementById(`otp-${currentIndex - 1}`);
                prevInput?.focus();
            }
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
            {/* Hiển thị lỗi nếu có */}
            {error && (
                <Text size="small" color="text-red-500" className="mb-4">
                    {error}
                </Text>
            )}
            {/* Nhập mã OTP */}
            <div className="flex space-x-4 mb-6">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-14 h-14 text-center text-lg font-bold border-2 border-blue-900 rounded-md bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={1}
                        disabled={isLoading}
                    />
                ))}
            </div>
            {/* Nút xác thực */}
            <Button
                title={isLoading ? 'Đang xử lý...' : 'Xác thực'}
                foreColor="white"
                backgroundColor="#1E3A8A"
                className="w-60 h-12 mb-4 hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isLoading || otp.some((digit) => digit === '')}
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
