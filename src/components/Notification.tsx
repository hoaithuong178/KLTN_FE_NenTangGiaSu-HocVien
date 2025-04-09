import React from 'react';

interface NotiTrueProps {
    message: string;
}

export const NotiTrue: React.FC<NotiTrueProps> = ({ message }) => {
    return (
        <div className="fixed top-4 right-4 z-99 animate-fade-in-out">
            <div className="bg-white border-l-4 border-blue-300 shadow-lg rounded-lg p-4 min-w-[300px] max-w-[400px]">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-6 w-6 text-blue-500"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{message}</p>
                        <div className="mt-1">
                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-300 animate-progress"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface NotiFalseProps {
    message: string;
}

export const NotiFalse: React.FC<NotiFalseProps> = ({ message }) => {
    return (
        <div className="fixed top-4 right-4 z-99 animate-fade-in-out">
            <div className="bg-white border-l-4 border-[#F97564] shadow-lg rounded-lg p-4 min-w-[300px] max-w-[400px]">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-6 w-6 text-[#F97564]"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{message}</p>
                        <div className="mt-1">
                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#F97564] animate-progress"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface NotificationProps {
    message: string;
    show: boolean;
    type?: 'success' | 'error';
    onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, show, type = 'success' }) => {
    if (!show) return null;

    return type === 'success' ? <NotiTrue message={message} /> : <NotiFalse message={message} />;
};
