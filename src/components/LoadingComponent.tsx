import React from 'react';

const LoadingComponent: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-opacity-50 rounded-full animate-pulse"></div>
                </div>
                <p className="mt-4 text-gray-700 font-medium text-lg animate-pulse">Đang tải...</p>
            </div>
        </div>
    );
};

export default LoadingComponent;
