import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { useNavigate, Link } from 'react-router-dom';
import { Notification } from '../components/Notification';
import axiosClient from '../configs/axios.config';
import { AxiosError } from 'axios';

const Register: React.FC = () => {
    const [isTutor, setIsTutor] = useState(false);
    const [isAccept, setIsAccept] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const [errors] = useState<{ [key: string]: string }>({});

    const [notification, setNotification] = useState<{
        message: string;
        show: boolean;
        type: 'success' | 'error';
    }>({
        message: '',
        show: false,
        type: 'success',
    });
    const navigate = useNavigate();

    const validateForm = () => {
        // Email regex
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            setNotification({
                message: 'Email không đúng định dạng',
                show: true,
                type: 'error',
            });
            return false;
        }

        // Phone number regex
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setNotification({
                message: 'Số điện thoại phải đủ 10 số và bắt đầu bằng số 0',
                show: true,
                type: 'error',
            });
            return false;
        }

        // Password regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
        if (!passwordRegex.test(password)) {
            setNotification({
                message: 'Mật khẩu phải từ 8-12 ký tự, bao gồm chữ hoa, chữ thường và số',
                show: true,
                type: 'error',
            });
            return false;
        }

        // Check if passwords match
        if (password !== rePassword) {
            setNotification({
                message: 'Mật khẩu nhập lại không khớp',
                show: true,
                type: 'error',
            });
            return false;
        }

        // Check if all fields are filled
        if (!firstName || !email || !phoneNumber || !password || !rePassword) {
            setNotification({
                message: 'Vui lòng điền đầy đủ thông tin',
                show: true,
                type: 'error',
            });
            return false;
        }

        // Check terms acceptance
        if (!isAccept) {
            setNotification({
                message: 'Vui lòng đồng ý với điều khoản sử dụng',
                show: true,
                type: 'error',
            });
            return false;
        }

        return true;
    };

    const handleClickRegister = async () => {
        // Hide any existing notification
        setNotification((prev) => ({ ...prev, show: false }));

        // Validate form first
        if (!validateForm()) {
            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 3000);
            return;
        }

        try {
            // Gửi đầy đủ thông tin đăng ký
            const response = await axiosClient.post('/auth/otp-register', {
                firstName,
                email,
                phoneNumber,
                password,
                role: isTutor ? 'TUTOR' : 'STUDENT', // Thêm role
            });
            setNotification({
                message: 'Đăng ký thành công, vui lòng kiểm tra email để nhập mã OTP',
                show: true,
                type: 'success',
            });

            // Log để debug
            console.log('Registration successful:', response.data);

            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
                navigate('/verify-otp', { state: { email: email } });
            }, 3000);
        } catch (error) {
            console.error('Registration error:', error); // Log lỗi để debug
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký';

                setNotification({
                    message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
                    show: true,
                    type: 'error',
                });

                setTimeout(() => {
                    setNotification((prev) => ({ ...prev, show: false }));
                }, 3000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-[#1B223B] mb-6 text-center">Đăng Ký</h2>

                {/* Input fields */}
                <InputField
                    type="text"
                    title="Họ và tên"
                    placeholder="Nhập họ và tên"
                    titleColor="#1B223B"
                    onChange={(value) => setFirstName(value)}
                    required
                />
                <InputField
                    type="text"
                    title="Email Address"
                    placeholder="Enter your email"
                    errorTitle={errors.email}
                    titleColor="#1B223B"
                    onChange={(value) => setEmail(value)}
                    required
                />
                <InputField
                    type="text"
                    title="Phone number"
                    placeholder="Enter your phone number"
                    errorTitle={errors.phoneNumber}
                    titleColor="#1B223B"
                    onChange={(value) => setPhoneNumber(value)}
                    required
                />
                <InputField
                    type="password"
                    title="Password"
                    placeholder="Enter your password"
                    errorTitle={errors.password}
                    titleColor="#1B223B"
                    onChange={(value) => setPassword(value)}
                    required
                />
                <InputField
                    type="password"
                    title="Re-Password"
                    placeholder="Re-enter your password"
                    errorTitle={errors.rePassword}
                    titleColor="#1B223B"
                    onChange={(value) => setRePassword(value)}
                    required
                />

                {/* Checkboxes */}
                <div className="flex items-center mb-2">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isTutor}
                            onChange={() => setIsTutor(!isTutor)}
                            className="mr-2 accent-[#1B223B]"
                        />
                        <Text size="small" color="text-[#1B223B]">
                            Đăng ký làm gia sư?
                        </Text>
                    </label>
                </div>
                <div className="flex items-center mb-2">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isAccept}
                            onChange={() => setIsAccept(!isAccept)}
                            className="mr-2 accent-[#1B223B]"
                        />
                        <Text size="small" color="text-[#1B223B]">
                            Tôi đồng ý với các điều khoản trong{' '}
                            <Link to="/terms" className="text-[#1B223B] font-semibold hover:underline">
                                Điều khoản sử dụng
                            </Link>
                        </Text>
                    </label>
                </div>

                {/* Button */}
                <Button
                    title="Đăng ký"
                    foreColor="white"
                    backgroundColor="bg-[#1B223B]"
                    hoverBackgroundColor="hover:bg-[#2A3356]"
                    className="w-full h-12 transition-colors rounded-lg mt-4"
                    onClick={handleClickRegister}
                    disabled={!isAccept}
                />

                {/* Login link */}
                <p className="text-center text-sm text-[#1B223B] mt-6">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-[#1B223B] font-semibold hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
            <Notification message={notification.message} show={notification.show} type={notification.type} />
        </div>
    );
};

export default Register;
