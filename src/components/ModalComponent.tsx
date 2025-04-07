import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/FullLogo.png';
import { Button } from './Button';

interface RequestModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    requestForm: {
        title: string;
        content: string;
        specializations: string;
        learningTypes?: string;
        location: string;
        level: string;
        sessionsPerWeek: number;
        negotiatedPrice?: number;
        duration: number;
        mode: 'online' | 'offline';
        hourlyPrice: number;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;

    tutorSpecializations: string[];
    tutorLearningTypes: string[];
    tutorHourlyPrice: number;
}

export const RequestModal: React.FC<RequestModalProps> = ({
    show,
    onClose,
    onSubmit,
    requestForm,
    handleChange,
    tutorSpecializations,
    tutorLearningTypes,
    tutorHourlyPrice,
}) => {
    // const [selectedDay, setSelectedDay] = React.useState<string | null>(null);
    // const [selectedTimes, setSelectedTimes] = React.useState<string[]>([]);

    // const toggleTimeSelection = (timeRange: string) => {
    //     setSelectedTimes(
    //         (prev) =>
    //             prev.includes(timeRange)
    //                 ? prev.filter((time) => time !== timeRange) // Bỏ chọn nếu đã chọn
    //                 : [...prev, timeRange], // Thêm vào nếu chưa chọn
    //     );
    // };
    useEffect(() => {
        console.log('Current mode:', requestForm.mode);
    }, [requestForm.mode]);

    if (!show) return null;

    // Tính giá trên buổi
    const calculateSessionPrice = () => {
        const pricePerHour = requestForm.negotiatedPrice || tutorHourlyPrice; // Ưu tiên giá thương lượng nếu có
        const durationInHours = requestForm.duration / 60; // Chuyển phút thành giờ
        return pricePerHour * durationInHours * requestForm.sessionsPerWeek;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto relative z-[10000]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#1B223B]">Gửi yêu cầu dạy</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tiêu đề */}
                    <div className="col-span-2">
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Tiêu đề</label>
                        <input
                            type="text"
                            name="title"
                            value={requestForm.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                            placeholder="Nhập tiêu đề yêu cầu"
                        />
                    </div>

                    {/* Yêu cầu đối với gia sư */}
                    <div className="col-span-2">
                        <label className="block font-semibold text-gray-700 mb-2 text-left">
                            Yêu cầu đối với gia sư
                        </label>
                        <textarea
                            name="content"
                            value={requestForm.content}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                            rows={4}
                            placeholder="Mô tả chi tiết yêu cầu của bạn"
                        />
                    </div>

                    {/* Môn học */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Môn học</label>
                        <select
                            name="specializations"
                            value={requestForm.specializations}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                        >
                            {tutorSpecializations.length ? (
                                tutorSpecializations.map((spec) => (
                                    <option key={spec} value={spec}>
                                        {spec}
                                    </option>
                                ))
                            ) : (
                                <option value="">Không có môn học</option>
                            )}
                        </select>
                    </div>

                    {/* Khối */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Khối</label>
                        <input
                            type="text"
                            name="level"
                            value={requestForm.level || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                            placeholder="Nhập khối học"
                        />
                    </div>

                    {/* Số buổi/tuần */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Số buổi/tuần</label>
                        <select
                            name="sessionsPerWeek"
                            value={requestForm.sessionsPerWeek || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                        >
                            {[1, 2, 3, 4, 5].map((session) => (
                                <option key={session} value={session}>
                                    {session}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Thời lượng/buổi */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Thời lượng/Buổi</label>
                        <select
                            name="duration"
                            value={requestForm.duration || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                        >
                            {[60, 90, 120, 150, 180].map((duration) => (
                                <option key={duration} value={duration}>
                                    {duration / 60} giờ
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Địa điểm */}
                    <div className="col-span-2">
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Địa điểm</label>
                        <input
                            type="text"
                            name="location"
                            value={requestForm.location}
                            onChange={handleChange}
                            className={`w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none ${
                                requestForm.mode === 'online'
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-300'
                            }`}
                            placeholder="Nhập địa điểm học"
                            disabled={requestForm.mode === 'online'} // Disable input if mode is online
                        />
                    </div>

                    {/* Giá/giờ */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Giá/giờ</label>
                        <input
                            type="text"
                            value={`${tutorHourlyPrice.toLocaleString()} VND`}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                            readOnly
                        />
                    </div>

                    {/* Giá thương lượng */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Giá thương lượng</label>
                        <input
                            type="number"
                            name="negotiatedPrice"
                            value={requestForm.negotiatedPrice || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none focus:border-transparent"
                            placeholder="Nhập giá thương lượng (nếu muốn)"
                        />
                    </div>

                    {/* Giá trên buổi */}
                    <div className="col-span-2">
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Giá mỗi tuần</label>
                        <input
                            type="text"
                            value={`${calculateSessionPrice().toLocaleString()} VND`}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                            readOnly
                        />
                    </div>

                    {/* Hình thức học */}
                    <div className="col-span-2">
                        <label className="block font-semibold text-gray-700 mb-2 text-left">Hình thức học</label>
                        <div className="flex space-x-6">
                            {tutorLearningTypes.length > 0 ? (
                                tutorLearningTypes.map((type) => (
                                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value={type}
                                            checked={requestForm.mode === type}
                                            onChange={handleChange}
                                            className="text-[#1B223B] focus:ring-[#FFC569]"
                                        />
                                        <span className="text-gray-700 capitalize">{type}</span>
                                    </label>
                                ))
                            ) : (
                                <span className="text-gray-500">Không có hình thức học nào</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chọn ngày và giờ học */}
                {/* <div className="col-span-2">
                    <label className="block font-semibold text-gray-700 mb-2 text-left">Chọn ngày và giờ học</label>
                    <div className="space-y-4"> */}
                {/* Chọn ngày */}
                {/* <div className="flex gap-2 flex-wrap">
                            {Object.keys(selectedTutor.tutorProfile?.freeTime || {}).map((day) => (
                                <button
                                    key={day}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        selectedDay === day
                                            ? 'bg-[#1B223B] text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    onClick={() => setSelectedDay(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div> */}

                {/* Chọn giờ */}
                {/* {selectedDay && selectedTutor.tutorProfile?.freeTime?.[selectedDay] && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 text-left">Chọn khung giờ:</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {Object.entries(selectedTutor.tutorProfile.freeTime[selectedDay]).flatMap(
                                        ([period, times]) =>
                                            times?.map(([start, end]) => {
                                                const timeRange = `${start}-${end}`;
                                                return (
                                                    <button
                                                        key={timeRange}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                            selectedTimes.includes(timeRange)
                                                                ? 'bg-[#1B223B] text-white shadow-md'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                        onClick={() => toggleTimeSelection(timeRange)}
                                                        disabled={
                                                            selectedTimes.length >= requestForm.sessionsPerWeek &&
                                                            !selectedTimes.includes(timeRange)
                                                        }
                                                    >
                                                        {`${period}: ${start}-${end}`}
                                                    </button>
                                                );
                                            }),
                                    )}
                                </div>
                                <div className="mt-3 text-right">
                                    <span className="text-sm text-gray-600">
                                        Đã chọn {selectedTimes.length}/{requestForm.sessionsPerWeek} khung giờ
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div> */}

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                        Gửi yêu cầu
                    </button>
                </div>
            </div>
        </div>
    );
};
interface SignInModalProps {
    show: boolean;
    onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ show, onClose }) => {
    const navigate = useNavigate();

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fade-in relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/src/assets/pattern.svg')] opacity-5"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img src={Logo} alt="TeachMe Logo" className="h-12 w-auto" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-[#1B223B] text-center mb-2">
                        Đăng nhập để trải nghiệm TeachMe!
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        Tạo tài khoản để kết nối với gia sư chất lượng và bắt đầu hành trình học tập của bạn
                    </p>

                    {/* Buttons */}
                    <div className="space-y-4">
                        <Button
                            title="Đăng nhập ngay"
                            backgroundColor="#FFC569"
                            hoverBackgroundColor="#FFB347"
                            foreColor="#1B223B"
                            className="w-full py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={() => navigate('/sign-in')}
                        />
                        <Button
                            title="Đăng ký tài khoản mới"
                            backgroundColor="transparent"
                            hoverBackgroundColor="#FFC569"
                            foreColor="#1B223B"
                            className="w-full py-3 rounded-full text-lg font-semibold border-2 border-[#FFC569] hover:bg-[#FFC569] transition-all duration-300"
                            onClick={() => navigate('/register')}
                        />
                    </div>

                    {/* Features */}
                    <div className="mt-8 space-y-3">
                        <div className="flex items-center text-gray-600">
                            <svg
                                className="w-5 h-5 text-[#FFC569] mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Kết nối với gia sư chất lượng</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <svg
                                className="w-5 h-5 text-[#FFC569] mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Quản lý lịch học linh hoạt</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <svg
                                className="w-5 h-5 text-[#FFC569] mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Đánh giá và phản hồi chi tiết</span>
                        </div>
                    </div>

                    {/* Skip Button */}
                    <button
                        className="mt-6 text-sm text-gray-500 hover:text-[#FFC569] transition-colors mx-auto block"
                        onClick={onClose}
                    >
                        Để sau
                    </button>
                </div>
            </div>
        </div>
    );
};
