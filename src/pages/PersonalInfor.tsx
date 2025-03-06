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
        hobbies: 'Đọc sách, Lập trình',
        traits: 'Chăm chỉ, Tỉ mỉ',
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
        // Kiểm tra trạng thái từ localStorage
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true; // Mặc định là true
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
        <div className="absolute top-0 left-0 flex h-screen w-screen">
            {/* Sử dụng Navbar */}
            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />

            {/* Main Content */}
            <div className={`flex-1 p-6 ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                <div className="flex items-center space-x-4 my-4">
                    <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full border" />
                    <label className="cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600">
                        Đổi ảnh
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                </div>
                {/* Cột thông tin */}
                <div className="w-2/3 pr-6">
                    <TitleText level={2} className="mb-4">
                        Thông tin cá nhân
                    </TitleText>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField type="text" title="Họ và tên" value={userData.name} />
                        <InputField type="text" title="Tuổi" value={userData.age} />
                        <InputField type="text" title="Email" value={userData.email} />
                        <InputField type="text" title="Số điện thoại" value={userData.phone} />
                        <RadioButton title="Giới tính" options={['Nam', 'Nữ', 'Khác']} selected={userData.gender} />
                        <InputField type="text" title="Số lần vi phạm" value={userData.violations} />
                        <InputField type="text" title="Sở thích" value={userData.hobbies} />
                        <InputField type="text" title="Đặc điểm" value={userData.traits} />
                    </div>

                    <TitleText level={3} className="mt-6 mb-4">
                        Địa chỉ
                    </TitleText>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField type="text" title="Số nhà" value={userData.houseNumber} />
                        <InputField type="text" title="Đường" value={userData.street} />
                        <ComboBox title="Tỉnh/Thành phố" options={provinces} onChange={handleProvinceChange} required />
                        <ComboBox title="Quận/Huyện" options={districts} required />
                    </div>

                    <Button title="Cập nhật" className="mt-6 bg-blue-600 hover:bg-blue-700 w-full" />
                </div>

                {/* Cột credit card */}
                <div className="w-1/3 flex items-center justify-center">
                    <div className="relative bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-lg shadow-xl text-center w-full max-w-xs">
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
    );
};

export default PersonalInfor;
