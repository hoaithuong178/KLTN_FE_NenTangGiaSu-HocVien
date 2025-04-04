import React from 'react';
import { Text } from './Text'; // Import Text component

interface ButtonProps {
    variant: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode; // Thêm thuộc tính children
    title: string; // Tiêu đề của nút
    foreColor?: string; // Màu chữ
    backgroundColor?: string; // Màu nền
    hoverForeColor?: string; // Màu chữ khi hover
    hoverBackgroundColor?: string; // Màu nền khi hover
    disabledForeColor?: string; // Màu chữ khi nút bị disable
    disabledBackgroundColor?: string; // Màu nền khi nút bị disable
    size?: 'small' | 'medium' | 'large'; // Kích thước chữ
    weight?: 'normal' | 'bold'; // Độ đậm
    disabled?: boolean; // Trạng thái nút bị vô hiệu hóa
    type?: 'button' | 'submit' | 'reset'; // Loại nút
}

export const Button: React.FC<ButtonProps> = ({
    title,
    foreColor = 'white',
    backgroundColor = '#1E3A8A', // blue-900
    hoverForeColor = 'white',
    hoverBackgroundColor = '#1E40AF', // blue-800
    disabledForeColor = '#9CA3AF', // gray-400
    disabledBackgroundColor = '#F3F4F6', // gray-100
    size = 'medium',
    weight = 'normal',
    className = '',
    onClick,
    disabled = false,
    type = 'button',
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`py-2 px-4 rounded-md ${className} transition-all duration-300`}
            style={{
                backgroundColor: disabled ? disabledBackgroundColor : backgroundColor,
                color: disabled ? disabledForeColor : foreColor,
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    (e.target as HTMLButtonElement).style.backgroundColor = hoverBackgroundColor;
                    (e.target as HTMLButtonElement).style.color = hoverForeColor;
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    (e.target as HTMLButtonElement).style.backgroundColor = backgroundColor;
                    (e.target as HTMLButtonElement).style.color = foreColor;
                }
            }}
        >
            {/* Sử dụng Text component để hiển thị nội dung */}
            <Text
                size={size}
                weight={weight}
                color={disabled ? disabledForeColor : foreColor}
                className="flex items-center justify-center"
            >
                {title}
            </Text>
        </button>
    );
};
