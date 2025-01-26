import Contacts from '../pages/Contacts';
import Faqs from '../pages/Faqs';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Posts from '../pages/Posts';
import SignIn from '../pages/SignIn';
import Tutors from '../pages/Tutors';

export interface IRoute {
    path: string;
    component: () => JSX.Element;
    layout?: () => JSX.Element;
}

const publicRoutes: Array<IRoute> = [
    { path: '/', component: Home },
    { path: '/sign-in', component: SignIn },
    { path: '/posts', component: Posts },
    { path: '/tutors', component: Tutors },
    { path: '/faqs', component: Faqs },
    { path: '/contact', component: Contacts },
    { path: '*', component: NotFound },
];

const privateRoutes: Array<IRoute> = [];

export { privateRoutes, publicRoutes };
