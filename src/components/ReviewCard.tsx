import React from 'react';

interface ReviewCardProps {
    avatar: string;
    rating: number;
    title: string;
    content: string;
    tags: string[];
}

const ReviewCard: React.FC<ReviewCardProps> = ({ avatar, rating, title, content, tags }) => {
    const stars = Array.from({ length: 5 }, (_, index) => (index < rating ? '★' : '☆'));

    return (
        <div className="bg-white rounded-lg shadow-md p-4 max-w-sm w-full">
            <div className="flex items-start space-x-4">
                <img src={avatar} alt="user avatar" className="w-12 h-12 rounded-full" />
                <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                        <span className="text-[#ffc569]">{stars.join(' ')}</span>
                    </div>
                </div>
            </div>
            <h3 className="text-[#1b223b] font-bold text-xl">{title}</h3>
            <p className="text-[#1b223b]">{content}</p>
            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 rounded-lg text-sm"
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
