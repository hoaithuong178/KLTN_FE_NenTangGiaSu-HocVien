import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInPic1 from '../assets/SignIn1.jpg';
import SignInPic2 from '../assets/SignIn2.jpg';
import SignInPic3 from '../assets/SignIn3.jpg';
import Facebook from '../assets/facebook.svg';
import Google from '../assets/google.svg';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import axiosClient from '../configs/axios.config';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const SignIn = () => {
    const images = [SignInPic1, SignInPic2, SignInPic3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const navigate = useNavigate();

    const handleClickSignIn = useCallback(async () => {
        const newErrors: { [key: string]: string } = {};

        if (!email) {
            newErrors.email = 'Vui lòng nhập Email!';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ!';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập Password!';
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            newErrors.password = 'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ cái và số!';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsLoading(true);

        try {
            // Gửi yêu cầu đăng nhập
            const loginResponse = await axiosClient.post('/auth/login', { email, password });
            console.log('Login Response:', loginResponse.data);

            const { accessToken } = loginResponse.data;
            if (!accessToken) throw new Error('Không nhận được accessToken từ server!');

            // Lưu token vào localStorage để duy trì đăng nhập
            localStorage.setItem('token', accessToken);

            // Gọi API lấy thông tin user
            const userResponse = await axiosClient.get('/users/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const user = userResponse.data;
            console.log('User Response:', user);

            if (!user || !user.role) throw new Error('Không lấy được thông tin người dùng!');

            // Cập nhật thông tin user vào Zustand
            useAuthStore.getState().login(user, accessToken);

            // Điều hướng theo role
            const roleRoutes: { [key: string]: string } = {
                ADMIN: '/post',
                TUTOR: '/post',
                STUDENT: '/post',
            };

            navigate(roleRoutes[user.role] || '/');
        } catch (error: unknown) {
            console.error('Login failed', error);
            if (axios.isAxiosError(error)) {
                setErrors({ general: error.response?.data?.message || 'Đăng nhập thất bại! Vui lòng thử lại.' });
            } else {
                setErrors({ general: 'Đăng nhập thất bại! Vui lòng thử lại.' });
            }
        } finally {
            setIsLoading(false);
        }
    }, [email, password, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    });
    return (
        <div className="flex h-screen bg-white">
            {/* Slide Section */}
            <div className="w-1/2 flex justify-center items-center overflow-hidden relative">
                <div
                    className="flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-96 object-contain rounded-2xl flex-shrink-0"
                        />
                    ))}
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                                index === currentImageIndex ? 'bg-[#ffc569]' : 'bg-gray-400'
                            } transition-all duration-300`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Login Form Section */}
            <div className="w-1/2 flex flex-col justify-center items-center px-10">
                <h2 className="text-3xl font-bold mb-8 text-[#1b223b]">Đăng nhập</h2>
                <form className="w-full max-w-sm">
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
                        type="password"
                        title="Password"
                        placeholder="Enter your password"
                        errorTitle={errors.password}
                        titleColor="#1B223B"
                        onChange={(value) => setPassword(value)}
                        required
                    />

                    <div className="text-right mt-4">
                        <a href="/forgot-password" className="text-sm text-[#1b223b] font-medium hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <Button
                        type="button"
                        title={isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        foreColor="#1B223B"
                        backgroundColor="#FFC569"
                        hoverForeColor="#1B223B"
                        hoverBackgroundColor="#FFB347"
                        className="w-full h-12"
                        onClick={handleClickSignIn}
                        disabled={isLoading}
                    />

                    <div className="text-center text-gray-500 my-4">hoặc</div>

                    <button className="w-full border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                        <img src={Google} alt="Google logo" className="w-6 h-6 mr-2" />
                        Đăng nhập với Google
                    </button>
                    <button className="w-full border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 flex items-center justify-center mt-2">
                        <img src={Facebook} alt="Facebook logo" className="w-6 h-6 mr-2" />
                        Đăng nhập với Facebook
                    </button>
                </form>

                <div className="text-sm text-gray-600 mt-4">
                    Chưa có tài khoản?{' '}
                    <a href="/register" className="text-[#1b223b] font-medium hover:underline">
                        Đăng ký ngay
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
