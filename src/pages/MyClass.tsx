import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { Tab } from '@headlessui/react';
import ClassCard from '../components/ClassCard';
import WeeklySchedule from '../components/WeeklySchedule';
import { SearchIcon, ArrowLeftIcon, ArrowRightIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { message } from 'antd';

type TimeSlot = 'morning' | 'afternoon' | 'evening';

// Mock data cho ClassCard và lịch học
const mockClasses = [
    {
        id: 1,
        name: 'Toán 12',
        teacherName: 'Nguyễn Văn A',
        teacherAvatar: 'https://via.placeholder.com/40',
        totalSessions: 5,
        completedSessions: 1,
        paymentStatus: 'Đã thanh toán',
        schedule: {
            dayOfWeek: 1, // Thứ 2
            timeSlot: 'morning' as TimeSlot, // Sáng
            time: '09:00 - 10:30',
            isAttendable: true,
        },
    },
    {
        id: 2,
        name: 'Tiếng anh giao tiếp',
        teacherName: 'Trần Thị B',
        teacherAvatar: 'https://via.placeholder.com/40',
        totalSessions: 4,
        completedSessions: 2,
        paymentStatus: 'Thanh toán (Hạn còn 2 ngày)',
        schedule: {
            dayOfWeek: 3, // Thứ 4
            timeSlot: 'evening' as TimeSlot, // Tối
            time: '19:00 - 20:30',
            isAttendable: true,
        },
    },
];

// Tạo dữ liệu lịch học từ mockClasses
const createScheduleData = (classes: typeof mockClasses, currentWeek: Date) => {
    const scheduleData: Record<
        string,
        {
            [key in TimeSlot]?: {
                className: string;
                time: string;
                isAttendable: boolean;
            };
        }
    > = {};

    // Lấy ngày đầu tuần (thứ 2)
    const weekStart = new Date(currentWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

    classes.forEach((classInfo) => {
        // Tính ngày học trong tuần
        const classDate = new Date(weekStart);
        classDate.setDate(weekStart.getDate() + (classInfo.schedule.dayOfWeek - 1));

        const dateKey = classDate.toISOString().split('T')[0];

        if (!scheduleData[dateKey]) {
            scheduleData[dateKey] = {};
        }

        // Gán giá trị cho timeSlot tương ứng
        const timeSlot = classInfo.schedule.timeSlot;
        scheduleData[dateKey][timeSlot] = {
            className: classInfo.name,
            time: classInfo.schedule.time,
            isAttendable: classInfo.schedule.isAttendable,
        };
    });

    return scheduleData;
};

const MyClass: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true;
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [currentWeek, setCurrentWeek] = useState(new Date());

    const scheduleData = createScheduleData(mockClasses, currentWeek);
    const tabs = ['Lớp đang học', 'Lớp đã tham gia', 'Lớp đã hủy'];

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleClassClick = () => {
        const { user } = useAuthStore.getState();

        if (user?.role === 'STUDENT') {
            navigate(`/class-detail`);
        } else if (user?.role === 'TUTOR') {
            navigate(`/class-detail-tutor`);
        } else {
            console.error('Invalid user role');
            message.error('Không có quyền truy cập');
        }
    };

    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen ">
            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <div className="flex-1 flex flex-col">
                <TopNavbar />

                {/* Fixed Search Bar */}
                <div className={`fixed top-14 z-20 w-auto ${isExpanded ? 'left-60 right-5' : 'left-20 right-5'}`}>
                    <div className="relative w-full pb-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm lớp học..."
                            className="w-full p-3 pl-10 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className={`mt-28 flex-1 px-6 py-4 ${isExpanded ? 'ml-56' : 'ml-16'} overflow-y-auto`}>
                    {/* Tabs */}
                    <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-100 p-1 mb-6">
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab}
                                    className={({ selected }) =>
                                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                                        ${
                                            selected
                                                ? 'bg-blue-900 text-white shadow'
                                                : 'text-blue-900 hover:bg-blue-200/80 hover:text-blue-900'
                                        }`
                                    }
                                >
                                    {tab}
                                </Tab>
                            ))}
                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {mockClasses.map((classInfo) => (
                                        <div
                                            key={classInfo.id}
                                            onClick={() => handleClassClick()}
                                            className="cursor-pointer"
                                        >
                                            <ClassCard classInfo={classInfo} />
                                        </div>
                                    ))}
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Lớp đã tham gia */}
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Lớp đã hủy */}
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>

                    {/* Weekly Schedule */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => {
                                    const newDate = new Date(currentWeek);
                                    newDate.setDate(currentWeek.getDate() - 7);
                                    setCurrentWeek(newDate);
                                }}
                                className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </button>
                            <h2 className="text-lg font-semibold text-blue-900">Lịch học tuần</h2>
                            <button
                                onClick={() => {
                                    const newDate = new Date(currentWeek);
                                    newDate.setDate(currentWeek.getDate() + 7);
                                    setCurrentWeek(newDate);
                                }}
                                className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                            >
                                <ArrowRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <WeeklySchedule currentWeek={currentWeek} scheduleData={scheduleData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyClass;
