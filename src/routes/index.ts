import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
<<<<<<< HEAD
import NewPassword from '../pages/NewPassword';
import VerifyOTP from '../pages/OTP';
import Register from '../pages/Register';
import NotifySuccess from '../pages/NotifySuccess';
=======
import NotFound from '../pages/NotFound';
import SignIn from '../pages/SignIn';
>>>>>>> b285398801ca8d7d8fc22ce5060ffc8a4ec7cab6

export interface IRoute {
    path: string;
    component: () => JSX.Element;
    layout?: () => JSX.Element;
}

const publicRoutes: Array<IRoute> = [
    { path: '/', component: Home },
<<<<<<< HEAD
    { path: '/register', component: Register },
    { path: '/verify-otp', component: VerifyOTP },
    { path: '/dashboard', component: Dashboard },
    { path: '/notify-success', component: NotifySuccess },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/new-password', component: NewPassword },
=======
    { path: '/sign-in', component: SignIn },
    { path: '*', component: NotFound },
>>>>>>> b285398801ca8d7d8fc22ce5060ffc8a4ec7cab6
];

const privateRoutes: Array<IRoute> = [];

export { privateRoutes, publicRoutes };
