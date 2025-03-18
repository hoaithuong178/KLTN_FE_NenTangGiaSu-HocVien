import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { ComboBox, InputField, RadioButton } from '../components/InputField';
import { Button } from '../components/Button';
import { TitleText } from '../components/Text';

const PersonalInfor: React.FC = () => {
    const [avatar, setAvatar] = useState<string>('../assets/avatar.jpg');
    const [userData] = useState({
        name: 'Nguyen Van A',
        age: '25',
        email: 'nguyenvana@example.com',
        phone: '0987654321',
        gender: 'Nam',
        violations: '0',
        houseNumber: '123',
        street: 'Nguyen Trai',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
        balance: '10,000,000 VND',
    });

    const [provinces, setProvinces] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [, setSelectedProvince] = useState<string>('');

    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true;
    });

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/?depth=1')
            .then((res) => res.json())
            .then((data) => setProvinces(data.map((prov: { name: string }) => prov.name)));
    }, []);

    const handleProvinceChange = (province: string) => {
        setSelectedProvince(province);
        fetch(`https://provinces.open-api.vn/api/p/${province}?depth=2`)
            .then((res) => res.json())
            .then((data) => setDistricts(data.districts.map((dist: { name: string }) => dist.name)));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    return (
        <div className="absolute top-0 left-0 flex w-screen overflow-hidden bg-gray-100">
            {/* Sidebar & Navbar */}
            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <div className="flex-1 flex flex-col">
                <TopNavbar />

                {/* Main Content */}
                <div className={`flex-1 overflow-auto p-6 mt-8 flex gap-8 ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                    {/* Bọc toàn bộ thông tin cá nhân trong div trắng */}
                    <div className="bg-white p-6 rounded-lg shadow-md w-2/3 flex flex-col">
                        <div className="flex items-center space-x-6 mb-6">
                            <img
                                src={avatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md"
                            />
                            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                Đổi ảnh
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </label>
                        </div>

                        <TitleText level={2} className="text-gray-800 font-semibold mb-4">
                            Thông tin cá nhân
                        </TitleText>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField type="text" title="Họ và tên" value={userData.name} />
                            <InputField type="text" title="Tuổi" value={userData.age} />
                            <InputField type="text" title="Email" value={userData.email} />
                            <InputField type="text" title="Số điện thoại" value={userData.phone} />
                            <RadioButton title="Giới tính" options={['Nam', 'Nữ', 'Khác']} selected={userData.gender} />
                            <InputField type="text" title="Số lần vi phạm" value={userData.violations} />
                        </div>

                        <TitleText level={3} className="text-gray-800 font-semibold mt-6 mb-4">
                            Địa chỉ
                        </TitleText>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField type="text" title="Số nhà" value={userData.houseNumber} />
                            <InputField type="text" title="Đường" value={userData.street} />
                            <ComboBox
                                title="Tỉnh/Thành phố"
                                options={provinces}
                                value={userData.city}
                                onChange={handleProvinceChange}
                                required
                            />
                            <ComboBox title="Quận/Huyện" options={districts} value={userData.district} required />
                        </div>

                        <Button title="Cập nhật" className="mt-6 bg-blue-600 hover:bg-blue-700 w-full" />
                    </div>

                    {/* Cột ví - vẫn riêng biệt, không bị bọc vào div trắng */}
                    <div className="w-1/3 flex items-start">
                        <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
                            <div className="absolute top-4 left-4 text-sm text-white">TeachMe Wallet</div>
                            <div className="mt-10">
                                <p className="text-lg text-white">Số dư trong ví</p>
                                <p className="text-3xl font-bold text-[#ffc569] mt-3">{userData.balance}</p>
                            </div>
                            <div className="absolute bottom-2 left-4 text-sm text-white">Nguyen Van A</div>
                            <div className="absolute bottom-2 right-4 text-sm text-white">**** 5678</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfor;
