import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AnalyticsIcon,
    ChatIcon,
    MyClassIcon,
    NewsIcon,
    UserIcon,
    QuestionIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    MoneyIcon,
} from '../components/icons';
import { Text } from '../components/Text';
import FullLogo from '../assets/FullLogo.png';
import SmallLogo from '../assets/SmallLogo.png';

interface NavbarProps {
    isExpanded: boolean;
    toggleNavbar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isExpanded, toggleNavbar }) => {
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

    // Hàm để kiểm tra xem mục menu nào đang được chọn
    const getLinkClass = (path: string) => {
        return location.pathname === path
            ? 'bg-blue-300 text-blue-900' // Màu nền khi active
            : 'hover:bg-blue-700/30 text-blue-100'; // Màu nền khi hover
    };

    // Hàm để lấy màu chữ cho các mục menu
    const getTextColor = (path: string) => {
        return location.pathname === path
            ? 'text-blue-900' // Màu chữ khi active
            : 'text-blue-100'; // Màu chữ mặc định
    };
    const navigate = useNavigate();
    return (
        <div
            className={`fixed h-full transition-all duration-300 bg-blue-900 text-white ${
                isExpanded ? 'w-56' : 'w-16'
            } flex flex-col`}
        >
            {/* Logo */}
            <div className={`p-4 flex justify-center items-center relative ${isExpanded ? 'h-20' : 'h-16'}`}>
                {isExpanded ? (
                    <img src={FullLogo} alt="Full Logo" className="max-h-12" onClick={() => navigate('/')} />
                ) : (
                    <img src={SmallLogo} alt="Small Logo" className="max-h-8" onClick={() => navigate('/')} />
                )}
                <button
                    onClick={toggleNavbar}
                    className="absolute top-1/2 right-[-12px] transform -translate-y-1/2 bg-blue-200 p-2 rounded-full shadow-lg hover:bg-blue-300 transition-all"
                >
                    {isExpanded ? (
                        <ArrowLeftIcon className="w-2 h-2 text-blue-900" />
                    ) : (
                        <ArrowRightIcon className="w-2 h-2 text-blue-900" />
                    )}
                </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1">
                <ul className="space-y-4">
                    <Link to="/post" className="text-decoration-none">
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 ${getLinkClass('/post')}`}
                        >
                            <NewsIcon className="w-6 h-6" />
                            {isExpanded && (
                                <Text size="medium" weight="bold" color={getTextColor('/post')}>
                                    Bài đăng
                                </Text>
                            )}
                        </li>
                    </Link>
                    <Link to="/tutors" className="text-decoration-none">
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 ${getLinkClass('/tutors')}`}
                        >
                            <UserIcon className="w-6 h-6" />
                            {isExpanded && (
                                <Text size="medium" weight="bold" color={getTextColor('/tutors')}>
                                    Gia sư
                                </Text>
                            )}
                        </li>
                    </Link>
                    <Link to="/my-class" className="text-decoration-none">
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 ${getLinkClass('/my-class')}`}
                        >
                            <MyClassIcon className="w-6 h-6" />
                            {isExpanded && (
                                <Text size="medium" weight="bold" color={getTextColor('/my-class')}>
                                    Lớp học của tôi
                                </Text>
                            )}
                        </li>
                    </Link>
                    <Link to="/conservation" className="text-decoration-none">
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 ${getLinkClass('/conservation')}`}
                        >
                            <ChatIcon className="w-6 h-6" />
                            {isExpanded && (
                                <Text size="medium" weight="bold" color={getTextColor('/conservation')}>
                                    Tin nhắn
                                </Text>
                            )}
                        </li>
                    </Link>
                    <Link to="/dashboard" className="text-decoration-none">
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 ${getLinkClass('/dashboard')}`}
                        >
                            <AnalyticsIcon className="w-6 h-6" />
                            {isExpanded && (
                                <Text size="medium" weight="bold" color={getTextColor('/dashboard')}>
                                    Thống kê
                                </Text>
                            )}
                        </li>
                    </Link>
                    <Link to="/transaction" className="text-decoration-none">
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 ${getLinkClass('/transaction')}`}
                        >
                            <MoneyIcon className="w-6 h-6" />
                            {isExpanded && (
                                <Text size="medium" weight="bold" color={getTextColor('/transaction')}>
                                    Giao dịch
                                </Text>
                            )}
                        </li>
                    </Link>
                    <Link to="/faqs" className="text-decoration-none">
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 ${getLinkClass('/faqs')}`}
                        >
                            <QuestionIcon className="w-6 h-6" />
                            {isExpanded && (
                                <Text size="medium" weight="bold" color={getTextColor('/faqs')}>
                                    FAQs
                                </Text>
                            )}
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
