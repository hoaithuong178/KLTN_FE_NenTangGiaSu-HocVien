import React from 'react';
import TutorCard from '../components/TutorCard';
import tutorImage from '../assets/Kein.jpg';

const TutorSection = () => {
    // Temporary data for tutors
    const tutors = [
        {
            id: 1,
            name: 'Nguyễn Thuỳ Trang',
            experience: '7 năm',
            rating: 5,
            image: tutorImage,
        },
        {
            id: 2,
            name: 'Lê Anh Tuấn',
            experience: '5 năm',
            rating: 4.5,
            image: tutorImage,
        },
        {
            id: 3,
            name: 'Phạm Minh Châu',
            experience: '3 năm',
            rating: 4,
            image: tutorImage,
        },
        {
            id: 4,
            name: 'Trần Gia Bảo',
            experience: '10 năm',
            rating: 5,
            image: tutorImage,
        },
        {
            id: 5,
            name: 'Vũ Hoàng Yến',
            experience: '2 năm',
            rating: 4,
            image: tutorImage,
        },
        {
            id: 6,
            name: 'Đỗ Quốc Đạt',
            experience: '6 năm',
            rating: 4.8,
            image: tutorImage,
        },
    ];

    return (
        <section className="bg-[#f9f9f9] py-10 px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#1b223b]">Tìm kiếm gia sư phù hợp với con nhất</h2>
                <p className="text-[#606060] mt-4">
                    Cho con một nền tảng kiến thức vững chắc trên tinh thần thoải mái, vui vẻ
                </p>
            </div>

            <div className="flex justify-center">
                <div className="flex space-x-6 overflow-x-scroll scrollbar-hide">
                    {tutors.map((tutor) => (
                        <TutorCard
                            key={tutor.id}
                            name={tutor.name}
                            experience={tutor.experience}
                            rating={tutor.rating}
                            image={tutor.image}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const Home = () => {
    return <TutorSection />;
};

export default Home;
