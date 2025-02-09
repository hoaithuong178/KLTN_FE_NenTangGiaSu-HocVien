import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import SignIn from '../pages/SignIn';

export interface IRoute {
    path: string;
    component: () => JSX.Element;
    layout?: () => JSX.Element;
}

const publicRoutes: Array<IRoute> = [
    { path: '/', component: Home },
    { path: '/sign-in', component: SignIn },
    { path: '*', component: NotFound },
];

const privateRoutes: Array<IRoute> = [];

export { privateRoutes, publicRoutes };
