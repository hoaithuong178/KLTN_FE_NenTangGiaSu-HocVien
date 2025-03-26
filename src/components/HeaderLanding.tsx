import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import Logo from '../assets/FullLogo.png';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect, useRef } from 'react';

const HeaderLanding = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Xử lý scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Xử lý click ra ngoài menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Xử lý đóng menu khi chuyển trang
    useEffect(() => {
        setShowDropdown(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        navigate('/');
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src={Logo}
                            alt="Logo"
                            className={`h-10 w-auto transition-all duration-300 ${
                                isScrolled ? 'scale-90' : 'scale-100'
                            }`}
                        />
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <ScrollLink
                            to="subjects"
                            spy={true}
                            smooth={true}
                            offset={-80}
                            duration={800}
                            activeClass="text-[#FFC569]"
                            className={`${
                                isScrolled ? 'text-[#1B223B]' : 'text-white'
                            } hover:text-[#FFC569] transition-colors duration-300 font-medium cursor-pointer`}
                        >
                            Môn học
                        </ScrollLink>
                        <ScrollLink
                            to="tutors"
                            spy={true}
                            smooth={true}
                            offset={-80}
                            duration={800}
                            activeClass="text-[#FFC569]"
                            className={`${
                                isScrolled ? 'text-[#1B223B]' : 'text-white'
                            } hover:text-[#FFC569] transition-colors duration-300 font-medium cursor-pointer`}
                        >
                            Gia sư
                        </ScrollLink>
                        <ScrollLink
                            to="process"
                            spy={true}
                            smooth={true}
                            offset={-80}
                            duration={800}
                            activeClass="text-[#FFC569]"
                            className={`${
                                isScrolled ? 'text-[#1B223B]' : 'text-white'
                            } hover:text-[#FFC569] transition-colors duration-300 font-medium cursor-pointer`}
                        >
                            Quy trình
                        </ScrollLink>
                        <ScrollLink
                            to="reviews"
                            spy={true}
                            smooth={true}
                            offset={-80}
                            duration={800}
                            activeClass="text-[#FFC569]"
                            className={`${
                                isScrolled ? 'text-[#1B223B]' : 'text-white'
                            } hover:text-[#FFC569] transition-colors duration-300 font-medium cursor-pointer`}
                        >
                            Đánh giá
                        </ScrollLink>
                        <ScrollLink
                            to="contact"
                            spy={true}
                            smooth={true}
                            offset={-80}
                            duration={800}
                            activeClass="text-[#FFC569]"
                            className={`${
                                isScrolled ? 'text-[#1B223B]' : 'text-white'
                            } hover:text-[#FFC569] transition-colors duration-300 font-medium cursor-pointer`}
                        >
                            Liên hệ
                        </ScrollLink>
                    </nav>

                    {/* User Menu */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className={`flex items-center space-x-2 transition-all duration-300 ${
                                    isScrolled ? 'text-[#1B223B]' : 'text-white'
                                }`}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <img
                                    src={user.avatar}
                                    alt="Avatar"
                                    className="h-10 w-10 rounded-full object-cover border-2 border-[#FFC569]"
                                />
                                <span className="font-medium">Xin chào {user.name}</span>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 animate-fade-in">
                                    <Link
                                        to="/information"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Thông tin cá nhân
                                    </Link>
                                    <Link
                                        to="/post"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Chuyển đến workspace
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <button
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    isScrolled
                                        ? 'bg-[#1B223B] text-white hover:bg-[#2A3349]'
                                        : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#1B223B]'
                                }`}
                                onClick={() => navigate('/sign-in')}
                            >
                                Đăng nhập
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg font-medium bg-[#FFC569] text-[#1B223B] hover:bg-[#FFB347] transition-all duration-300"
                                onClick={() => navigate('/register')}
                            >
                                Đăng ký
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HeaderLanding;
