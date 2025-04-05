import React, { useState, useRef } from 'react';
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

    // Tạo refs cho các input
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const rePasswordRef = useRef<HTMLInputElement>(null);

    const validateForm = () => {
        // Kiểm tra tên chỉ chứa chữ cái và khoảng trắng
        const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
        if (!firstName) {
            setNotification({
                message: 'Họ tên không được để trống',
                show: true,
                type: 'error',
            });
            return false;
        }

        if (!nameRegex.test(firstName)) {
            setNotification({
                message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng',
                show: true,
                type: 'error',
            });
            return false;
        }

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

        // Phone number regex - chính xác 10 số, bắt đầu bằng số 0
        const phoneRegex = /^0\d{9}$/;
        if (!phoneNumber) {
            setNotification({
                message: 'Số điện thoại không được để trống',
                show: true,
                type: 'error',
            });
            return false;
        }

        if (!phoneRegex.test(phoneNumber)) {
            setNotification({
                message: 'Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0',
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
            // Gửi đầy đủ thông tin đăng ký để nhận OTP
            await axiosClient.post('/auth/otp-register', {
                name: firstName,
                email,
                phone: phoneNumber,
                password,
                role: isTutor ? 'TUTOR' : 'STUDENT',
            });
            setNotification({
                message: 'Vui lòng kiểm tra email để nhập mã OTP',
                show: true,
                type: 'success',
            });

            // Tạo đối tượng chứa dữ liệu cần thiết để đăng ký
            const registrationData = {
                name: firstName,
                email,
                phone: phoneNumber,
                password,
                role: isTutor ? 'TUTOR' : 'STUDENT',
            };

            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
                // Chuyển hướng sang trang OTP với dữ liệu đăng ký
                navigate('/verify-otp', {
                    state: {
                        registrationData,
                        type: 'register',
                    },
                });
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
                    onEnterPress={() => emailRef.current?.focus()}
                    required
                />
                <InputField
                    type="text"
                    title="Email Address"
                    placeholder="Enter your email"
                    errorTitle={errors.email}
                    titleColor="#1B223B"
                    onChange={(value) => setEmail(value)}
                    onEnterPress={() => phoneRef.current?.focus()}
                    inputRef={emailRef}
                    required
                />
                <InputField
                    type="text"
                    title="Phone number"
                    placeholder="Enter your phone number"
                    errorTitle={errors.phoneNumber}
                    titleColor="#1B223B"
                    onChange={(value) => setPhoneNumber(value)}
                    onEnterPress={() => passwordRef.current?.focus()}
                    inputRef={phoneRef}
                    required
                />
                <InputField
                    type="password"
                    title="Password"
                    placeholder="Enter your password"
                    errorTitle={errors.password}
                    titleColor="#1B223B"
                    onChange={(value) => setPassword(value)}
                    onEnterPress={() => rePasswordRef.current?.focus()}
                    inputRef={passwordRef}
                    required
                />
                <InputField
                    type="password"
                    title="Re-Password"
                    placeholder="Re-enter your password"
                    errorTitle={errors.rePassword}
                    titleColor="#1B223B"
                    onChange={(value) => setRePassword(value)}
                    onEnterPress={handleClickRegister}
                    inputRef={rePasswordRef}
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
                            <Link to="/faqs" className="text-[#1B223B] font-semibold hover:underline">
                                Điều khoản sử dụng
                            </Link>
                        </Text>
                    </label>
                </div>

                {/* Button */}
                <Button
                    title="Đăng ký"
                    foreColor="white"
                    backgroundColor={isAccept ? '#1E3A8A' : '#E5E7EB'}
                    hoverBackgroundColor={isAccept ? '#1E40AF' : '#E5E7EB'}
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
