/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}', // Đảm bảo Tailwind quét các file trong src
    ],
    theme: {
        extend: {
            colors: {
                customYellow: '#FFC569', // Thêm màu tùy chỉnh
            },
        },
    },
    plugins: [],
};
