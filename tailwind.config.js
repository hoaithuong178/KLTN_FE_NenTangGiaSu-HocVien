/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                customYellow: '#FFC569', // Thêm màu tùy chỉnh
            },
        },
    },
    plugins: [],
};
