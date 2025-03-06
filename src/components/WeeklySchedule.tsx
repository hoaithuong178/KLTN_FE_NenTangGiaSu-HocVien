import React from 'react';

interface ClassSession {
    className: string;
    time: string;
    isAttendable: boolean;
}

interface DaySchedule {
    morning?: ClassSession;
    afternoon?: ClassSession;
    evening?: ClassSession;
}

interface WeeklyScheduleProps {
    currentWeek: Date;
    scheduleData: Record<string, DaySchedule>;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ currentWeek, scheduleData }) => {
    // Hàm lấy ngày đầu tuần (thứ 2)
    const getWeekDates = (current: Date) => {
        const week = [];
        const first = new Date(current);
        first.setDate(first.getDate() - first.getDay() + 1);

        for (let i = 0; i < 7; i++) {
            const day = new Date(first);
            day.setDate(first.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const timeSlots = ['Sáng', 'Chiều', 'Tối'];
    const weekDays = getWeekDates(currentWeek);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
        });
    };

    const getScheduleForDay = (date: Date) => {
        const key = date.toISOString().split('T')[0];
        return scheduleData[key] || {};
    };

    const renderClassSession = (session?: ClassSession) => {
        if (!session) return null;

        return (
            <div className="p-2 bg-blue-50 rounded-lg">
                <div className="font-medium text-[#1B223B]">{session.className}</div>
                <div className="text-sm text-gray-600">{session.time}</div>
                {session.isAttendable && (
                    <button className="mt-2 w-full text-sm bg-[#1B223B] text-[#FFC569] py-1 px-2 rounded hover:bg-[#5d6fb1] transition-colors">
                        Điểm danh
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-8 border-b">
                    <div className="p-3 font-medium text-gray-500 border-r">Thời gian</div>
                    {weekDays.map((date, index) => (
                        <div
                            key={index}
                            className={`p-3 text-center font-medium
                                ${
                                    date.toDateString() === new Date().toDateString()
                                        ? 'bg-blue-50 text-blue-800'
                                        : 'text-gray-700'
                                }`}
                        >
                            {formatDate(date)}
                        </div>
                    ))}
                </div>

                {/* Time slots */}
                {timeSlots.map((slot, slotIndex) => (
                    <div key={slot} className="grid grid-cols-8 border-b last:border-b-0">
                        <div className="p-3 font-medium text-gray-500 border-r">{slot}</div>
                        {weekDays.map((date, dateIndex) => {
                            const schedule = getScheduleForDay(date);
                            const session =
                                slotIndex === 0
                                    ? schedule.morning
                                    : slotIndex === 1
                                    ? schedule.afternoon
                                    : schedule.evening;

                            return (
                                <div
                                    key={dateIndex}
                                    className={`p-2 min-h-[100px] border-r last:border-r-0
                                        ${date.toDateString() === new Date().toDateString() ? 'bg-blue-50' : ''}`}
                                >
                                    {renderClassSession(session)}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklySchedule;
