import { lazy, ReactNode } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import UserDataDeletion from '../pages/UserDataDeletion';

const SignIn = lazy(() => import('../pages/SignIn'));
const Post = lazy(() => import('../pages/Post'));
const Tutor = lazy(() => import('../pages/Tutor'));
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
const EditProfile = lazy(() => import('../pages/EditProfile'));
const TutorProfile = lazy(() => import('../pages/TutorProfile'));
const Sitemap = lazy(() => import('../pages/Sitemap'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Blockchain = lazy(() => import('../pages/Blockchain'));
const ADManagePost = lazy(() => import('../pages/ADManagePost'));
const ADManageUser = lazy(() => import('../pages/ADManageUser'));
const ADManageClass = lazy(() => import('../pages/ADManageClass'));
const HomeLanding = lazy(() => import('../pages/HomeLanding'));
const PostDetail = lazy(() => import('../pages/PostDetail'));

export interface IRoute {
    path: string;
    component: React.FC;
    layout?: ({ children }: { children: ReactNode }) => React.ReactNode;
}

const publicRoutes: Array<IRoute> = [
    { path: '/', component: HomeLanding, layout: DefaultLayout },
    { path: '/sign-in', component: SignIn, layout: DefaultLayout },
    { path: '/post', component: Post },
    { path: '/tutors', component: Tutor },
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
    { path: '/class-detail', component: ClassDetail },
    { path: '/class-detail-tutor', component: ClassDetailTutor },
    { path: '/student-profile', component: StudentProfile },
    { path: '/edit-profile', component: EditProfile },
    { path: '/tutor-profile', component: TutorProfile },
    { path: '/tutor-profile/:id', component: TutorProfile },
    { path: '/class', component: ClassDetail },
    { path: '/sitemap', component: Sitemap },
    { path: '/blockchain', component: Blockchain },
    { path: '/admin-post', component: ADManagePost },
    { path: '/admin-user', component: ADManageUser },
    { path: '/admin-class', component: ADManageClass },
    { path: '/privacy-policy', component: PrivacyPolicy },
    { path: '/user-data-deletion', component: UserDataDeletion },
    { path: '/post-detail/:id', component: PostDetail },
    { path: '*', component: NotFound },
];

const privateRoutes: Array<IRoute> = [];

export { privateRoutes, publicRoutes };
