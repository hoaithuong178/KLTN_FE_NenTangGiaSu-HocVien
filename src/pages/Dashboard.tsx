import React, { useState } from 'react';
import FullLogo from '../assets/FullLogo.png';
import SmallLogo from '../assets/SmallLogo.png';
import {
    AnalyticsIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    BellIcon,
    CalendarTodayIcon,
    ChatIcon,
    HomeIcon,
    LogoutIcon,
    MyClassIcon,
    NewsIcon,
    QuestionIcon,
    SettingIcon,
    UserIcon,
} from '../components/icons';
import { Text, TitleText } from '../components/Text';
import { Button } from '../components/Button';

const Dashboard: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true); // Navbar state
    const [currentWeek, setCurrentWeek] = useState(0); // Quản lý tuần hiện tại

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    // Dữ liệu lớp học mẫu
    const classes = [
        {
            name: 'Kỹ năng sử dụng bàn phím và thiết bị văn phòng',
            code: 'DHK39519',
            time: '28/10/2024 8:00 - 10:00',
            type: 'offline',
            tutor: 'Nguyễn Văn Thắng',
        },
        {
            name: 'Lập trình hướng sự kiện với công nghệ Java',
            code: 'DKHTMT8A',
            time: '29/10/2024 10:00 - 12:00',
            type: 'online',
            tutor: 'Trần Thị Anh Thi',
        },
        {
            name: 'Toán cao cấp 1',
            code: 'DHTH194A_HL',
            time: '03/11/2024 14:00 - 16:00',
            type: 'offline',
            tutor: 'Hồ Thi Thị Phương',
        },
        // Thêm dữ liệu lớp học ở đây...
    ];

    // Chuyển đến tuần trước
    const goToPreviousWeek = () => setCurrentWeek(currentWeek - 1);

    // Chuyển đến tuần tiếp theo
    const goToNextWeek = () => setCurrentWeek(currentWeek + 1);

    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen">
            {/* Navbar */}
            <div
                className={`fixed h-full transition-all duration-300 bg-gray-800 text-white ${
                    isExpanded ? 'w-56' : 'w-16'
                } flex flex-col`}
            >
                {/* Logo */}
                <div className={`p-4 flex justify-center items-center relative ${isExpanded ? 'h-20' : 'h-16'}`}>
                    {isExpanded ? (
                        // Full logo
                        <img src={FullLogo} alt="Full Logo" className="max-h-12" />
                    ) : (
                        // Small logo
                        <img src={SmallLogo} alt="Small Logo" className="max-h-8" />
                    )}
                    {/* Toggle Button */}
                    <button
                        onClick={toggleNavbar}
                        className="absolute top-1/2 right-[-12px] transform -translate-y-1/2 bg-[#FFC569] p-2 rounded-full shadow-lg hover:bg-[#e5ac4e] transition-all"
                    >
                        {isExpanded ? (
                            <ArrowLeftIcon className="w-2 h-2 text-[#1B223B]" />
                        ) : (
                            <ArrowRightIcon className="w-2 h-2 text-[#1B223B]" />
                        )}
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1">
                    <ul className="space-y-4">
                        {/* Dashboard Menu Item */}
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 bg-[#FFC569] text-[#1B223B] cursor-pointer`}
                        >
                            <HomeIcon className="w-6 h-6 text-[#1B223B]" />
                            {isExpanded && (
                                <Text size="medium" weight="bold" color="text-[#1B223B]">
                                    Dashboard
                                </Text>
                            )}
                        </li>

                        {/* Other Menu Items */}
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <MyClassIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    Lớp học của tôi
                                </Text>
                            )}
                        </li>
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <CalendarTodayIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    Lịch
                                </Text>
                            )}
                        </li>
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <ChatIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    Tin nhắn
                                </Text>
                            )}
                        </li>
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <AnalyticsIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    Thống kê
                                </Text>
                            )}
                        </li>
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <NewsIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    Bài đăng
                                </Text>
                            )}
                        </li>
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <BellIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    Thông báo
                                </Text>
                            )}
                        </li>

                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <SettingIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    Cài đặt
                                </Text>
                            )}
                        </li>
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <QuestionIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    FAQs
                                </Text>
                            )}
                        </li>
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <UserIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    Thông tin cá nhân
                                </Text>
                            )}
                        </li>
                        <li
                            className={`flex items-center ${
                                isExpanded ? 'space-x-4' : 'justify-center'
                            } p-2 hover:bg-gray-700 cursor-pointer`}
                        >
                            <LogoutIcon className="w-6 h-6 text-[#FFC569]" />
                            {isExpanded && (
                                <Text size="medium" weight="normal" color="text-[#FFC569]">
                                    Đăng xuất
                                </Text>
                            )}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 p-6 ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                <TitleText level={1} className="text-center mb-4" color="text-customYellow">
                    Dashboard
                </TitleText>
                <div className="flex items-center justify-between mb-4">
                    <Button onClick={goToPreviousWeek} title="<<" />
                    <Button onClick={goToNextWeek} title=">>" />
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <Text size="small" color="text-gray-600">
                                {day}
                            </Text>
                            <div className="flex flex-col space-y-4">
                                {classes
                                    .filter((c) => c.time.includes(day)) // Lọc lớp học theo ngày
                                    .map((classItem, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-md ${
                                                classItem.type === 'online' ? 'bg-[#B4E1D7]' : 'bg-[#FFC689]'
                                            }`}
                                        >
                                            <Text size="small" color="text-gray-800">
                                                {classItem.name}
                                            </Text>
                                            <Text size="small" color="text-gray-600">
                                                {classItem.code}
                                            </Text>
                                            <Text size="small" color="text-gray-600">
                                                {classItem.time}
                                            </Text>
                                            <Text size="small" color="text-gray-800">
                                                {classItem.tutor}
                                            </Text>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
