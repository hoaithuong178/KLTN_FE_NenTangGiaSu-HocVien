import { lazy, ReactNode } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';

const Home = lazy(() => import('../pages/Home'));
const SignIn = lazy(() => import('../pages/SignIn'));
const Post = lazy(() => import('../pages/Post'));
const Tutor = lazy(() => import('../pages/Tutor'));
const Contacts = lazy(() => import('../pages/Contacts'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const VerifyOTP = lazy(() => import('../pages/OTP'));
const NotifySuccess = lazy(() => import('../pages/NotifySuccess'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const NewPassword = lazy(() => import('../pages/NewPassword'));
const MyClass = lazy(() => import('../pages/MyClass'));
const Chat = lazy(() => import('../pages/Chat'));
const Transaction = lazy(() => import('../pages/Transaction'));
const Faqs = lazy(() => import('../pages/Faqs'));
const ClassDetail = lazy(() => import('../pages/ClassDetail'));
const ClassDetailTutor = lazy(() => import('../pages/ClassDetailTutor'));
const StudentProfile = lazy(() => import('../pages/StudentProfile'));
const PostsLanding = lazy(() => import('../pages/PostsLanding'));
const Tutors = lazy(() => import('../pages/Tutors'));
const TutorProfile = lazy(() => import('../pages/TutorProfile'));
const Sitemap = lazy(() => import('../pages/Sitemap'));
const NotFound = lazy(() => import('../pages/NotFound'));
const FaqsLanding = lazy(() => import('../pages/FaqsLanding'));

export interface IRoute {
    path: string;
    component: React.FC;
    layout?: ({ children }: { children: ReactNode }) => React.ReactNode;
}

const publicRoutes: Array<IRoute> = [
    { path: '/', component: Home, layout: DefaultLayout },
    { path: '/sign-in', component: SignIn, layout: DefaultLayout },
    { path: '/post', component: Post },
    { path: '/tutors', component: Tutor },
    { path: '/contact', component: Contacts },
    { path: '/register', component: Register },
    { path: '/verify-otp', component: VerifyOTP },
    { path: '/notify-success', component: NotifySuccess },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/new-password', component: NewPassword },
    { path: '/my-class', component: MyClass },
    { path: '/conservation', component: Chat },
    { path: '/dashboard', component: Dashboard },
    { path: '/transaction', component: Transaction },
    { path: '/faqs', component: Faqs },
    { path: '/faqs-landing', component: FaqsLanding },
    { path: '/class-detail', component: ClassDetail },
    { path: '/class-detail-tutor', component: ClassDetailTutor },
    { path: '/information', component: StudentProfile },
    { path: '/posts-landing', component: PostsLanding },
    { path: '/tutors-landing', component: Tutors },
    { path: '/tutor-profile/:id', component: TutorProfile },
    { path: '/class', component: ClassDetail },
    { path: '/sitemap', component: Sitemap },
    { path: '*', component: NotFound },
];

const privateRoutes: Array<IRoute> = [];

export { privateRoutes, publicRoutes };
