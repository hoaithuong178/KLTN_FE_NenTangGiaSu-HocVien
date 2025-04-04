import React from 'react';
import { Text } from './Text'; // Import Text component

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
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
    variant = 'primary',
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
    // Thêm logic sử dụng variant
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return {
                    bg: disabled ? disabledBackgroundColor : '#4B5563', // gray-600
                    color: disabled ? disabledForeColor : 'white',
                    hoverBg: '#374151', // gray-700
                };
            case 'danger':
                return {
                    bg: disabled ? disabledBackgroundColor : '#DC2626', // red-600
                    color: disabled ? disabledForeColor : 'white',
                    hoverBg: '#B91C1C', // red-700
                };
            case 'primary':
            default:
                return {
                    bg: disabled ? disabledBackgroundColor : backgroundColor,
                    color: disabled ? disabledForeColor : foreColor,
                    hoverBg: hoverBackgroundColor,
                };
        }
    };

    const variantStyles = getVariantStyles();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`py-2 px-4 rounded-md ${className} transition-all duration-300`}
            style={{
                backgroundColor: variantStyles.bg,
                color: variantStyles.color,
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    (e.target as HTMLButtonElement).style.backgroundColor = variantStyles.hoverBg;
                    (e.target as HTMLButtonElement).style.color = hoverForeColor;
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    (e.target as HTMLButtonElement).style.backgroundColor = variantStyles.bg;
                    (e.target as HTMLButtonElement).style.color = variantStyles.color;
                }
            }}
        >
            {/* Sử dụng Text component để hiển thị nội dung */}
            <Text
                size={size}
                weight={weight}
                color={disabled ? disabledForeColor : variantStyles.color}
                className="flex items-center justify-center"
            >
                {title}
            </Text>
        </button>
    );
};
