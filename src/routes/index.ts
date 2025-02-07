import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
import NewPassword from '../pages/NewPassword';
import VerifyOTP from '../pages/OTP';
import Register from '../pages/Register';
import NotifySuccess from '../pages/NotifySuccess';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/register', component: Register },
    { path: '/verify-otp', component: VerifyOTP },
    { path: '/dashboard', component: Dashboard },
    { path: '/notify-success', component: NotifySuccess },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/new-password', component: NewPassword },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
