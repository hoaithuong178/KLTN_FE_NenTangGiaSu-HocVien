import tutorImage from '../assets/Kein.jpg';
import HeroImage from '../assets/HeroSection.svg';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ReviewCard from '../components/ReviewCard';
import TutorCard from '../components/TutorCard';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const LandingSection = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-row mt-16 items-center justify-between h-screen bg-[#1b223b] px-12">
            {/* Left Side - Text & Form */}
            <div className="flex flex-col max-w-lg text-white">
                <h1 className="text-5xl font-bold mb-4 text-[#ffc569]">TeachMe</h1>
                <p className="text-lg leading-relaxed mb-6">Sánh bước cùng bạn trên con đường học tập</p>

                {/* Tutor Request Form */}
                <div className="bg-transparent p-6 rounded-lg shadow-lg border border-white">
                    <h2 className="text-xl font-semibold mb-4">Đăng bài tuyển gia sư ngay!</h2>
                    <form className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Tiêu đề"
                            className="p-3 border border-white rounded bg-transparent text-white placeholder-gray-300"
                        />
                        <div className="flex space-x-4">
                            <input
                                type="number"
                                placeholder="Giá mỗi buổi (VNĐ)"
                                className="p-3 border border-white rounded bg-transparent text-white placeholder-gray-300 w-1/2"
                            />
                            <input
                                type="number"
                                placeholder="Số buổi"
                                className="p-3 border border-white rounded bg-transparent text-white placeholder-gray-300 w-1/2"
                            />
                        </div>
                        <select className="p-3 border border-white rounded bg-transparent text-white">
                            <option value="online" className="text-black">
                                Học Online
                            </option>
                            <option value="offline" className="text-black">
                                Học Trực Tiếp
                            </option>
                        </select>
                        <textarea
                            placeholder="Mô tả đơn giản"
                            className="p-3 border border-white rounded bg-transparent text-white placeholder-gray-300 h-24"
                        ></textarea>
                        <div className="flex space-x-4">
                            <button
                                className="bg-[#ffc569] text-[#1b223b] font-semibold rounded-full px-6 py-3 text-lg shadow-md transition-all duration-300 hover:bg-[#e0aa4d]"
                                onClick={() => navigate('/sign-in')}
                            >
                                Đăng bài
                            </button>
                            <button
                                className="border-2 border-[#ffc569] text-[#ffc569] font-semibold rounded-full px-6 py-3 text-lg shadow-md transition-all duration-300 hover:bg-[#ffc569] hover:text-[#1b223b]"
                                onClick={() => navigate('/tutors-landing')}
                            >
                                Tìm gia sư
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Image & Shapes */}
            <div className="relative w-1/2 flex justify-center">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#ffc569] rounded-full opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#e0aa4d] rounded-lg opacity-50 rotate-12"></div>
                <img src={HeroImage} alt="TeachMe Banner" className="w-full max-w-lg rounded-lg shadow-lg" />
            </div>
        </div>
    );
};

const TutorSection = () => {
    // Temporary data for tutors
    const tutors = [
        { id: 1, name: 'Nguyễn Thuỳ Trang', experience: '7 năm', rating: 5, image: tutorImage },
        { id: 2, name: 'Lê Anh Tuấn', experience: '5 năm', rating: 4.5, image: tutorImage },
        { id: 3, name: 'Phạm Minh Châu', experience: '3 năm', rating: 4, image: tutorImage },
        { id: 4, name: 'Trần Gia Bảo', experience: '10 năm', rating: 5, image: tutorImage },
        { id: 5, name: 'Vũ Hoàng Yến', experience: '2 năm', rating: 4, image: tutorImage },
        { id: 6, name: 'Đỗ Quốc Đạt', experience: '6 năm', rating: 4.8, image: tutorImage },
    ];

    return (
        <section className="bg-[#f9f9f9] py-16 px-6">
            {/* Tutor Section Heading */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#1b223b]">Tìm kiếm gia sư phù hợp</h2>
                <p className="text-[#606060] mt-4 max-w-2xl mx-auto">
                    Cho con một nền tảng kiến thức vững chắc trên tinh thần thoải mái, vui vẻ.
                </p>
            </div>

            {/* Tutors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {tutors.map((tutor) => (
                    <TutorCard
                        key={tutor.id}
                        name={tutor.name}
                        experience={tutor.experience}
                        rating={tutor.rating}
                        image={tutor.image}
                        className="hover:shadow-lg transition-transform transform hover:scale-105"
                    />
                ))}
            </div>

            {/* View More Button */}
            <div className="text-center mt-10">
                <Button
                    title="Xem thêm gia sư"
                    backgroundColor="#1E3A8A"
                    hoverBackgroundColor="#1E40AF"
                    foreColor="white"
                    className="px-6 py-3 rounded-full text-lg font-semibold"
                />
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
        <div className="space-y-12 px-6 max-w-4xl mx-auto">
            {[
                // Danh sách các bước
                {
                    text: 'Tìm kiếm gia sư thông qua các bài đăng, tiêu chí mà bạn mong muốn',
                    bg: 'bg-[#ffc569]',
                    reverse: false,
                },
                {
                    text: 'Thương lượng lịch học, học phí theo nhu cầu',
                    bg: 'bg-transparent',
                    reverse: true,
                },
                {
                    text: 'Cùng giải quyết các vấn đề khó khăn trong môn học trong các lớp trực tuyến và trực tiếp!',
                    bg: 'bg-[#ffc569]',
                    reverse: false,
                },
                {
                    text: 'Tận hưởng khoá học!',
                    bg: 'bg-transparent',
                    reverse: true,
                },
            ].map((step, index) => (
                <div
                    key={index}
                    className={`flex items-center space-x-6 justify-between p-6 rounded-lg shadow-lg ${step.bg} ${
                        step.reverse ? 'flex-row-reverse' : ''
                    }`}
                >
                    <p className="text-xl text-[#1b223b] max-w-lg text-center font-medium">{step.text}</p>
                    <img src={tutorImage} alt={`Step ${index + 1}`} className="w-40 h-52 rounded-lg shadow-md" />
                </div>
            ))}
        </div>
    );
};

const StartSection = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#1b223b] text-white font-sans text-center p-20">
            <h1 className="text-4xl font-bold mb-6">Hàng ngàn học viên lựa chọn tham gia với TeachMe hằng tháng!</h1>
            <button
                className="bg-[#ffc569] text-[#1b223b] px-5 py-2 rounded-md text-lg cursor-pointer"
                onClick={() => navigate('/sign-in')}
            >
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
            name: 'Nguyễn Thị Hương',
            title: 'Gia sư dạy dễ hiểu, rất thân thiện với học viên.',
            rating: 5,
            image: tutorImage,
            tags: ['Hoá học', 'Đại học'],
            content:
                'Mỗi buổi học đều rất thú vị và dễ dàng, gia sư biết cách ví dụ và giảng dạy dễ hiểu. Sẽ book lại lần sau~.',
        },
        {
            id: 2,
            name: 'Trần Minh Anh',
            title: 'Giảng viên dạy dễ hiểu, có nhiều phương pháp học khác nhau.',
            rating: 4.8,
            image: tutorImage,
            tags: ['Toán học', 'Luyện thi'],
            content:
                'Giảng viên có nhiều kinh nghiệm và dễ tiếp cận. Những buổi học đều rất hiệu quả và giúp mình tiến bộ nhanh chóng.',
        },
        {
            id: 3,
            name: 'Lê Thị Bích',
            title: 'Thầy cô nhiệt tình, luôn hỗ trợ học viên hết mình.',
            rating: 4.5,
            image: tutorImage,
            tags: ['Tiếng Anh', 'Trung học'],
            content:
                'Thầy cô luôn tạo không khí học tập thoải mái, dễ hiểu, và rất kiên nhẫn khi giảng dạy. Cảm ơn thầy cô nhiều!',
        },
        {
            id: 4,
            name: 'Phạm Văn Cường',
            title: 'Gia sư dạy rất chi tiết và dễ hiểu, rất vui vẻ.',
            rating: 4.9,
            image: tutorImage,
            tags: ['Lịch sử', 'Cao đẳng'],
            content: 'Mình học rất tiến bộ nhờ sự hỗ trợ của gia sư. Mỗi buổi học đều rất thú vị và dễ dàng hiểu bài.',
        },
        {
            id: 5,
            name: 'Nguyễn Thị Hương',
            title: 'Gia sư rất tận tâm và chu đáo, giảng bài dễ hiểu.',
            rating: 4.7,
            image: tutorImage,
            tags: ['Vật lý', 'THPT'],
            content:
                'Gia sư giúp tôi giải thích bài tập rất chi tiết và dễ hiểu, giúp tôi ôn luyện tốt cho kỳ thi sắp tới.',
        },
        {
            id: 6,
            name: 'Trần Minh Anh',
            title: 'Thầy giáo rất nghiêm túc, dạy bài rất logic.',
            rating: 5,
            image: tutorImage,
            tags: ['Toán học', 'Luyện thi'],
            content:
                'Thầy rất kiên nhẫn trong việc giảng dạy, và luôn tìm cách giải thích các khái niệm một cách dễ hiểu.',
        },
    ];

    return (
        <section className="bg-[#f9f9f9] py-16 px-6">
            {/* Review Section Heading */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#1b223b]">Đánh giá của học viên về gia sư</h2>
                <p className="text-[#606060] mt-4 max-w-2xl mx-auto">
                    Xem những phản hồi tuyệt vời từ học viên đã học cùng gia sư.
                </p>
            </div>

            {/* Review Cards Container */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <ReviewCard
                            name={review.name}
                            key={review.id}
                            avatar={review.image}
                            rating={review.rating}
                            title={review.title}
                            content={review.content}
                            tags={review.tags}
                            className="transition-transform transform hover:scale-105 hover:shadow-lg"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CommitSection = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-12 px-6 mb-8">
            {/* Dòng 1 */}
            <div className="grid md:grid-cols-2 items-center gap-6 bg-[#ffc569] p-6 rounded-lg shadow-md">
                <img src={tutorImage} alt="Step 1" className="w-36 h-48 rounded-lg shadow-md mx-auto" />
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-[#1b223b] max-w-lg mx-auto">
                        Các lớp học đảm bảo kiến thức cho học viên
                    </h2>
                    <p className="text-base text-[#1b223b] max-w-lg mx-auto mt-2">100% hiểu bài, 100% hài lòng</p>
                </div>
            </div>

            {/* Dòng 2 */}
            <div className="grid md:grid-cols-2 items-center gap-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-[#1b223b] max-w-lg mx-auto">
                        Trở thành gia sư của TeachMe
                    </h2>
                    <p className="text-base text-[#1b223b] max-w-lg mx-auto mt-2">
                        Đảm bảo học phí và quyền lợi của gia sư.
                    </p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <a href="#" className="text-[#ffc569] hover:text-[#e0aa4d] font-medium">
                            Chính sách
                        </a>
                        <a href="#" className="text-[#ffc569] hover:text-[#e0aa4d] font-medium">
                            Quy tắc
                        </a>
                        <a href="#" className="text-[#ffc569] hover:text-[#e0aa4d] font-medium">
                            Yêu cầu
                        </a>
                    </div>

                    <button
                        className="mt-4 bg-[#ffc569] hover:bg-[#e0aa4d] text-white font-bold py-2 px-6 rounded-lg shadow-md"
                        onClick={() => navigate('/sign-in')}
                    >
                        Trở thành gia sư
                    </button>
                </div>
                <img src={tutorImage} alt="Step 2" className="w-36 h-48 rounded-lg shadow-md mx-auto" />
            </div>

            {/* Dòng 3 */}
            <div className="grid md:grid-cols-2 items-center gap-6 bg-[#ffc569] p-6 rounded-lg shadow-md">
                <img src={tutorImage} alt="Step 3" className="w-36 h-48 rounded-lg shadow-md mx-auto" />
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-[#1b223b] max-w-lg mx-auto">
                        Tìm kiếm gia sư thông qua TeachMe
                    </h2>
                    <p className="text-base text-[#1b223b] max-w-lg mx-auto mt-2">
                        Bạn sẽ tìm được gia sư hợp theo từng nhu cầu mà bạn đưa ra, từ giới tính, độ tuổi, trình độ lẫn
                        hình thức học!
                    </p>
                    <button
                        className="mt-4 bg-[#1b223b] hover:bg-[#2a3349] text-white font-bold py-2 px-6 rounded-lg shadow-md"
                        onClick={() => navigate('/tuors-landing')}
                    >
                        Tìm gia sư ngay
                    </button>
                </div>
            </div>
        </div>
    );
};
const Home = () => {
    return (
        <>
            <Header />
            <LandingSection />
            <SubjectSection />
            <TutorSection />
            <ProgressSection />
            <StartSection />
            <ReviewSection />
            <CommitSection />
            <Footer />
        </>
    );
};

export default Home;
