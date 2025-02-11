import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import NotifySuccess from '../pages/NotifySuccess';
import VerifyOTP from '../pages/OTP';
import Register from '../pages/Register';
import SignIn from '../pages/SignIn';

export interface IRoute {
    path: string;
    component: React.FC;
    layout?: React.FC;
}

const publicRoutes: Array<IRoute> = [
    { path: '/', component: Home },
    { path: '/sign-in', component: SignIn },
    { path: '*', component: NotFound },
    { path: '/register', component: Register },
    { path: '/verify-otp', component: VerifyOTP },
    { path: '/notify-success', component: NotifySuccess },
];

const privateRoutes: Array<IRoute> = [];

export { privateRoutes, publicRoutes };
