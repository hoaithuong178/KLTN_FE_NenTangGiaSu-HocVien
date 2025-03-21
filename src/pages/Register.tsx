import React, { useState } from 'react';
import { InputField } from '../components/InputField';
// import { ComboBox , RadioButton} from '../components/InputField';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { TitleText } from '../components/Text';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../components/Notification';
import axiosClient from '../configs/axios.config';
import { AxiosError } from 'axios';

// const monthOptions = Array.from({ length: 12 }, (_, index) => (index + 1).toString());
// const dayOptions = Array.from({ length: 31 }, (_, index) => (index + 1).toString());

// const cityOptions = [
//     'An Giang',
//     'Bà Rịa - Vũng Tàu',
//     'Bắc Giang',
//     'Bắc Kạn',
//     'Bạc Liêu',
//     'Bắc Ninh',
//     'Bến Tre',
//     'Bình Dương',
//     'Bình Định',
//     'Bình Phước',
//     'Bình Thuận',
//     'Cà Mau',
//     'Cần Thơ',
//     'Cao Bằng',
//     'Đà Nẵng',
//     'Đắk Lắk',
//     'Đắk Nông',
//     'Điện Biên',
//     'Đồng Nai',
//     'Đồng Tháp',
//     'Gia Lai',
//     'Hà Giang',
//     'Hà Nam',
//     'Hà Nội',
//     'Hà Tĩnh',
//     'Hải Dương',
//     'Hải Phòng',
//     'Hậu Giang',
//     'Hòa Bình',
//     'Hưng Yên',
//     'Khánh Hòa',
//     'Kiên Giang',
//     'Kon Tum',
//     'Lai Châu',
//     'Lâm Đồng',
//     'Lạng Sơn',
//     'Lào Cai',
//     'Long An',
//     'Nam Định',
//     'Nghệ An',
//     'Ninh Bình',
//     'Ninh Thuận',
//     'Phú Thọ',
//     'Phú Yên',
//     'Quảng Bình',
//     'Quảng Nam',
//     'Quảng Ngãi',
//     'Quảng Ninh',
//     'Quảng Trị',
//     'Sóc Trăng',
//     'Sơn La',
//     'Tây Ninh',
//     'Thái Bình',
//     'Thái Nguyên',
//     'Thanh Hóa',
//     'Thừa Thiên Huế',
//     'Tiền Giang',
//     'TP Hồ Chí Minh',
//     'Trà Vinh',
//     'Tuyên Quang',
//     'Vĩnh Long',
//     'Vĩnh Phúc',
//     'Yên Bái',
// ];
// Định nghĩa danh sách mã tỉnh/thành phố
// const provinceCodes: Record<string, string> = {
//     'An Giang': '89',
//     'Bà Rịa - Vũng Tàu': '77',
//     'Bắc Giang': '24',
//     'Bắc Kạn': '06',
//     'Bạc Liêu': '95',
//     'Bắc Ninh': '27',
//     'Bến Tre': '83',
//     'Bình Dương': '74',
//     'Bình Định': '52',
//     'Bình Phước': '70',
//     'Bình Thuận': '60',
//     'Cà Mau': '96',
//     'Cần Thơ': '92',
//     'Cao Bằng': '04',
//     'Đà Nẵng': '48',
//     'Đắk Lắk': '66',
//     'Đắk Nông': '67',
//     'Điện Biên': '11',
//     'Đồng Nai': '75',
//     'Đồng Tháp': '87',
//     'Gia Lai': '64',
//     'Hà Giang': '02',
//     'Hà Nam': '35',
//     'Hà Nội': '01',
//     'Hà Tĩnh': '42',
//     'Hải Dương': '30',
//     'Hải Phòng': '31',
//     'Hậu Giang': '93',
//     'Hòa Bình': '17',
//     'Hưng Yên': '33',
//     'Khánh Hòa': '56',
//     'Kiên Giang': '91',
//     'Kon Tum': '62',
//     'Lai Châu': '12',
//     'Lâm Đồng': '68',
//     'Lạng Sơn': '20',
//     'Lào Cai': '10',
//     'Long An': '80',
//     'Nam Định': '36',
//     'Nghệ An': '40',
//     'Ninh Bình': '37',
//     'Ninh Thuận': '58',
//     'Phú Thọ': '25',
//     'Phú Yên': '54',
//     'Quảng Bình': '44',
//     'Quảng Nam': '49',
//     'Quảng Ngãi': '51',
//     'Quảng Ninh': '22',
//     'Quảng Trị': '45',
//     'Sóc Trăng': '94',
//     'Sơn La': '14',
//     'Tây Ninh': '72',
//     'Thái Bình': '34',
//     'Thái Nguyên': '19',
//     'Thanh Hóa': '38',
//     'Thừa Thiên Huế': '46',
//     'Tiền Giang': '82',
//     'TP Hồ Chí Minh': '79',
//     'Trà Vinh': '84',
//     'Tuyên Quang': '08',
//     'Vĩnh Long': '86',
//     'Vĩnh Phúc': '26',
//     'Yên Bái': '15',
// };

// Hàm kiểm tra CCCD
// const validateCCCD = (cccd: string, city: string, gender: string, yearOfBirth: string): string | null => {
//     if (cccd.length !== 12) {
//         return 'CCCD phải có 12 chữ số!';
//     }

//     const provinceCode = cccd.slice(1, 3); // Mã tỉnh/thành phố
//     const genderCode = parseInt(cccd[3], 10); // Mã giới tính và thế kỷ
//     const birthYearCode = cccd.slice(4, 6); // Hai chữ số năm sinh

//     // Kiểm tra mã tỉnh/thành phố
//     if (provinceCodes[city] !== provinceCode) {
//         return 'Mã tỉnh/thành phố không khớp!';
//     }

//     // Kiểm tra năm sinh
//     const birthCentury = genderCode < 2 ? '19' : '20'; // Thế kỷ 19 hoặc 20
//     if (`${birthCentury}${birthYearCode}` !== yearOfBirth) {
//         return 'Năm sinh không khớp!';
//     }

//     // Kiểm tra giới tính
//     const isMale = gender.toLowerCase() === 'male';
//     if ((isMale && genderCode % 2 !== 0) || (!isMale && genderCode % 2 === 0)) {
//         return 'Giới tính không khớp!';
//     }

//     return null; // Nếu không có lỗi, trả về null
// };

const Register: React.FC = () => {
    const [isTutor, setIsTutor] = useState(false);
    const [isAccept, setIsAccept] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    // const [identityCard, setIdentityCard] = useState('');
    const [password, setPassword] = useState('');
    const [, setRePassword] = useState('');
    // const [city, setCity] = useState('');
    // const [gender, setGender] = useState('');
    // const [yearOfBirth, setYearOfBirth] = useState('');

    const [errors] = useState<{ [key: string]: string }>({});

    // const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    //     setter(value);
    // };

    // const currentYear = new Date().getFullYear();
    // const minYear = currentYear - 14;

    // const yearOptions: string[] = Array.from({ length: Math.min(50, minYear - 1900 + 1) }, (_, index) =>
    //     (minYear - index).toString(),
    // );

    const [notification] = useState<{ message: string; show: boolean; type: 'success' | 'error' }>({
        message: '',
        show: false,
        type: 'success',
    });
    const navigate = useNavigate();
    const handleClickRegister = async () => {
        try {
            // Sử dụng axiosClient thay vì axios
            await axiosClient.post('/auth/otp-register', { email });

            const registrationData = {
                name: firstName,
                phone: phoneNumber,
                email,
                password,
                role: isTutor ? 'TUTOR' : 'STUDENT',
            };

            navigate('/verify-otp', {
                state: {
                    registrationData,
                    type: 'register',
                },
            });
        } catch (error: unknown) {
            if ((error as AxiosError).response) {
                if ((error as AxiosError).response?.status === 409) {
                    console.error('Error: Email đã tồn tại');
                    // setNotification({ message: 'Email đã tồn tại. Vui lòng dùng email khác.', show: true, type: 'error' });
                } else {
                    console.error('Error sending OTP:', (error as AxiosError).response?.data);
                }
            } else {
                console.error('Error sending OTP:', error);
            }
        }
    };

    return (
        <div className="absolute top-0 left-0 overflow-x-hidden overflow-y-auto justify-center items-center bg-white text-blue-900 h-screen w-screen overflow-hidden">
            <TitleText level={1} className="text-center mt-8" color="text-blue-900">
                Đăng ký tài khoản TeachMe.vn
            </TitleText>
            <div className="text-center">
                <Text size="small" color="text-gray-600">
                    Đã có tài khoản?{' '}
                </Text>
                <a href="/sign-in">
                    <Text size="small" color="text-blue-700" underline>
                        Đăng nhập
                    </Text>
                </a>
            </div>

            <div className="p-1 max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-center">
                <div className="md:w-1/2 md:pr-4">
                    <InputField
                        type="text"
                        title="Full Name"
                        placeholder="Enter your fullname"
                        errorTitle={errors.firstName}
                        titleColor="text-blue-900"
                        onChange={(value) => setFirstName(value)}
                        required
                    />
                    <InputField
                        type="text"
                        title="Email Address"
                        placeholder="Enter your email"
                        errorTitle={errors.email}
                        titleColor="text-blue-900"
                        onChange={(value) => setEmail(value)}
                        required
                    />
                    <InputField
                        type="text"
                        title="Phone number"
                        placeholder="Enter your phone number"
                        errorTitle={errors.phoneNumber}
                        titleColor="text-blue-900"
                        onChange={(value) => setPhoneNumber(value)}
                        required
                    />
                    <InputField
                        type="password"
                        title="Password"
                        placeholder="Enter your password"
                        errorTitle={errors.password}
                        titleColor="text-blue-900"
                        onChange={(value) => setPassword(value)}
                        required
                    />
                    <InputField
                        type="password"
                        title="Re-Password"
                        placeholder="Re-enter your password"
                        errorTitle={errors.rePassword}
                        titleColor="text-blue-900"
                        onChange={(value) => setRePassword(value)}
                        required
                    />
                </div>
                {/* <div className="md:w-1/2 md:pl-4"> */}
                {/* <ComboBox
                        title="City and Province"
                        options={cityOptions}
                        onChange={(value) => setCity(value)}
                        titleColor="text-blue-900"
                        required
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                    <RadioButton
                        title="Gender"
                        options={['Male', 'Female', 'Other']}
                        onChange={(value) => setGender(value)}
                        titleColor="text-blue-900"
                        optionColor="text-blue-900"
                        required
                    />
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    <ComboBox
                        title="Year of Birth"
                        options={yearOptions}
                        onChange={(value) => setYearOfBirth(value)}
                        titleColor="text-blue-900"
                        required
                    />
                    {errors.yearOfBirth && <p className="text-red-500 text-sm">{errors.yearOfBirth}</p>}
                    <InputField
                        type="text"
                        title="Identity Card"
                        placeholder="Enter your Identity Card"
                        errorTitle={errors.identityCard}
                        titleColor="text-blue-900"
                        onChange={(value) => setIdentityCard(value)}
                        required
                    /> */}
                {/* </div> */}
            </div>
            <div className="flex flex-col items-center mt-0">
                <div className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        checked={isTutor}
                        onChange={() => setIsTutor(!isTutor)}
                        className="mr-2 accent-blue-900"
                    />
                    <Text size="small" color="text-gray-600">
                        Đăng ký làm gia sư?
                    </Text>
                </div>
                <div className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        checked={isAccept}
                        onChange={() => setIsAccept(!isAccept)}
                        className="mr-2 accent-blue-900"
                    />
                    <Text size="small" color="text-gray-600">
                        Tôi đồng ý với các điều khoản trong{' '}
                    </Text>
                    <a href="/terms">
                        <Text size="small" color="text-blue-700" underline>
                            Điều khoản sử dụng
                        </Text>
                    </a>
                </div>
                <Button
                    title="Register"
                    foreColor="white"
                    backgroundColor="bg-blue-900"
                    className="w-80 h-12 hover:bg-blue-800 hover:text-white transition-colors"
                    onClick={handleClickRegister}
                    disabled={!isAccept}
                />
                <Notification message={notification.message} show={notification.show} type={notification.type} />
            </div>
        </div>
    );
};

export default Register;
