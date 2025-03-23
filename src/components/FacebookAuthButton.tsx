import FacebookLogin, { ProfileSuccessResponse } from '@greatsumini/react-facebook-login';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Facebook from '../assets/facebook.svg';
import axiosClient from '../configs/axios.config';
import { useAuthStore } from '../store/authStore';

const FACEBOOK_APP_ID = import.meta.env.VITE_APP_FACEBOOK_APP_ID;

const FacebookAuthButton = () => {
    const [facebookAccessToken, setFacebookAccessToken] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleProfileSuccess = async (response: ProfileSuccessResponse) => {
        try {
            const data = await axiosClient.post('/auth/facebook', {
                token: facebookAccessToken,
                response,
            });

            const { accessToken } = data.data;

            localStorage.setItem('token', data.data.accessToken);

            const userResponse = await axiosClient.get('/users/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const user = userResponse.data;
            if (!user?.role) throw new Error('Không lấy được thông tin người dùng!');

            useAuthStore.getState().login(user, accessToken);
            localStorage.setItem('token', accessToken);

            const roleRoutes: { [key: string]: string } = {
                ADMIN: '/post',
                TUTOR: '/post',
                STUDENT: '/post',
            };

            navigate(roleRoutes[user.role] || '/');
        } catch (error) {
            console.error('Lỗi xác thực:', error);
        }
    };

    return (
        <FacebookLogin
            appId={FACEBOOK_APP_ID}
            onSuccess={(response) => {
                setFacebookAccessToken(response.accessToken);
            }}
            onFail={(error) => {
                console.log('Login Failed!', error);
            }}
            onProfileSuccess={handleProfileSuccess}
            render={({ onClick }) => (
                <button
                    type="button"
                    onClick={onClick}
                    className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <img src={Facebook} alt="Facebook logo" className="w-5 h-5 mr-2" />
                    <span className="text-[#1B223B] font-medium">Đăng nhập với Facebook</span>
                </button>
            )}
        />
    );
};

export default FacebookAuthButton;
