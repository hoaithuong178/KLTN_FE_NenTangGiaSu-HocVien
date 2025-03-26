import React, { useEffect, useState } from 'react';
import { Text } from './Text';

interface InputFieldProps {
    type: 'text' | 'date' | 'password' | 'textarea'; // Thêm "textarea"
    title: string;
    placeholder?: string;
    regex?: RegExp; // Validation regex (optional)
    errorTitle?: string; // Error message (optional)
    onChange?: (value: string) => void;
    titleColor?: string; // Title color (optional)
    required?: boolean;
    className?: string; // Allow className to be passed for custom styles
    value?: string;
}

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
    value = '', // Default value is empty string
}) => {
    const [inputValue, setInputValue] = useState<string>(value); // Sử dụng value từ props làm giá trị mặc định
    const [error, setError] = useState<string>(''); // To store error message

    // Cập nhật inputValue khi value từ props thay đổi
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setInputValue(inputValue);

        // Reset error if value is valid
        if (required && !inputValue) {
            setError('Trường này là bắt buộc!');
        } else if (regex && !regex.test(inputValue)) {
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
        <div className="mb-6 mt-5">
            {/* Display title with required asterisk */}
            <Text size="medium" weight="bold" className={`block mb-2 text-left ${titleColor}`}>
                {title} {required && <span className="text-red-500">*</span>}
            </Text>
            {/* Input field with dynamic class */}
            <input
                type={type}
                value={inputValue}
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
    value?: string; // Giá trị mặc định của combobox (optional)
};

export const ComboBox: React.FC<ComboBoxProps> = ({
    title,
    options,
    onChange,
    titleColor = 'text-black',
    required = false,
    value = '', // Giá trị mặc định
}) => {
    const [selectedValue, setSelectedValue] = useState<string>(value);

    useEffect(() => {
        if (value !== selectedValue) {
            setSelectedValue(value);
        }
    }, [value, selectedValue]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setSelectedValue(newValue);

        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="mb-6">
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
    optionColor?: string;
    required?: boolean; // Field is required (optional)
    value?: string; // Giá trị mặc định của radio button (optional)
    selected?: string;
};

export const RadioButton: React.FC<RadioButtonProps> = ({
    title,
    options,
    onChange,
    titleColor = 'text-black', // Màu tiêu đề mặc định
    optionColor = 'text-black', // Màu cho các lựa chọn mặc định
    required = false, // Default to not required
    value = '', // Giá trị mặc định
    selected = '',
}) => {
    const [selectedOption, setSelectedOption] = useState<string>(selected);

    useEffect(() => {
        if (value !== selectedOption) {
            setSelectedOption(value);
        }
    }, [value, selectedOption]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSelectedOption(newValue);

        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="mb-6">
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
                        <span className={`ml-2 ${optionColor}`}>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
type CheckboxProps = {
    title: string; // Tiêu đề của checkbox
    options: string[]; // Danh sách các lựa chọn
    onChange?: (selectedValues: string[]) => void; // Hàm callback khi giá trị thay đổi
    titleColor?: string; // Tailwind class cho màu tiêu đề (optional)
    optionColor: string; // Tailwind class cho màu các lựa chọn
    required?: boolean; // Field is required (optional)
    value?: string[]; // Giá trị mặc định của checkbox (optional)
};
export const Checkbox: React.FC<CheckboxProps> = ({
    title,
    options,
    onChange,
    titleColor = 'text-black', // Màu tiêu đề mặc định
    optionColor = 'text-black', // Màu cho các lựa chọn mặc định
    required = false, // Default to not required
    value = [], // Giá trị mặc định
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(value);

    useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(selectedOptions)) {
            setSelectedOptions(value || []);
        }
    }, [value, selectedOptions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: optionValue } = e.target;
        setSelectedOptions((prev) =>
            prev.includes(optionValue) ? prev.filter((option) => option !== optionValue) : [...prev, optionValue],
        );

        if (onChange) {
            onChange(
                selectedOptions.includes(optionValue)
                    ? selectedOptions.filter((option) => option !== optionValue)
                    : [...selectedOptions, optionValue],
            );
        }
    };

    return (
        <div className="mb-6">
            <p className={`block mb-2 text-left font-bold ${titleColor}`}>
                {title} {required && <span className="text-red-500">*</span>}
            </p>
            <div className="flex flex-wrap space-x-4">
                {options.map((option, index) => (
                    <label key={index} className="inline-flex items-center mb-2">
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedOptions.includes(option)}
                            onChange={handleChange}
                            className="form-checkbox text-blue-600 focus:ring-blue-500"
                            required={required && selectedOptions.length === 0}
                        />
                        <span className={`ml-2 ${optionColor}`}>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
