import React from 'react';
import TutorCard from '../components/TutorCard';
import tutorImage from '../assets/Kein.jpg';
import ReviewCard from '../components/ReviewCard';

const LandingSection = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#1b223b]">
            <div className="relative mb-8">
                <div className="absolute -top-20 -left-80 bg-white rounded-full p-6 shadow-lg">Cùng con</div>
                <div className="absolute -top-20 -right-80 bg-white rounded-full p-6 shadow-lg">Sánh bước</div>
                <div className="absolute -bottom-10 bg-white rounded-full p-6 shadow-lg text-center">
                    Trên đường học
                </div>
            </div>

            <p className="text-center mb-6 p-4 text-white">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book.
            </p>

            <div className="flex space-x-4">
                <button className="bg-[#ffc569] text-[#1b223b] rounded px-4 py-2 hover:bg-[#e0aa4d]">
                    Đăng bài tìm gia sư
                </button>
                <button className="border border-[#ffc569] text-[#ffc569] rounded px-4 py-2 hover:bg-[#ffc569] hover:text-[#1b223b]">
                    Tìm gia sư
                </button>
            </div>
        </div>
    );
};

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
            {/* Tutor */}
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
const SubjectSection = () => {
    return (
        <div className="flex flex-col items-center justify-center m-5">
            <div className="grid grid-cols-4 gap-8">
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">Gia sư Toán</h2>
                    <p className="text-gray-600">1222 gia sư</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">Gia sư Tiếng anh</h2>
                    <p className="text-gray-600">1222 gia sư</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">Gia sư Hóa học</h2>
                    <p className="text-gray-600">1222 gia sư</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">Gia sư Ngữ văn</h2>
                    <p className="text-gray-600">1222 gia sư</p>
                </div>
            </div>
        </div>
    );
};

const ProgressSection = () => {
    return (
        <div className="space-y-12 px-6">
            {/* Dòng 1 */}
            <div className="flex items-center space-x-6 justify-center bg-[#ffc569] p-6 rounded-lg">
                <p className="text-xl text-[#1b223b] max-w-lg text-center">
                    Tìm kiếm gia sư thông qua các bài đăng, tiêu chí mà bạn mong muốn
                </p>
                <img src={tutorImage} alt="Step 1" className="w-36 h-48 rounded-lg shadow-md" />
            </div>

            {/* Dòng 2 */}
            <div className="flex items-center space-x-6 justify-center">
                <img src={tutorImage} alt="Step 2" className="w-36 h-48 rounded-lg shadow-md" />
                <p className="text-xl text-[#1b223b] max-w-lg text-center">
                    Thương lượng lịch học, học phí theo nhu cầu
                </p>
            </div>

            {/* Dòng 3 */}
            <div className="flex items-center space-x-6 justify-center bg-[#ffc569] p-6 rounded-lg">
                <p className="text-xl text-[#1b223b] max-w-lg text-center">
                    Cùng giải quyết các vấn đề khó khăn trong môn học trong các lớp trực tuyến và trực tiếp!
                </p>
                <img src={tutorImage} alt="Step 3" className="w-36 h-48 rounded-lg shadow-md" />
            </div>

            {/* Dòng 4 */}
            <div className="flex items-center space-x-6 justify-center p-6 rounded-lg">
                <img src={tutorImage} alt="Step 4" className="w-36 h-48 rounded-lg shadow-md" />
                <p className="text-xl text-[#1b223b] max-w-lg text-center">Tận hưởng khoá học!</p>
            </div>
        </div>
    );
};

const StartSection = () => {
    return (
        <div className="bg-[#1b223b] text-white font-sans text-center p-20">
            <h1 className="text-4xl font-bold mb-6">Hàng ngàn học viên lựa chọn tham gia với TeachMe hằng tháng!</h1>
            <button className="bg-[#ffc569] text-[#1b223b] px-5 py-2 rounded-md text-lg cursor-pointer">
                Bắt đầu học!
            </button>
        </div>
    );
};

const ReviewSection = () => {
    // Temporary data for reviews
    const reviews = [
        {
            id: 1,
            title: 'Gia sư dạy dễ hiểu, rất thân thiện với học viên.',
            rating: 5,
            image: tutorImage,
            tags: ['Hoá học', 'Đại học'],
            content:
                'Mỗi buổi học đều rất thú vị và dễ dàng, gia sư biết cách ví dụ và giảng dạy dễ hiểu. Sẽ book lại lần sau~.',
        },
        {
            id: 2,
            title: 'Giảng viên dạy dễ hiểu, có nhiều phương pháp học khác nhau.',
            rating: 4.8,
            image: tutorImage,
            tags: ['Toán học', 'Luyện thi'],
            content:
                'Giảng viên có nhiều kinh nghiệm và dễ tiếp cận. Những buổi học đều rất hiệu quả và giúp mình tiến bộ nhanh chóng.',
        },
        {
            id: 3,
            title: 'Thầy cô nhiệt tình, luôn hỗ trợ học viên hết mình.',
            rating: 4.5,
            image: tutorImage,
            tags: ['Tiếng Anh', 'Trung học'],
            content:
                'Thầy cô luôn tạo không khí học tập thoải mái, dễ hiểu, và rất kiên nhẫn khi giảng dạy. Cảm ơn thầy cô nhiều!',
        },
        {
            id: 4,
            title: 'Gia sư dạy rất chi tiết và dễ hiểu, rất vui vẻ.',
            rating: 4.9,
            image: tutorImage,
            tags: ['Lịch sử', 'Cao đẳng'],
            content: 'Mình học rất tiến bộ nhờ sự hỗ trợ của gia sư. Mỗi buổi học đều rất thú vị và dễ dàng hiểu bài.',
        },
        {
            id: 5,
            title: 'Gia sư rất tận tâm và chu đáo, giảng bài dễ hiểu.',
            rating: 4.7,
            image: tutorImage,
            tags: ['Vật lý', 'THPT'],
            content:
                'Gia sư giúp tôi giải thích bài tập rất chi tiết và dễ hiểu, giúp tôi ôn luyện tốt cho kỳ thi sắp tới.',
        },
        {
            id: 6,
            title: 'Thầy giáo rất nghiêm túc, dạy bài rất logic.',
            rating: 5,
            image: tutorImage,
            tags: ['Toán học', 'Luyện thi'],
            content:
                'Thầy rất kiên nhẫn trong việc giảng dạy, và luôn tìm cách giải thích các khái niệm một cách dễ hiểu.',
        },
    ];

    return (
        <section className="bg-[#f9f9f9] py-10 px-4">
            {/* Review Section */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#1b223b]">Đánh giá của học viên về gia sư</h2>
                <p className="text-[#606060] mt-4">Xem những phản hồi tuyệt vời từ học viên đã học cùng gia sư</p>
            </div>

            <div className="flex justify-center">
                <div className="flex space-x-6 overflow-x-scroll scrollbar-hide">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            avatar={review.image}
                            rating={review.rating}
                            title={review.title}
                            content={review.content}
                            tags={review.tags}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CommitSection = () => {
    return (
        <div className="space-y-12 px-6">
            {/* Dòng 1 */}
            <div className="flex items-center space-x-6 justify-center bg-[#ffc569] p-6 rounded-lg">
                <img src={tutorImage} alt="Step 1" className="w-36 h-48 rounded-lg shadow-md" />
                <div className="text-center mb-8">
                    <h2 className="text-xl text-[#1b223b] max-w-lg text-center">
                        Các lớp học đảm bảo kiến thức cho học viên
                    </h2>
                    <p className="text-base text-[#1b223b] max-w-lg text-center">100% hiểu bài, 100% hài lòng</p>
                </div>
            </div>

            {/* Dòng 2 */}
            <div className="flex items-center space-x-6 justify-center">
                <div className="text-center mb-8">
                    <h2 className="text-xl text-[#1b223b] max-w-lg text-center">Trở thành gia sư của TeachMe</h2>
                    <p className="text-base text-[#1b223b] max-w-lg text-center">
                        Đảm bảo học phí và quyền lợi của gia sư.
                    </p>
                    <div className="flex justify-center space-x-4 m-4">
                        <a href="#" className="text-[#ffc569] hover:text-[#e0aa4d]">
                            Chính sách
                        </a>
                        <a href="#" className="text-[#ffc569] hover:text-[#e0aa4d]">
                            Quy tắc
                        </a>
                        <a href="#" className="text-[#ffc569] hover:text-[#e0aa4d]">
                            Yêu cầu
                        </a>
                    </div>

                    <button className="bg-[#ffc569] hover:bg-[#e0aa4d] text-white font-bold py-2 px-4 rounded">
                        Trở thành gia sư
                    </button>
                </div>
                <img src={tutorImage} alt="Step 2" className="w-36 h-48 rounded-lg shadow-md" />
            </div>

            {/* Dòng 3 */}
            <div className="flex items-center space-x-6 justify-center bg-[#ffc569] p-6 rounded-lg">
                <img src={tutorImage} alt="Step 1" className="w-36 h-48 rounded-lg shadow-md" />
                <div className="text-center mb-8">
                    <h2 className="text-xl text-[#1b223b] max-w-lg text-center">Tìm kiếm gia sư thông qua TeachMe</h2>
                    <p className="text-base text-[#1b223b] max-w-lg text-center">
                        Bạn sẽ tìm được gia sư hợp theo từng nhu cầu mà bạn đưa ra, từ giới tính, độ tuổi, trình độ lẫn
                        hình thức học!
                    </p>
                    <button className="bg-[#1b223b] hover:bg-[#2a3349] text-white font-bold py-2 px-4 rounded">
                        Trở thành gia sư
                    </button>
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    return (
        <>
            <LandingSection />
            <SubjectSection />
            <TutorSection />
            <ProgressSection />
            <StartSection />
            <ReviewSection />
            <CommitSection />
        </>
    );
};

export default Home;
