import React from 'react';
import { StarIcon } from './icons';

interface ReviewCardProps {
    avatar: string;
    name: string;
    rating: number;
    title: string;
    content: string;
    tags: string[];
    className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ avatar, name, rating, title, content, tags, className }) => {
    return (
        <div
            className={`bg-white rounded-xl shadow-lg p-6 w-full max-w-sm transition-transform transform hover:scale-105 hover:shadow-xl ${className}`}
        >
            {/* Avatar & Name */}
            <div className="flex items-center space-x-4 mb-3">
                <img src={avatar} alt="User avatar" className="w-14 h-14 rounded-full object-cover" />
                <div>
                    <h3 className="text-lg font-semibold text-[#1b223b]">{name}</h3>
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }, (_, index) => (
                            <StarIcon
                                key={index}
                                className={`w-6 h-6 ${index < rating ? 'fill-[#ffc569]' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Review Content */}
            <h4 className="text-xl font-bold text-[#1b223b] mb-2">{title}</h4>
            <p className="text-[#606060] mb-4">{content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                            backgroundColor: `hsl(${(index * 360) / tags.length}, 60%, 60%)`,
                            color: '#fff',
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ReviewCard;
