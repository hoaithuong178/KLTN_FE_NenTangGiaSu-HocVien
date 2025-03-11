import React from 'react';

interface TutorCardProps {
    key: number;
    name: string;
    experience: string;
    rating: number;
    image: string;
    className?: string;
}

const TutorCard: React.FC<TutorCardProps> = ({ name, experience, rating, image, className }) => {
    return (
        <div
            className={`flex flex-col items-center bg-white shadow-md rounded-2xl p-4 w-64 h-80 border border-gray-200 ${className}`}
        >
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-semibold text-[#1b223b] mb-2">{name}</h3>
            <p className="text-sm text-gray-600 mb-2">{experience}</p>
            <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, index) => (
                    <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={index < rating ? '#ffc569' : '#e5e7eb'}
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#ffc569"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.26 6.942h7.294c.969 0 1.371 1.24.588 1.81l-5.907 4.298 2.26 6.941c.3.921-.755 1.688-1.54 1.11l-5.906-4.297-5.907 4.297c-.784.578-1.838-.189-1.539-1.11l2.26-6.941L.197 11.68c-.784-.57-.38-1.81.588-1.81h7.293l2.26-6.942z"
                        />
                    </svg>
                ))}
            </div>
        </div>
    );
};

export default TutorCard;
