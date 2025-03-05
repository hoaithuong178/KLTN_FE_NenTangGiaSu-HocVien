import React from 'react';
import TutorProfileComponent from '../components/TutorProfileComponent';

const sampleTutor = {
    id: 1,
    avatar: 'https://i.pravatar.cc/150?img=3',
    name: 'Nguyễn Văn A',
    pricePerSession: 200000,
    email: 'nguyenvana@gmail.com',
    violations: 0,
    isFavorite: false,
    subjects: ['Toán', 'Lý', 'Hóa'],
    gender: 'Nam',
    educationLevel: 'Đại học',
    experience: 5,
    birthYear: 1995,
    totalClasses: 120,
    location: 'Hà Nội',
    schedule: {
        'Thứ 2': {
            morning: [
                ['07:00', '09:00'],
                ['10:00', '11:00'],
            ],
            afternoon: ['14:00', '16:00'],
        },
        'Thứ 3': { evening: ['19:00', '21:00'] },
        'Thứ 5': { morning: ['08:00', '10:00'] },
        'Thứ 6': { afternoon: ['13:00', '15:00'], evening: ['18:00', '20:00'] },
        'Thứ 7': { morning: ['09:00', '11:00'] },
        CN: { afternoon: ['14:00', '16:00'], evening: ['19:00', '21:00'] },
    },
    rating: 4.5,
    reviews: [
        {
            avatar: 'https://i.pravatar.cc/100?img=5',
            name: 'Trần Minh B',
            date: '2025-02-20',
            content: 'Gia sư rất nhiệt tình, phương pháp giảng dạy dễ hiểu.',
            rating: 5,
        },
        {
            avatar: 'https://i.pravatar.cc/100?img=8',
            name: 'Lê Thị C',
            date: '2025-02-18',
            content: 'Dạy hay nhưng hơi nghiêm khắc 😅',
            rating: 4,
        },
    ],
};

const TutorProfile = () => {
    return <TutorProfileComponent {...sampleTutor} />;
};

export default TutorProfile;
