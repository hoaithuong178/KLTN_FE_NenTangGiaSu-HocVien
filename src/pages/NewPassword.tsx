import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Text, TitleText } from '../components/Text';
import { InputField } from '../components/InputField';
import { useNavigate } from 'react-router-dom';

const NewPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setError(''); // Xóa lỗi khi người dùng thay đổi mật khẩu
    };

    const handleRePasswordChange = (value: string) => {
        setRePassword(value);
        setError(''); // Xóa lỗi khi người dùng thay đổi mật khẩu nhập lại
    };

    const handleSubmit = () => {
        // Kiểm tra mật khẩu nhập lại có khớp không
        if (password !== rePassword) {
            setError('Mật khẩu không khớp!');
        }
        // Kiểm tra nếu mật khẩu không hợp lệ (regex không đúng)
        else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            setError('Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ cái và số!');
        } else {
            setError(''); // Nếu không có lỗi, xóa lỗi
            // Chuyển hướng tới trang NotifySuccess
            navigate('/notify-success', { state: { type: 'new-password', from: 'new-password' } });
        }
    };

    return (
        <div className="absolute top-0 left-0 flex flex-col justify-center items-center bg-[#1B223B] text-white h-screen w-screen">
            {/* Tiêu đề */}
            <TitleText level={1} className="text-center mb-4" color="text-customYellow">
                Đặt lại mật khẩu
            </TitleText>
            {/* Mô tả */}
            <Text size="medium" color="text-gray-400" className="mb-8">
                Nhập mật khẩu mới của bạn
            </Text>

            {/* Mật khẩu */}
            <InputField
                type="password"
                title="Mật khẩu mới"
                placeholder="Enter new password"
                errorTitle={error}
                titleColor="text-customYellow"
                onChange={handlePasswordChange}
                required
                className="w-[400px]"
            />

            {/* Nhập lại mật khẩu */}
            <InputField
                type="password"
                title="Nhập lại mật khẩu"
                placeholder="Re-enter your password"
                errorTitle={error}
                titleColor="text-customYellow"
                onChange={handleRePasswordChange}
                required
                className="w-[400px]"
            />

            {/* Nút đặt lại mật khẩu */}
            <Button
                title="Đặt lại mật khẩu"
                foreColor="#1B223B"
                backgroundColor="#FFC569"
                className="w-60 h-12 mt-4"
                onClick={handleSubmit}
            />
            <div className="flex margin-top-4">
                {/* Quay lại Đăng nhập */}
                <a href="/login">
                    <Text size="small" color="text-gray-400">
                        Quay lại{'  '}
                    </Text>
                    <Text size="small" color="text-blue-500">
                        Đăng nhập
                    </Text>
                </a>
            </div>
        </div>
    );
};

export default NewPassword;
