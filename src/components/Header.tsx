import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from '../assets/FullLogo.png';
const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
                    to="/faqs"
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

            {/* Login Button */}
            <button
                className="bg-[#ffc569] text-[#1b223b] font-semibold px-4 py-2 rounded-lg border border-transparent hover:bg-[#e0aa4d] hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/sign-in')}
            >
                Đăng nhập
            </button>
        </header>
    );
};

export default Header;
