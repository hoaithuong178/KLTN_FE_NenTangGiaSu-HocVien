import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInPic1 from '../assets/SignIn1.jpg';
import SignInPic2 from '../assets/SignIn2.jpg';
import SignInPic3 from '../assets/SignIn3.jpg';
import { Button } from '../components/Button';
import FacebookAuthButton from '../components/FacebookAuthButton';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { InputField } from '../components/InputField';
import axiosClient from '../configs/axios.config';
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
            const loginResponse = await axiosClient.post('/auth/login', { email, password });
            const { accessToken } = loginResponse.data;
            if (!accessToken) throw new Error('Không nhận được accessToken từ server!');

            const userResponse = await axiosClient.get('/users/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const user = userResponse.data;
            if (!user?.role) throw new Error('Không lấy được thông tin người dùng!');

            // Nếu là tutor, lấy thêm thông tin chi tiết
            if (user.role === 'TUTOR') {
                const tutorResponse = await axiosClient.get(`/tutors/${user.id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                user.tutorProfile = tutorResponse.data;
            }

            useAuthStore.getState().login(user, accessToken);
            localStorage.setItem('token', accessToken);

            // Chuyển hướng dựa trên role
            if (user.role === 'STUDENT') {
                navigate('/post');
            } else if (user.role === 'TUTOR') {
                navigate('/post');
            } else if (user.role === 'ADMIN') {
                navigate('/admin-post');
            } else {
                navigate('/');
            }
        } catch (error: unknown) {
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
    }, [images.length]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Slide Section */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1B223B] to-[#FFC569] p-8">
                <div
                    className="flex w-full transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div key={index} className="w-full flex-shrink-0 flex items-center justify-center">
                            <img
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className="w-3/4 h-[500px] object-cover rounded-xl shadow-lg"
                            />
                        </div>
                    ))}
                </div>
                {/* Gradient Overlay & Dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentImageIndex ? 'bg-[#FFC569] scale-125' : 'bg-white opacity-70'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Login Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-[#1B223B] mb-6 text-center">Đăng Nhập</h2>

                    {/* General Error Message */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                            {errors.general}
                        </div>
                    )}

                    <form className="space-y-6">
                        <InputField
                            type="text"
                            title="Email"
                            placeholder="Nhập email của bạn"
                            errorTitle={errors.email}
                            titleColor="#1B223B"
                            onChange={(value) => setEmail(value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC569] focus:border-transparent transition-all"
                        />
                        <InputField
                            type="password"
                            title="Mật khẩu"
                            placeholder="Nhập mật khẩu của bạn"
                            errorTitle={errors.password}
                            titleColor="#1B223B"
                            onChange={(value) => setPassword(value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC569] focus:border-transparent transition-all"
                        />

                        <div className="flex justify-end">
                            <a
                                href="/forgot-password"
                                className="text-sm text-[#1B223B] hover:text-[#FFC569] transition-colors"
                            >
                                Quên mật khẩu?
                            </a>
                        </div>

                        <Button
                            type="button"
                            title={isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                            foreColor="#1B223B"
                            backgroundColor="#FFC569"
                            hoverForeColor="#1B223B"
                            hoverBackgroundColor="#FFB347"
                            className="w-full h-12 rounded-lg font-semibold text-lg shadow-md transition-all"
                            onClick={handleClickSignIn}
                            disabled={isLoading}
                        />

                        <div className="flex items-center justify-center space-x-2">
                            <div className="h-px w-16 bg-gray-300"></div>
                            <span className="text-gray-500 text-sm">hoặc</span>
                            <div className="h-px w-16 bg-gray-300"></div>
                        </div>

                        <GoogleAuthButton />
                        <FacebookAuthButton />
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Chưa có tài khoản?{' '}
                        <a href="/register" className="text-[#FFC569] font-semibold hover:underline transition-colors">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
