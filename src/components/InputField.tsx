import React, { useState } from 'react';
import { Text } from './Text';

type InputFieldProps = {
    type: 'text' | 'date' | 'password'; // Input type
    title: string; // Input title
    placeholder?: string; // Placeholder (optional)
    regex?: RegExp; // Validation regex (optional)
    errorTitle?: string; // Error message (optional)
    onChange?: (value: string) => void; // Callback on value change
    titleColor?: string; // Title color (optional)
    required?: boolean; // Field is required (optional)
    className?: string; // Allow className to be passed for custom styles
};

export const InputField: React.FC<InputFieldProps> = ({
    type,
    title,
    placeholder,
    regex,
    errorTitle,
    onChange,
    titleColor = 'text-black', // Default title color
    required = false, // Default to not required
    className = '', // Default className is empty if not provided
}) => {
    const [value, setValue] = useState<string>(''); // To store input value
    const [error, setError] = useState<string>(''); // To store error message

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setValue(inputValue);

        // Reset error if value is valid
        if (required && !inputValue) {
            setError('Trường này là bắt buộc!');
        } else if (regex && !regex.test(inputValue)) {
            // Show the custom error message passed via `errorTitle` instead of default "Giá trị không hợp lệ!"
            setError(errorTitle || 'Giá trị không hợp lệ!');
        } else {
            setError(''); // Clear the error if input is valid
        }

        // Pass the value to parent component if provided
        if (onChange) {
            onChange(inputValue);
        }
    };

    return (
        <div className="mb-6">
            {/* Display title with required asterisk */}
            <Text size="small" weight="bold" className={`block mb-2 text-left ${titleColor}`}>
                {title} {required && <span className="text-red-500">*</span>}
            </Text>
            {/* Input field with dynamic class */}
            <input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full p-1 border rounded-md text-gray-800 focus:outline-none focus:ring-2 ${className} ${
                    error || errorTitle ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                required={required}
            />
            {/* Show error message if any */}
            {error || errorTitle ? <p className="text-red-500 text-sm mt-2">{error || errorTitle}</p> : null}
        </div>
    );
};

type ComboBoxProps = {
    title: string; // Tiêu đề của combobox
    options: string[]; // Danh sách các tỉnh thành
    onChange?: (value: string) => void; // Hàm callback khi giá trị thay đổi
    titleColor?: string; // Tailwind class cho màu tiêu đề (optional)
    required?: boolean; // Field is required (optional)
};

export const ComboBox: React.FC<ComboBoxProps> = ({
    title,
    options,
    onChange,
    titleColor = 'text-black',
    required = false,
}) => {
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedValue(value);

        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className="mb-6">
            {/* Hiển thị dấu * nếu required */}
            <p className={`block mb-2 text-left font-bold ${titleColor}`}>
                {title} {required && <span className="text-red-500">*</span>}
            </p>
            <select
                value={selectedValue}
                onChange={handleChange}
                className="w-full p-1 border rounded-md text-gray-800 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
                required={required}
            >
                <option value="">{title}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

type RadioButtonProps = {
    title: string; // Tiêu đề của radio button
    options: string[]; // Danh sách các lựa chọn
    onChange?: (value: string) => void; // Hàm callback khi giá trị thay đổi
    titleColor?: string; // Tailwind class cho màu tiêu đề (optional)
    optionColor: string;
    required?: boolean; // Field is required (optional)
};

export const RadioButton: React.FC<RadioButtonProps> = ({
    title,
    options,
    onChange,
    titleColor = 'text-black', // Màu tiêu đề mặc định
    optionColor = 'text-black', // Màu cho các lựa chọn mặc định
    required = false, // Default to not required
}) => {
    const [selectedOption, setSelectedOption] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedOption(value);

        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className="mb-6">
            {/* Hiển thị dấu * nếu required */}
            <p className={`block mb-2 text-left font-bold ${titleColor}`}>
                {title} {required && <span className="text-red-500">*</span>}
            </p>
            <div className="flex space-x-4">
                {options.map((option, index) => (
                    <label key={index} className="inline-flex items-center">
                        <input
                            type="radio"
                            value={option}
                            checked={selectedOption === option}
                            onChange={handleChange}
                            className="form-radio text-blue-600 focus:ring-blue-500"
                            required={required}
                        />
                        {/* Áp dụng optionColor cho text của lựa chọn */}
                        <span className={`ml-2 ${optionColor}`}>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
