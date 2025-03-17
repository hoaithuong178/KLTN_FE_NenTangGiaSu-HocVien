import React from 'react';

interface TimeData {
    day: string;
    from: string;
    to: string;
}

interface FreeTimeSelectionProps {
    times: TimeData[];
    onTimesChange: (newTimes: TimeData[]) => void;
}

const generateMinuteOptions = () => {
    const minutes = [];
    for (let i = 0; i <= 55; i += 5) {
        minutes.push(i.toString().padStart(2, '0'));
    }
    return minutes;
};

const FreeTimeSelection: React.FC<FreeTimeSelectionProps> = ({ times, onTimesChange }) => {
    const handleTimeChange = (index: number, field: string, value: string) => {
        const newTimes = [...times];
        newTimes[index] = { ...newTimes[index], [field]: value };
        onTimesChange(newTimes);
    };

    const TimeSelectionRow = ({ time, index }: { time: TimeData; index: number }) => {
        const days: { [key: string]: string } = {
            '2': 'Thứ 2',
            '3': 'Thứ 3',
            '4': 'Thứ 4',
            '5': 'Thứ 5',
            '6': 'Thứ 6',
            '7': 'Thứ 7',
            CN: 'Chủ nhật',
        };

        const generateHourOptions = () => {
            return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
        };

        return (
            <div className="flex items-center space-x-2 mt-2">
                <select
                    value={time.day || ''}
                    onChange={(e) => handleTimeChange(index, 'day', e.target.value)}
                    className="border p-2 rounded w-1/4"
                >
                    <option value="">Chọn thứ</option>
                    {Object.entries(days).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                <div className="flex items-center space-x-2 w-3/4">
                    <span className="text-gray-600">Từ</span>
                    <div className="flex">
                        <select
                            value={time.from?.split(':')[0] || ''}
                            onChange={(e) => {
                                const hour = e.target.value;
                                const minute = time.from?.split(':')[1] || '00';
                                handleTimeChange(index, 'from', `${hour}:${minute}`);
                            }}
                            className="border p-2 rounded-l w-20"
                        >
                            <option value="">Giờ</option>
                            {generateHourOptions().map((hour) => (
                                <option key={hour} value={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>
                        <select
                            value={time.from?.split(':')[1] || ''}
                            onChange={(e) => {
                                const hour = time.from?.split(':')[0] || '00';
                                handleTimeChange(index, 'from', `${hour}:${e.target.value}`);
                            }}
                            className="border-t border-b border-r p-2 rounded-r w-20"
                        >
                            <option value="">Phút</option>
                            {generateMinuteOptions().map((minute) => (
                                <option key={minute} value={minute}>
                                    {minute}
                                </option>
                            ))}
                        </select>
                    </div>

                    <span className="text-gray-600">đến</span>
                    <div className="flex">
                        <select
                            value={time.to?.split(':')[0] || ''}
                            onChange={(e) => {
                                const hour = e.target.value;
                                const minute = time.to?.split(':')[1] || '00';
                                handleTimeChange(index, 'to', `${hour}:${minute}`);
                            }}
                            className="border p-2 rounded-l w-20"
                        >
                            <option value="">Giờ</option>
                            {generateHourOptions().map((hour) => (
                                <option key={hour} value={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>
                        <select
                            value={time.to?.split(':')[1] || ''}
                            onChange={(e) => {
                                const hour = time.to?.split(':')[0] || '00';
                                handleTimeChange(index, 'to', `${hour}:${e.target.value}`);
                            }}
                            className="border-t border-b border-r p-2 rounded-r w-20"
                        >
                            <option value="">Phút</option>
                            {generateMinuteOptions().map((minute) => (
                                <option key={minute} value={minute}>
                                    {minute}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => onTimesChange(times.filter((_, i) => i !== index))}
                        className="ml-2 px-2 py-1 text-red-600 hover:text-red-800"
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    };

    const DisplaySelectedTimes = () => {
        const days: { [key: string]: string } = {
            '2': 'Thứ 2',
            '3': 'Thứ 3',
            '4': 'Thứ 4',
            '5': 'Thứ 5',
            '6': 'Thứ 6',
            '7': 'Thứ 7',
            CN: 'Chủ nhật',
        };

        const validTimes = times.filter((time) => time.day || time.from || time.to);

        if (validTimes.length === 0) return null;

        return (
            <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Thời gian rảnh đã chọn:</h3>
                <div className="flex flex-wrap gap-2">
                    {validTimes.map((time, index) => {
                        if (!time.day || !time.from || !time.to) return null;
                        return (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                                {`${days[time.day]} ${time.from}-${time.to}`}
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2">Thời gian rảnh</label>
            {times.map((time, index) => (
                <TimeSelectionRow key={index} time={time} index={index} />
            ))}
            <button
                type="button"
                className="mt-2 px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
                onClick={() => onTimesChange([...times, { day: '', from: '', to: '' }])}
            >
                + Thêm thời gian rảnh
            </button>
            <DisplaySelectedTimes />
        </div>
    );
};

export default FreeTimeSelection;
