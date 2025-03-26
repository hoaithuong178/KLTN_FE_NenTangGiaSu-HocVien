import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import SEO from '../components/SEO';
import axiosClient from '../configs/axios.config';
import { Notification } from '../components/Notification';
import axios from 'axios';

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
        role?: 'STUDENT' | 'TUTOR' | 'ADMIN';
        // Thông tin riêng cho TUTOR
        specializations?: string[];
        experienceYear?: number;
        tutorLocation?: string[];
        hourlyPrice?: number;
        fee?: number;
        freeTime?: string[];
        qualification?: string;
    };

    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore() as { user: User | null };
    const [formData, setFormData] = useState<User | null>(null);
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
            navigate('/login');
            return;
        }

        // Load thông tin user
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                const response = await axiosClient.get(`/user-profiles`);
                console.log('API Response:', response.data); // Debug log

                if (response.data) {
                    // Chuyển đổi dữ liệu từ API sang định dạng form
                    const userData = {
                        id: response.data.id,
                        fullName:
                            response.data.name ||
                            response.data.fullName ||
                            currentUser?.name ||
                            currentUser?.fullName ||
                            '',
                        avatar: response.data.avatar || currentUser?.avatar || '',
                        email: response.data.email || currentUser?.email || '',
                        phone: response.data.phone || currentUser?.phone || '',
                        address: response.data.address || currentUser?.address || '',
                        gender: convertGender(response.data.gender) || currentUser?.gender || '',
                        dob: response.data.dob ? new Date(response.data.dob).toISOString().split('T')[0] : '',
                        description: response.data.description || '',
                        role: response.data.role || currentUser?.role || '',
                        // Thông tin riêng cho TUTOR
                        specializations: response.data.subjects || [],
                        experienceYear: response.data.experience || 0,
                        tutorLocation: response.data.location ? [response.data.location] : [],
                        hourlyPrice: response.data.pricePerSession || 0,
                        fee: response.data.fee || 0,
                        freeTime: response.data.availableTime ? [response.data.availableTime] : [],
                        qualification: response.data.educationLevel || '',
                    };
                    console.log('API Response:', response.data);
                    console.log('Formatted User Data:', userData);
                    setFormData(userData);
                } else {
                    setError('Không tìm thấy thông tin người dùng');
                }
            } catch (err) {
                console.error('Error loading user data:', err);
                setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
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
                subjects: formData.specializations,
                experience: formData.experienceYear,
                location: formData.tutorLocation?.[0],
                pricePerSession: formData.hourlyPrice,
                availableTime: formData.freeTime?.[0],
                educationLevel: formData.qualification,
            };

            await axiosClient.put(`/user-profiles`, apiData);
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
                                    onClick={() => navigate('/information')}
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
                                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
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
                                            src={avatarPreview || formData.avatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
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
                                        value={formData.gender || ''}
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
                                        value={formData.dob || ''}
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
                                            value={formData.specializations?.join(', ') || ''}
                                            onChange={(e) => {
                                                const specializations = e.target.value.split(',').map((s) => s.trim());
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
                                            value={formData.experienceYear || ''}
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
                                            value={formData.tutorLocation?.join(', ') || ''}
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
                                            value={formData.hourlyPrice || ''}
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
                                            value={formData.fee || ''}
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
                                            value={formData.freeTime?.join(', ') || ''}
                                            onChange={(e) => {
                                                const freeTimes = e.target.value.split(',').map((t) => t.trim());
                                                setFormData((prev) => (prev ? { ...prev, freeTime: freeTimes } : null));
                                            }}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                            placeholder="Nhập thời gian rảnh, phân tách bằng dấu phẩy"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bằng cấp</label>
                                        <input
                                            type="text"
                                            name="qualification"
                                            value={formData.qualification || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                                            placeholder="Nhập bằng cấp"
                                        />
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
