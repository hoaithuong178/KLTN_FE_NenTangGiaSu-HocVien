import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import SEO from '../components/SEO';
import axiosClient from '../configs/axios.config';
import { Notification } from '../components/Notification';
import axios from 'axios';
import defaultAvatar from '../assets/avatar.jpg'; // Import the default avatar
import { Combobox } from '@headlessui/react';

const EditProfile = () => {
    type User = {
        id?: string;
        fullName: string;
        name?: string;
        avatar: string;
        email: string;
        phone?: string;
        address?: string;
        gender?: string;
        dob?: string;
        description?: string;
        role?: '' | 'STUDENT' | 'TUTOR' | 'ADMIN';
        userProfile?: {
            avatar?: string;
            address?: string;
            gender?: string;
            dob?: string;
        };
        tutorProfile?: {
            description?: string;
            specializations?: string[];
            experiences?: number;
            tutorLocations?: string[];
            hourlyPrice?: number;
            fee?: number; // Added fee property
            freeTime?: string[];
            qualification?: string;
        };
    };

    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore() as { user: User | null };
    const [formData, setFormData] = useState<User | null>(currentUser); // Initialize with currentUser
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [cities, setCities] = useState<Array<{ _id: string; name: string }>>([]);
    const [districts, setDistricts] = useState<Array<{ _id: string; name: string }>>([]);
    const [wards, setWards] = useState<Array<{ _id: string; name: string }>>([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [streetAddress, setStreetAddress] = useState('');

    const timeSlots = ['Sáng', 'Chiều', 'Tối'];
    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [freeTime, setFreeTime] = useState<Record<string, string[]>>({});
    const [editingTime, setEditingTime] = useState<{ day: string; time: string } | null>(null);
    const [timeError, setTimeError] = useState<string | null>(null); // Add state for time error

    const validateTime = () => {
        if (!startTime || !endTime) return false;
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        return end.getTime() - start.getTime() >= 30 * 60 * 1000;
    };

    const isValidSlotTime = () => {
        if (!selectedSlot || !startTime || !endTime) return false;
        const startHour = parseInt(startTime.split(':')[0], 10);
        const endHour = parseInt(endTime.split(':')[0], 10);

        if (selectedSlot === 'Sáng' && (startHour >= 12 || endHour >= 12)) return false;
        if (selectedSlot === 'Chiều' && (startHour < 12 || startHour >= 18 || endHour < 12 || endHour >= 18))
            return false;
        if (selectedSlot === 'Tối' && (startHour < 18 || endHour < 18)) return false;

        return true;
    };

    const handleAddOrUpdateTime = () => {
        if (!selectedDay || !selectedSlot || !startTime || !endTime) {
            setTimeError('Vui lòng chọn đầy đủ ngày, buổi, giờ bắt đầu và giờ kết thúc.');
            return;
        }
        if (!validateTime()) {
            setTimeError('Khoảng thời gian phải ít nhất 30 phút.');
            return;
        }
        if (!isValidSlotTime()) {
            setTimeError('Giờ bắt đầu và giờ kết thúc không hợp lệ với buổi đã chọn.');
            return;
        }

        const newTime = `${selectedSlot}: ${startTime} - ${endTime}`;
        setFreeTime((prev) => {
            const updatedTimes = editingTime
                ? (prev[selectedDay] || []).map((t) => (t === editingTime.time ? newTime : t))
                : [...(prev[selectedDay] || []), newTime];
            return {
                ...prev,
                [selectedDay]: updatedTimes,
            };
        });
        setEditingTime(null);
        setStartTime('');
        setEndTime('');
        setSelectedSlot(null);
        setTimeError(null); // Clear error after successful addition
    };

    const handleRemoveTime = (day: string, time: string) => {
        setFreeTime((prev) => {
            const updatedTimes = (prev[day] || []).filter((t) => t !== time);
            return {
                ...prev,
                [day]: updatedTimes,
            };
        });
    };

    const handleEditTime = (day: string, time: string) => {
        setEditingTime({ day, time });
        const [slot, start, end] = time.split(/[: -]/).map((t) => t.trim());
        setSelectedDay(day);
        setSelectedSlot(slot);
        setStartTime(start);
        setEndTime(end);
    };

    // Hàm chuyển đổi giới tính từ API sang hiển thị
    const convertGender = (gender: string | undefined): string => {
        switch (gender?.toUpperCase()) {
            case 'MALE':
                return 'Nam';
            case 'FEMALE':
                return 'Nữ';
            default:
                return '';
        }
    };

    // Hàm chuyển đổi giới tính từ hiển thị sang API
    const convertGenderToApi = (gender: string): string => {
        switch (gender) {
            case 'Nam':
                return 'MALE';
            case 'Nữ':
                return 'FEMALE';
            default:
                return '';
        }
    };

    // Kiểm tra role
    const isTutor = currentUser?.role === 'TUTOR';

    // Hàm lấy danh sách tỉnh/thành phố
    const fetchCities = async () => {
        try {
            const response = await axios.get('https://vietnam-addresses.vercel.app/api/v1/cities');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    // Hàm lấy danh sách quận/huyện
    const fetchDistricts = async (cityId: string) => {
        try {
            const response = await axios.get(`https://vietnam-addresses.vercel.app/api/v1/districts?cityId=${cityId}`);
            setDistricts(response.data);
            setSelectedDistrict(''); // Reset quận/huyện khi đổi tỉnh/thành phố
            setSelectedWard(''); // Reset phường/xã khi đổi tỉnh/thành phố
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    // Hàm lấy danh sách phường/xã
    const fetchWards = async (districtId: string) => {
        try {
            const response = await axios.get(
                `https://vietnam-addresses.vercel.app/api/v1/wards?districtId=${districtId}`,
            );
            setWards(response.data);
            setSelectedWard(''); // Reset phường/xã khi đổi quận/huyện
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    // Hàm xử lý khi chọn tỉnh/thành phố
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        if (cityId) {
            fetchDistricts(cityId);
        }
    };

    // Hàm xử lý khi chọn quận/huyện
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        if (districtId) {
            fetchWards(districtId);
        }
    };

    // Hàm xử lý khi thay đổi địa chỉ chi tiết
    const handleStreetAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        if (e.target instanceof HTMLInputElement) {
            setStreetAddress(value);
        }
        // Cập nhật formData với địa chỉ đầy đủ
        const fullAddress = `${streetAddress}, ${
            selectedWard ? wards.find((w) => w._id === selectedWard)?.name : ''
        }, ${selectedDistrict ? districts.find((d) => d._id === selectedDistrict)?.name : ''}, ${
            selectedCity ? cities.find((c) => c._id === selectedCity)?.name : ''
        }`;
        setFormData((prev) => (prev ? { ...prev, address: fullAddress } : null));
    };

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (!currentUser) {
            setIsLoading(false); // Ensure loading is stopped even when navigating
            navigate('/login');
            return;
        }

        console.log('Current User:', currentUser); // Debug log to check currentUser structure

        setIsLoading(true); // Set loading to true before initializing data

        try {
            // Set formData directly from currentUser
            setFormData({
                id: currentUser.id,
                fullName: currentUser.name || currentUser.fullName || '',
                avatar: currentUser.avatar || currentUser.userProfile?.avatar || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.userProfile?.address || '',
                gender: convertGender(currentUser.userProfile?.gender) || '', // Use gender from userProfile
                dob: currentUser.userProfile?.dob
                    ? new Date(currentUser.userProfile.dob).toISOString().split('T')[0]
                    : '', // Format date to YYYY-MM-DD
                description: currentUser.tutorProfile?.description || '',
                role: currentUser.role || '',
                // Tutor-specific information
                specializations: currentUser.tutorProfile?.specializations || [],
                experienceYear: currentUser.tutorProfile?.experiences || 0,
                tutorLocation: currentUser.tutorProfile?.tutorLocations || [],
                hourlyPrice: currentUser.tutorProfile?.hourlyPrice || 0,
                fee: currentUser.tutorProfile?.fee || 0,
                freeTime: currentUser.tutorProfile?.freeTime || [],
                qualification: currentUser.tutorProfile?.qualification || '',
            });
        } catch (error) {
            console.error('Error initializing formData:', error);
            setError('Đã xảy ra lỗi khi tải dữ liệu người dùng.');
        } finally {
            setIsLoading(false); // Ensure loading is stopped
        }
    }, [currentUser, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log('Input Change:', name, value); // Debug log
        setFormData((prev) => {
            if (!prev) return null;
            return { ...prev, [name]: value };
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setFormData((prev) => (prev ? { ...prev, avatar: reader.result as string } : null));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            const apiData = {
                ...formData,
                name: formData.fullName,
                birthYear: formData.dob ? new Date(formData.dob).getFullYear() : null,
                gender: convertGenderToApi(formData.gender || ''),
                subjects: formData.tutorProfile?.specializations,
                experience: formData.tutorProfile?.experiences,
                location: formData.tutorProfile?.tutorLocations?.[0],
                pricePerSession: formData.tutorProfile?.hourlyPrice,
                availableTime: Object.entries(freeTime)
                    .filter(([_, slots]) => slots.length > 0)
                    .map(([day, slots]) => `${day}:${slots.join(',')}`),
                educationLevel: formData.tutorProfile?.qualification,
            };

            // Include the user's ID in the API endpoint
            await axiosClient.put(`/api/v1/user-profiles/${formData.id}`, apiData);

            setNotification({
                message: 'Cập nhật thông tin thành công',
                show: true,
                type: 'success',
            });
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (err) {
            setNotification({
                message: 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.',
                show: true,
                type: 'error',
            });
            console.error('Error updating user data:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    if (!formData) {
        return <div>Không tìm thấy thông tin người dùng.</div>;
    }

    return (
        <>
            <SEO title="Chỉnh sửa thông tin cá nhân" description="Trang chỉnh sửa thông tin cá nhân" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigate(-1)} // Navigate to the previous page
                                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 011.414-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-2">Quay lại</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto p-6">
                    <Notification message={notification.message} show={notification.show} type={notification.type} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Phần Avatar */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 group-hover:border-blue-200 transition-colors">
                                        <img
                                            src={
                                                avatarPreview ||
                                                formData.avatar ||
                                                formData.userProfile?.avatar ||
                                                defaultAvatar
                                            }
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = defaultAvatar; // Set default avatar on error
                                            }}
                                        />
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </label>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Nhấp vào biểu tượng cây bút để thay đổi ảnh đại diện
                                </p>
                            </div>
                        </div>

                        {/* Thông tin cơ bản */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100 text-gray-900">
                                Thông tin cơ bản
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                        placeholder="Nhập họ và tên"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                        placeholder="Nhập email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                                    <select
                                        name="gender"
                                        value={formData?.gender || ''} // Ensure gender is properly set
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData?.dob || ''} // Ensure date of birth is properly set
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giới thiệu bản thân
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                    placeholder="Hãy giới thiệu về bản thân bạn..."
                                />
                            </div>

                            {/* Phần địa chỉ */}
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Địa chỉ</h3>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tỉnh/thành phố
                                        </label>
                                        <select
                                            value={selectedCity}
                                            onChange={handleCityChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                        >
                                            <option value="">Chọn tỉnh/thành phố</option>
                                            {cities.map((city) => (
                                                <option key={city._id} value={city._id}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quận/huyện
                                        </label>
                                        <select
                                            value={selectedDistrict}
                                            onChange={handleDistrictChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                        >
                                            <option value="">Chọn quận/huyện</option>
                                            {districts.map((district) => (
                                                <option key={district._id} value={district._id}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phường/xã
                                        </label>
                                        <select
                                            value={selectedWard}
                                            onChange={(e) => {
                                                setSelectedWard(e.target.value);
                                                handleStreetAddressChange(e);
                                            }}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                        >
                                            <option value="">Chọn phường/xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward._id} value={ward._id}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số nhà, tên đường
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={streetAddress}
                                        onChange={handleStreetAddressChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                        placeholder="Nhập số nhà, tên đường"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Thông tin riêng cho TUTOR */}
                        {isTutor && (
                            <div className="mt-8">
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100 text-gray-900">
                                        Thông tin gia sư
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Chuyên môn
                                            </label>
                                            <input
                                                type="text"
                                                name="specializations"
                                                value={formData.tutorProfile?.specializations?.join(', ') || ''}
                                                onChange={(e) => {
                                                    const specializations = e.target.value
                                                        .split(',')
                                                        .map((s) => s.trim());
                                                    setFormData((prev) => (prev ? { ...prev, specializations } : null));
                                                }}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                                placeholder="Nhập các môn học, phân tách bằng dấu phẩy"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số năm kinh nghiệm
                                            </label>
                                            <input
                                                type="number"
                                                name="experienceYear"
                                                value={formData.tutorProfile?.experiences || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                                placeholder="Nhập số năm kinh nghiệm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Địa điểm dạy
                                            </label>
                                            <input
                                                type="text"
                                                name="tutorLocation"
                                                value={formData.tutorProfile?.tutorLocations?.join(', ') || ''}
                                                onChange={(e) => {
                                                    const locations = e.target.value.split(',').map((l) => l.trim());
                                                    setFormData((prev) =>
                                                        prev ? { ...prev, tutorLocation: locations } : null,
                                                    );
                                                }}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                                placeholder="Nhập các địa điểm, phân tách bằng dấu phẩy"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Giá theo giờ
                                            </label>
                                            <input
                                                type="number"
                                                name="hourlyPrice"
                                                value={formData.tutorProfile?.hourlyPrice || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                                placeholder="Nhập giá theo giờ"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phí dịch vụ
                                            </label>
                                            <input
                                                type="number"
                                                name="fee"
                                                value={formData.tutorProfile?.fee || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                                placeholder="Nhập phí dịch vụ"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Thời gian rảnh
                                            </label>
                                            <input
                                                type="text"
                                                name="freeTime"
                                                value={formData.tutorProfile?.freeTime?.join(', ') || ''}
                                                onChange={(e) => {
                                                    const freeTimes = e.target.value.split(',').map((t) => t.trim());
                                                    setFormData((prev) =>
                                                        prev ? { ...prev, freeTime: freeTimes } : null,
                                                    );
                                                }}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                                placeholder="Nhập thời gian rảnh, phân tách bằng dấu phẩy"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bằng cấp
                                            </label>
                                            <input
                                                type="text"
                                                name="qualification"
                                                value={formData.tutorProfile?.qualification || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                                placeholder="Nhập bằng cấp"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn lịch rảnh</h2>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {daysOfWeek.map((day) => (
                                            <button
                                                key={day}
                                                onClick={() => setSelectedDay(day)}
                                                className={`px-4 py-2 rounded-lg border transition ${
                                                    selectedDay === day
                                                        ? 'border-blue-500 bg-blue-100 text-blue-700'
                                                        : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Combobox value={selectedSlot} onChange={setSelectedSlot}>
                                            <Combobox.Button className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                                {selectedSlot || 'Chọn thời gian'}
                                            </Combobox.Button>
                                            <Combobox.Options className="absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                                {timeSlots.map((slot) => (
                                                    <Combobox.Option
                                                        key={slot}
                                                        value={slot}
                                                        className="p-2 cursor-pointer hover:bg-blue-100"
                                                    >
                                                        {slot}
                                                    </Combobox.Option>
                                                ))}
                                            </Combobox.Options>
                                        </Combobox>
                                        <input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleAddOrUpdateTime}
                                            className="text-blue-500 hover:text-blue-700 font-semibold"
                                        >
                                            {editingTime ? 'Lưu' : '(+)'}
                                        </button>
                                    </div>
                                    {timeError && <p className="text-red-500 mt-2">{timeError}</p>}{' '}
                                    {/* Display error message */}
                                    <div className="mt-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Tóm tắt thời gian đã chọn
                                        </h3>
                                        <div className="space-y-4">
                                            {Object.entries(freeTime).map(([day, times]) => (
                                                <div key={day}>
                                                    <h4 className="font-semibold text-gray-800">{day}</h4>
                                                    <ul className="list-disc pl-6 text-gray-700">
                                                        {times.map((time, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-center justify-between"
                                                            >
                                                                <span
                                                                    className="cursor-pointer hover:text-blue-500"
                                                                    onClick={() => handleEditTime(day, time)}
                                                                >
                                                                    {time}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveTime(day, time)}
                                                                    className="text-red-500 hover:text-red-700 font-semibold ml-4"
                                                                >
                                                                    (Xóa)
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
