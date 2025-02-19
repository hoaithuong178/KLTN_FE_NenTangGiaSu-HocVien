import React, { useState } from 'react';
import { BellIcon } from '../components/icons';
import { Text } from '../components/Text';
import Avatar from '../assets/avatar.jpg';

interface TopNavbarProps {
    backgroundColor?: string; // Màu nền
    textColor?: string; // Màu chữ
    iconColor?: string; // Màu icon
}

const TopNavbar: React.FC<TopNavbarProps> = ({
    backgroundColor = 'white', // Mặc định là màu trangws
    textColor = 'text-[#1B223B]', // Mặc định là màu chữ trắng
    iconColor = 'text-[#1B223B]', // Mặc định là màu icon vàng
}) => {
    const [language, setLanguage] = useState<'En' | 'Vi'>('En'); // Quản lý trạng thái ngôn ngữ

    const toggleLanguage = () => {
        setLanguage(language === 'En' ? 'Vi' : 'En'); // Chuyển đổi giữa "En" và "Vi"
    };

    return (
        <div
            className={`fixed top-0 right-0 flex items-center space-x-4 ${backgroundColor} ${textColor} p-2 justify-end`}
        >
            {/* BellIcon */}
            <div className="relative cursor-pointer">
                <BellIcon className={`w-7 h-7 ${iconColor}`} /> {/* Giảm kích thước icon */}
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

            {/* Avatar người dùng */}
            <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={Avatar} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
        </div>
    );
};

export default TopNavbar;
