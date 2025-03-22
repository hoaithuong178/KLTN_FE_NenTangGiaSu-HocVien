import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../configs/axios.config';
import { useAuthStore } from '../store/authStore';

function GoogleAuthButton() {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const data = await axiosClient.post('/auth/google', {
                token: credentialResponse.credential,
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

    const handleError = () => {
        console.error('Đăng nhập Google thất bại');
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
}

export default GoogleAuthButton;
