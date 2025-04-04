import React from 'react';

type TextProps = {
    size?: 'small' | 'medium' | 'large'; // Kích thước chữ
    weight?: 'normal' | 'bold'; // Độ đậm của chữ
    color?: string; // Màu chữ
    underline?: boolean; // Có gạch chân không
    className?: string; // Các lớp CSS tùy chỉnh
    children: React.ReactNode; // Nội dung bên trong
};

export const Text: React.FC<TextProps> = ({
    size = 'medium',
    weight = 'normal',
    color = 'text-black',
    underline = false,
    className = '',
    children,
}) => {
    const sizeClass = size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base';
    const weightClass = weight === 'bold' ? 'font-bold' : 'font-normal';
    const underlineClass = underline ? 'underline' : '';

    return <span className={`${sizeClass} ${weightClass} ${color} ${underlineClass} ${className}`}>{children}</span>;
};

type TitleTextProps = {
    children: React.ReactNode; // Nội dung tiêu đề
    level?: 1 | 2 | 3 | 4 | 5 | 6; // Mức tiêu đề (H1-H6)
    size?: 'small' | 'medium' | 'large'; // Kích thước chữ
    weight?: 'normal' | 'bold'; // Độ đậm
    italic?: boolean; // In nghiêng
    underline?: boolean; // Gạch chân
    color?: string; // Màu sắc (hex, rgb, hoặc class Tailwind)
    className?: string; // Lớp CSS tùy chỉnh
};

export const TitleText: React.FC<TitleTextProps> = ({
    children,
    level = 1,
    size = 'large',
    weight = 'bold',
    italic = false,
    underline = false,
    color = 'text-gray-800',
    className = '',
}) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements; // Xác định thẻ tiêu đề (h1-h6)

    // Tạo các class động cho tiêu đề
    const sizeClass = size === 'small' ? 'text-lg' : size === 'medium' ? 'text-xl' : 'text-2xl';
    const weightClass = weight === 'bold' ? 'font-bold' : 'font-normal';
    const italicClass = italic ? 'italic' : '';
    const underlineClass = underline ? 'underline' : '';
    const colorClass = color;

    return (
        <Tag
            className={`font-sans ${sizeClass} ${weightClass} ${italicClass} ${underlineClass} ${colorClass} ${className}`}
        >
            {children}
        </Tag>
    );
};

interface MultiLineTextProps {
    text?: string;
    locations?: string[];
    schedule?: string[];
}

export const MultiLineText: React.FC<MultiLineTextProps> = ({ text, locations, schedule }) => {
    if (text) {
        return <span className="whitespace-pre-line">{text}</span>;
    }

    if (locations && locations.length > 0) {
        return (
            <span className="whitespace-pre-line">
                {locations.map((location, index) => (
                    <React.Fragment key={index}>
                        {location}
                        {index < locations.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </span>
        );
    }

    if (schedule && schedule.length > 0) {
        return (
            <span className="whitespace-pre-line">
                {schedule.map((time, index) => (
                    <React.Fragment key={index}>
                        {time}
                        {index < schedule.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </span>
        );
    }

    return null;
};
