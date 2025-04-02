import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense, useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import LoadingComponent from './components/LoadingComponent';
import { publicRoutes } from './routes';
import ChatBox from './components/ChatBox';

const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

function AppContent() {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Kiểm tra đăng nhập
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    // Kiểm tra xem có hiển thị ChatBox không
    const shouldShowChatBox = () => {
        // Không hiển thị trên trang Admin (bắt đầu bằng /AD)
        if (location.pathname.includes('/admin') || location.pathname.startsWith('/AD')) {
            return false;
        }

        // Không hiển thị khi chưa đăng nhập
        if (!isLoggedIn) {
            return false;
        }

        return true;
    };

    return (
        <>
            <Suspense fallback={<LoadingComponent />}>
                <Routes>
                    {publicRoutes.map((route) => {
                        const Page = route.component;
                        const Layout = route.layout || Fragment;

                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </Suspense>

            {shouldShowChatBox() && <ChatBox />}
        </>
    );
}

function App() {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <HelmetProvider>
                <Router>
                    <AppContent />
                </Router>
            </HelmetProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
