import React, { useState, useEffect } from 'react';

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

export interface TimeSlot {
    day: string;
    startHour: string;
    startMinute: string;
    endHour: string;
    endMinute: string;
    isSelected: boolean;
}

interface TimeSlotSelectorProps {
    availableSlots: string[];
    sessionPerWeek: number;
    onSlotsChange: (slots: TimeSlot[]) => void;
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
                    <button className="w-full bg-blue-900 font-bold text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
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

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
    availableSlots,
    sessionPerWeek,
    onSlotsChange,
}) => {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedTimeStrings, setSelectedTimeStrings] = useState<string[]>([]);

    // const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    useEffect(() => {
        // Parse available slots from string format
        const parsedSlots = availableSlots.map((slot) => {
            const parts = slot.split(' ');
            const day = parts.slice(0, 2).join(' ');
            const timeRange = parts.slice(2).join(' ');
            const [startTime, endTime] = timeRange.split('-');
            const [startHour, startMinute] = startTime.split(':');
            const [endHour, endMinute] = endTime.split(':');

            return {
                day,
                startHour,
                startMinute,
                endHour,
                endMinute,
                isSelected: false,
            };
        });
        setTimeSlots(parsedSlots);
    }, [availableSlots]);

    const handleTimeChange = (index: number, field: keyof TimeSlot, value: string) => {
        const updatedSlots = timeSlots.map((slot, idx) => {
            if (idx === index) {
                return { ...slot, [field]: value };
            }
            return slot;
        });
        setTimeSlots(updatedSlots);

        // Update selected time strings
        const selectedStrings = updatedSlots
            .filter((slot) => slot.isSelected)
            .map((slot) => `${slot.day} ${slot.startHour}:${slot.startMinute}-${slot.endHour}:${slot.endMinute}`);
        setSelectedTimeStrings(selectedStrings);

        // Notify parent component
        onSlotsChange(updatedSlots.filter((slot) => slot.isSelected));
    };

    const handleCheckboxChange = (index: number) => {
        const updatedSlots = timeSlots.map((slot, idx) => {
            if (idx === index) {
                return { ...slot, isSelected: !slot.isSelected };
            }
            return slot;
        });

        const selectedCount = updatedSlots.filter((slot) => slot.isSelected).length;
        if (selectedCount <= sessionPerWeek) {
            setTimeSlots(updatedSlots);

            // Update selected time strings
            const selectedStrings = updatedSlots
                .filter((slot) => slot.isSelected)
                .map((slot) => `${slot.day} ${slot.startHour}:${slot.startMinute}-${slot.endHour}:${slot.endMinute}`);
            setSelectedTimeStrings(selectedStrings);

            // Notify parent component
            onSlotsChange(updatedSlots.filter((slot) => slot.isSelected));
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {timeSlots.map((slot, index) => (
                    <div key={index} className="flex flex-col space-y-2 p-3 border rounded">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={slot.isSelected}
                                onChange={() => handleCheckboxChange(index)}
                                className="w-4 h-4"
                            />
                            <span className="font-medium">{slot.day}</span>
                        </div>
                        {slot.isSelected && (
                            <div className="flex items-center space-x-2 ml-6">
                                <select
                                    value={slot.startHour}
                                    onChange={(e) => handleTimeChange(index, 'startHour', e.target.value)}
                                    className="p-1 border rounded"
                                >
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={slot.startMinute}
                                    onChange={(e) => handleTimeChange(index, 'startMinute', e.target.value)}
                                    className="p-1 border rounded"
                                >
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                        </option>
                                    ))}
                                </select>
                                <span>đến</span>
                                <select
                                    value={slot.endHour}
                                    onChange={(e) => handleTimeChange(index, 'endHour', e.target.value)}
                                    className="p-1 border rounded"
                                >
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={slot.endMinute}
                                    onChange={(e) => handleTimeChange(index, 'endMinute', e.target.value)}
                                    className="p-1 border rounded"
                                >
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <div className="text-sm text-gray-500">
                    Đã chọn {timeSlots.filter((slot) => slot.isSelected).length}/{sessionPerWeek} khung thời gian
                </div>
                <div className="text-sm font-medium">Thời gian đã chọn:</div>
                <div className="space-y-1">
                    {selectedTimeStrings.map((timeString, index) => (
                        <div key={index} className="bg-blue-50 p-2 rounded">
                            {timeString}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeeklySchedule;
