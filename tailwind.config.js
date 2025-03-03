/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                customYellow: '#FFC569', // Thêm màu tùy chỉnh
            },
            keyframes: {
                'fade-in-out': {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '10%': { opacity: '1', transform: 'translateY(0)' },
                    '90%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(-10px)' },
                },
                fadeInOut: {
                    '0%': { opacity: '0' },
                    '20%': { opacity: '1' },
                    '80%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
            },
            animation: {
                'fade-in-out': 'fade-in-out 3s ease-in-out',
                fadeInOut: 'fadeInOut 2s ease-in-out',
            },
        },
    },
    plugins: [],
};
