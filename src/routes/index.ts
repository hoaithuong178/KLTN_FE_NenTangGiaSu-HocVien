import NotFound from '../pages/NotFound';
import NotifySuccess from '../pages/NotifySuccess';
import VerifyOTP from '../pages/OTP';
import Register from '../pages/Register';
import SignIn from '../pages/SignIn';
import Post from '../pages/Post';
import Tutor from '../pages/Tutor';
import MyClass from '../pages/MyClass';
import Chat from '../pages/Chat';
import Dashboard from '../pages/Dashboard';
import Setting from '../pages/Setting';
import Faqs from '../pages/Faqs';

export interface IRoute {
    path: string;
    component: React.FC;
    layout?: React.FC;
}

const publicRoutes: Array<IRoute> = [
    { path: '/', component: Post },
    { path: '/sign-in', component: SignIn },
    { path: '*', component: NotFound },
    { path: '/register', component: Register },
    { path: '/verify-otp', component: VerifyOTP },
    { path: '/notify-success', component: NotifySuccess },
    { path: '/tutors', component: Tutor },
    { path: '/my-class', component: MyClass },
    { path: '/conservation', component: Chat },
    { path: '/dashboard', component: Dashboard },
    { path: '/setting', component: Setting },
    { path: '/faqs', component: Faqs },
];

const privateRoutes: Array<IRoute> = [];

export { privateRoutes, publicRoutes };
