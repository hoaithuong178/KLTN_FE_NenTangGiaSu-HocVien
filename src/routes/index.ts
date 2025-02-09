import Home from '../pages/Home';
import SignIn from '../pages/SignIn';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/sign-in', component: SignIn },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
