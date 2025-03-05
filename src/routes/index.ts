import Chat from '../pages/Chat';
import Contacts from '../pages/Contacts';
import Dashboard from '../pages/Dashboard';
import Faqs from '../pages/Faqs';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
import MyClass from '../pages/MyClass';
import NewPassword from '../pages/NewPassword';
import NotFound from '../pages/NotFound';
import NotifySuccess from '../pages/NotifySuccess';
import VerifyOTP from '../pages/OTP';
import Post from '../pages/Post';
import Register from '../pages/Register';
import SignIn from '../pages/SignIn';
import Tutor from '../pages/Tutor';
import Transaction from '../pages/Transaction';
import PostsLanding from '../pages/PostsLanding';
import Tutors from '../pages/Tutors';
import PersonalInfor from '../pages/PersonalInfor';
import TutorProfile from '../pages/TutorProfile';

export interface IRoute {
    path: string;
    component: React.FC;
    layout?: React.FC;
}

const publicRoutes: Array<IRoute> = [
    { path: '/', component: Home },
    { path: '/sign-in', component: SignIn },
    { path: '/post', component: Post },
    { path: '/tutors', component: Tutor },
    { path: '/contact', component: Contacts },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard },
    { path: '/verify-otp', component: VerifyOTP },
    { path: '/notify-success', component: NotifySuccess },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/new-password', component: NewPassword },
    { path: '/my-class', component: MyClass },
    { path: '/conservation', component: Chat },
    { path: '/dashboard', component: Dashboard },
    { path: '/transaction', component: Transaction },
    { path: '/faqs', component: Faqs },
    { path: '/personal-information', component: PersonalInfor },
    { path: '/posts-landing', component: PostsLanding },
    { path: '/tutors', component: Tutors },
    { path: '/tutor-profile', component: TutorProfile },
    { path: '*', component: NotFound },
];

const privateRoutes: Array<IRoute> = [];

export { privateRoutes, publicRoutes };
