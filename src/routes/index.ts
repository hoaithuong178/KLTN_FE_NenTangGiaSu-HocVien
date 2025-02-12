import ForgotPassword from '../pages/ForgotPassword';
import Contacts from '../pages/Contacts';
import Faqs from '../pages/Faqs';
import Home from '../pages/Home';
import NewPassword from '../pages/NewPassword';
import NotFound from '../pages/NotFound';
import NotifySuccess from '../pages/NotifySuccess';
import VerifyOTP from '../pages/OTP';
import Posts from '../pages/Posts';
import Register from '../pages/Register';
import SignIn from '../pages/SignIn';
import Tutors from '../pages/Tutors';

export interface IRoute {
    path: string;
    component: React.FC;
    layout?: React.FC;
}

const publicRoutes: Array<IRoute> = [
    { path: '/', component: Home },
    { path: '/sign-in', component: SignIn },
    { path: '/posts', component: Posts },
    { path: '/tutors', component: Tutors },
    { path: '/faqs', component: Faqs },
    { path: '/contact', component: Contacts },
    { path: '/register', component: Register },
    { path: '/verify-otp', component: VerifyOTP },
    { path: '/notify-success', component: NotifySuccess },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/new-password', component: NewPassword },
    { path: '*', component: NotFound },
];

const privateRoutes: Array<IRoute> = [];

export { privateRoutes, publicRoutes };
