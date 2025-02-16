import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Text, TitleText } from '../components/Text';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Lấy thông tin từ props navigate
    const [otp, setOtp] = useState(['', '', '', '']); // Mỗi ô nhập ký tự
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

    const handleResendOTP = () => {
        setTimer(60); // Đặt lại thời gian
        console.log('Mã xác thực mới đã được gửi.');
        // Thực hiện gửi mã OTP ở đây, ví dụ gọi API
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
        }
    };

    const handleSubmit = () => {
        const otpValue = otp.join('');
        console.log(`OTP nhập: ${otpValue}`);
        if (otpValue === '8888') {
            // Kiểm tra props, nếu là "register" thì chuyển sang trang "register-success", còn nếu là "forgot-password" thì chuyển sang "new-password"
            if (location.state?.type === 'register') {
                navigate('/notify-success', { state: { type: 'register', from: 'verify-otp' } });
            } else if (location.state?.type === 'forgot-password') {
                navigate('/new-password');
            }
        } else {
            alert('OTP không chính xác!');
        }
    };

    return (
        <div className="absolute top-0 left-0 flex flex-col justify-center items-center bg-[#1B223B] text-white h-screen w-screen">
            {/* Tiêu đề */}
            <TitleText level={1} className="text-center mb-4" color="text-customYellow">
                Xác minh
            </TitleText>
            {/* Mô tả */}
            <Text size="medium" color="text-gray-400" className="mb-8">
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
                        className="w-14 h-14 text-center text-lg font-bold border border-gray-300 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={1}
                    />
                ))}
            </div>
            {/* Nút xác thực */}
            <Button
                title="Xác thực"
                foreColor="#1B223B"
                backgroundColor="#FFC569"
                className="w-60 h-12 mb-4"
                onClick={handleSubmit}
            />
            {/* Gửi lại mã xác thực */}
            <div className="flex items-center space-x-2 mb-2">
                <button className="text-sm underline text-gray-400" onClick={handleResendOTP}>
                    Gửi lại mã xác thực
                </button>
                {/* Đồng hồ đếm ngược */}
                <Text size="small" color="text-red-500" className="font-bold">
                    {timer}s
                </Text>
            </div>
            <div className="flex margin-top-4">
                {/* Quay lại Đăng nhập */}
                <a href="/login">
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

export default VerifyOTP;
