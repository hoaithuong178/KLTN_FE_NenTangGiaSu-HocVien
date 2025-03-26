import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from '../assets/FullLogo.png';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Xử lý click ra ngoài menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Xử lý đóng menu khi chuyển trang
    useEffect(() => {
        setShowDropdown(false);
    }, [location.pathname]);

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('token');
        // Xóa thông tin user khỏi store
        logout();
        // Chuyển về trang chủ
        navigate('/');
    };

    // Kiểm tra token hết hạn
    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const expirationTime = payload.exp * 1000; // Chuyển đổi sang milliseconds
                    if (Date.now() >= expirationTime) {
                        handleLogout();
                    }
                } catch (error) {
                    console.error('Lỗi khi kiểm tra token:', error);
                    handleLogout();
                }
            }
        };

        // Kiểm tra mỗi phút
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center bg-[#1b223b] px-8 py-4 text-white shadow-md">
            {/* Logo */}
            <div className="flex items-center">
                <img src={Logo} alt="Logo" className="h-10 w-auto object-contain" />
            </div>

            {/* Navigation */}
            <nav className="flex space-x-6">
                <Link
                    to="/"
                    className={`${
                        location.pathname === '/' ? 'text-[#ffc569]' : 'hover:text-[#ffc569]'
                    } transition-all duration-300 underline-offset-4 hover:underline`}
                >
                    Trang chủ
                </Link>
                <Link
                    to="/posts-landing"
                    className={`${
                        location.pathname === '/posts' ? 'text-[#ffc569]' : 'hover:text-[#ffc569]'
                    } transition-all duration-300 underline-offset-4 hover:underline`}
                >
                    Bài đăng
                </Link>
                <Link
                    to="/tutors-landing"
                    className={`${
                        location.pathname === '/tutors' ? 'text-[#ffc569]' : 'hover:text-[#ffc569]'
                    } transition-all duration-300 underline-offset-4 hover:underline`}
                >
                    Gia sư
                </Link>
                <Link
                    to="/faqs-landing"
                    className={`${
                        location.pathname === '/faqs' ? 'text-[#ffc569]' : 'hover:text-[#ffc569]'
                    } transition-all duration-300 underline-offset-4 hover:underline`}
                >
                    FAQs
                </Link>
                <Link
                    to="/contact"
                    className={`${
                        location.pathname === '/contact' ? 'text-[#ffc569]' : 'hover:text-[#ffc569]'
                    } transition-all duration-300 underline-offset-4 hover:underline`}
                >
                    Liên hệ
                </Link>
            </nav>

            {/* User Menu */}
            {user ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                        <span className="text-white">Xin chào {user.name}</span>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50">
                            <Link
                                to="/information"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                onClick={() => setShowDropdown(false)}
                            >
                                Thông tin cá nhân
                            </Link>
                            <Link
                                to="/dashboard"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                onClick={() => setShowDropdown(false)}
                            >
                                Chuyển đến workspace
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    className="bg-[#ffc569] text-[#1b223b] font-semibold px-4 py-2 rounded-lg border border-transparent hover:bg-[#e0aa4d] hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate('/sign-in')}
                >
                    Đăng nhập
                </button>
            )}
        </header>
    );
};

export default Header;
