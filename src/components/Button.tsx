import React from 'react';
import { Text } from './Text'; // Import Text component

type ButtonProps = {
    title: string; // Tiêu đề của nút
    foreColor?: string; // Màu chữ
    backgroundColor?: string; // Màu nền
    hoverForeColor?: string; // Màu chữ khi hover
    hoverBackgroundColor?: string; // Màu nền khi hover
    disabledForeColor?: string; // Màu chữ khi nút bị disable
    disabledBackgroundColor?: string; // Màu nền khi nút bị disable
    size?: 'small' | 'medium' | 'large'; // Kích thước chữ
    weight?: 'normal' | 'bold'; // Độ đậm
    className?: string; // ClassName để tùy chỉnh width và height
    onClick?: () => void; // Hàm callback khi nút được nhấn
    disabled?: boolean; // Trạng thái nút bị vô hiệu hóa
};

export const Button: React.FC<ButtonProps> = ({
    title,
    foreColor = '#FFC569',
    backgroundColor = '#1B223B',
    hoverForeColor = '#FFC569',
    hoverBackgroundColor = '#1B223B',
    disabledForeColor = '#B2B2B2',
    disabledBackgroundColor = '#E0E0E0',
    size = 'medium',
    weight = 'normal',
    className = '',
    onClick,
    disabled = false,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`py-2 px-4 rounded ${className} transition duration-300`}
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
