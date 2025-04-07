import { useLocation } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import { useEffect, useState } from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        <div className="main-layout">
            {children}
            {shouldShowChatBox() && <ChatBox />}
        </div>
    );
};

export default MainLayout;
