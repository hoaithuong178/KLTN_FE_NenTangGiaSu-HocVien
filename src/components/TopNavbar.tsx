import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, UserIcon, LogoutIcon, NewsIcon } from '../components/icons'; // Thêm icon mới
import { Text } from '../components/Text';
import Avatar from '../assets/avatar.jpg';

interface TopNavbarProps {
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
    backgroundColor = 'white',
    textColor = 'text-[#1B223B]',
    iconColor = 'text-[#1B223B]',
}) => {
    const [language, setLanguage] = useState<'En' | 'Vi'>('En');
    const [dropdownOpen, setDropdownOpen] = useState(false); // State cho dropdown
    const navigate = useNavigate();

    const toggleLanguage = () => {
        setLanguage(language === 'En' ? 'Vi' : 'En');
    };

    const handleLogout = () => {
        // Thêm logic đăng xuất tại đây (xóa token, clear state, vv.)
        navigate('/'); // Chuyển về trang Home
    };

    return (
        <div
            className={`fixed top-0 right-0 flex items-center space-x-4 ${backgroundColor} ${textColor} p-2 justify-end`}
        >
            {/* BellIcon */}
            <div className="relative cursor-pointer">
                <BellIcon className={`w-7 h-7 ${iconColor}`} />
                <div className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full" />
            </div>

            {/* Button chuyển ngôn ngữ */}
            <button
                onClick={toggleLanguage}
                className="bg-[#FFC569] text-[#1B223B] py-1 px-3 rounded-full hover:bg-[#e5ac4e] transition-all"
            >
                <Text size="small" weight="bold" color="text-[#1B223B]">
                    {language}
                </Text>
            </button>

            {/* Avatar + Dropdown */}
            <div className="relative">
                <div
                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <img src={Avatar} alt="User Avatar" className="w-full h-full object-cover" />
                </div>

                {/* Dropdown menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                        <button
                            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100"
                            onClick={() => navigate('/personal-information')}
                        >
                            <UserIcon className="w-5 h-5 mr-2 text-gray-700" />
                            <span>Thông tin cá nhân</span>
                        </button>
                        <button
                            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100"
                            onClick={() => navigate('/')}
                        >
                            <NewsIcon className="w-5 h-5 mr-2 text-gray-700" />
                            <span>Bài viết yêu thích</span>
                        </button>
                        <button
                            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100"
                            onClick={() => navigate('/')}
                        >
                            <UserIcon className="w-5 h-5 mr-2 text-gray-700" />
                            <span>Gia sư yêu thích</span>
                        </button>
                        <button
                            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
                            onClick={handleLogout}
                        >
                            <LogoutIcon className="w-5 h-5 mr-2" />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopNavbar;
