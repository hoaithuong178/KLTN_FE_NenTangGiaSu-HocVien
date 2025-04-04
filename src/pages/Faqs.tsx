import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { TitleText } from '../components/Text';

// Component cho mỗi mục FAQ
interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    toggleOpen: () => void;
}
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen }) => {
    return (
        <div className="border-b border-gray-200 py-4">
            <button
                className="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
                onClick={toggleOpen}
            >
                <span className="text-lg">{question}</span>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && <div className="mt-2 text-gray-600 whitespace-pre-line">{answer}</div>}
        </div>
    );
};

// Component cho mỗi danh mục FAQ
interface FAQCategoryProps {
    title: string;
    faqs: { question: string; answer: string }[];
}

const FAQCategory: React.FC<FAQCategoryProps> = ({ title, faqs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-800">{title}</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === index}
                        toggleOpen={() => toggleFAQ(index)}
                    />
                ))}
            </div>
        </div>
    );
};

// Dữ liệu FAQ
const faqData = [
    {
        category: 'Tài khoản & Đăng ký',
        items: [
            {
                question: 'Làm thế nào để đăng ký tài khoản trên TeachMe?',
                answer: 'Để đăng ký tài khoản trên TeachMe, bạn cần truy cập trang chủ và nhấp vào nút "Đăng ký". Sau đó, bạn có thể chọn đăng ký với tư cách là học viên hoặc gia sư. Điền đầy đủ thông tin cá nhân, xác minh email và hoàn tất quá trình đăng ký.',
            },
            {
                question: 'Tôi có thể đăng ký vừa là học viên vừa là gia sư không?',
                answer: 'Hiện tại, mỗi tài khoản chỉ có thể đăng ký một vai trò (học viên hoặc gia sư). Nếu bạn muốn sử dụng cả hai vai trò, bạn cần đăng ký hai tài khoản riêng biệt với địa chỉ email khác nhau.',
            },
            {
                question: 'Làm thế nào để khôi phục mật khẩu đã quên?',
                answer: 'Nếu bạn quên mật khẩu, hãy nhấp vào liên kết "Quên mật khẩu" trên trang đăng nhập. Nhập địa chỉ email đã đăng ký và làm theo hướng dẫn được gửi đến email của bạn để đặt lại mật khẩu.',
            },
        ],
    },
    {
        category: 'Thanh toán & Học phí',
        items: [
            {
                question: 'TeachMe tính phí như thế nào?',
                answer: 'TeachMe thu phí dịch vụ 10% từ gia sư cho mỗi khóa học được hoàn thành. Học viên không phải trả bất kỳ phí dịch vụ nào cho nền tảng, chỉ thanh toán học phí trực tiếp cho gia sư theo mức đã thỏa thuận.',
            },
            {
                question: 'Các phương thức thanh toán được chấp nhận?',
                answer: 'TeachMe chấp nhận thanh toán qua ví điện tử TeachMe, thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng và các ví điện tử phổ biến như MoMo, ZaloPay, VNPay.',
            },
            {
                question: 'Làm thế nào để rút tiền từ ví TeachMe?',
                answer: 'Gia sư có thể rút tiền từ ví TeachMe bằng cách truy cập mục "Ví của tôi", chọn "Rút tiền" và làm theo hướng dẫn. Thời gian xử lý thường mất 1-3 ngày làm việc tùy thuộc vào ngân hàng của bạn.',
            },
        ],
    },
    {
        category: 'Tìm kiếm & Đặt lớp',
        items: [
            {
                question: 'Làm thế nào để tìm gia sư phù hợp?',
                answer: 'Học viên có thể sử dụng bộ lọc tìm kiếm trên trang "Tìm gia sư" để lọc theo môn học, cấp độ, khu vực, học phí và thời gian có sẵn. Bạn cũng có thể xem đánh giá và phản hồi từ học viên trước để đưa ra quyết định.',
            },
            {
                question: 'Làm thế nào để đăng bài tìm gia sư?',
                answer: 'Học viên có thể đăng bài tìm gia sư bằng cách nhấp vào "Đăng bài" trên trang chủ, điền thông tin chi tiết về nhu cầu học tập, lịch học mong muốn, mức học phí đề xuất và các yêu cầu khác.',
            },
            {
                question: 'Làm thế nào để ứng tuyển dạy một lớp?',
                answer: 'Gia sư có thể duyệt qua danh sách các bài đăng tìm gia sư và nhấp vào "Ứng tuyển" hoặc "Thương lượng giá" để liên hệ với học viên. Bạn cũng có thể đề xuất mức học phí và lịch học phù hợp.',
            },
        ],
    },
    {
        category: 'Lớp học & Buổi học',
        items: [
            {
                question: 'Làm thế nào để xác nhận lịch học?',
                answer: 'Sau khi học viên và gia sư đã thỏa thuận về học phí và lịch học, cả hai bên cần xác nhận lịch học trên hệ thống. Lịch học sẽ được hiển thị trong mục "Lớp học của tôi" và bạn sẽ nhận được thông báo nhắc nhở trước mỗi buổi học.',
            },
            {
                question: 'Tôi có thể hủy buổi học không?',
                answer: 'Có, cả học viên và gia sư đều có thể hủy buổi học ít nhất 24 giờ trước thời gian bắt đầu mà không bị phạt. Việc hủy muộn hơn có thể dẫn đến phí hủy hoặc ảnh hưởng đến đánh giá của bạn trên nền tảng.',
            },
            {
                question: 'Làm thế nào để báo cáo vấn đề trong buổi học?',
                answer: 'Nếu bạn gặp bất kỳ vấn đề nào trong buổi học, hãy liên hệ với đội ngũ hỗ trợ của TeachMe qua mục "Hỗ trợ" hoặc gửi email đến support@teachme.vn. Chúng tôi sẽ hỗ trợ giải quyết vấn đề trong thời gian sớm nhất.',
            },
        ],
    },
    {
        category: 'Đánh giá & Phản hồi',
        items: [
            {
                question: 'Làm thế nào để đánh giá gia sư/học viên?',
                answer: 'Sau khi hoàn thành khóa học hoặc một số buổi học nhất định, bạn sẽ nhận được lời nhắc để đánh giá đối tác của mình. Bạn có thể đánh giá từ 1-5 sao và để lại nhận xét chi tiết về trải nghiệm của mình.',
            },
            {
                question: 'Tôi có thể xóa đánh giá tiêu cực không?',
                answer: 'Đánh giá không thể bị xóa trừ khi vi phạm quy định cộng đồng của TeachMe. Tuy nhiên, nếu bạn cảm thấy một đánh giá không công bằng hoặc không chính xác, bạn có thể báo cáo để đội ngũ của chúng tôi xem xét.',
            },
        ],
    },
    {
        category: 'Bảo mật & Quyền riêng tư',
        items: [
            {
                question: 'TeachMe bảo vệ thông tin cá nhân của tôi như thế nào?',
                answer: 'TeachMe cam kết bảo vệ thông tin cá nhân của người dùng theo Chính sách Bảo mật của chúng tôi. Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ dữ liệu và không chia sẻ thông tin cá nhân với bên thứ ba mà không có sự đồng ý của bạn.',
            },
            {
                question: 'Tôi có thể yêu cầu xóa tài khoản và dữ liệu của mình không?',
                answer: 'Có, bạn có thể yêu cầu xóa tài khoản và dữ liệu cá nhân bằng cách liên hệ với đội ngũ hỗ trợ của chúng tôi. Chúng tôi sẽ xử lý yêu cầu của bạn theo quy định của pháp luật hiện hành về bảo vệ dữ liệu.',
            },
        ],
    },
    {
        category: 'Hỗ trợ & Liên hệ',
        items: [
            {
                question: 'Làm thế nào để liên hệ với đội ngũ hỗ trợ?',
                answer: 'Bạn có thể liên hệ với đội ngũ hỗ trợ của TeachMe qua:\n- Email: support@teachme.vn\n- Hotline: 1900 xxxx\n- Chat trực tuyến: Có sẵn trên trang web từ 8:00 - 22:00 hàng ngày\n- Mục "Trung tâm hỗ trợ" trên trang web hoặc ứng dụng',
            },
            {
                question: 'Thời gian phản hồi của đội ngũ hỗ trợ là bao lâu?',
                answer: 'Chúng tôi cam kết phản hồi mọi yêu cầu hỗ trợ trong vòng 24 giờ làm việc. Đối với các vấn đề khẩn cấp, thời gian phản hồi có thể nhanh hơn.',
            },
        ],
    },
];

const Faqs: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        // Kiểm tra trạng thái từ localStorage
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true; // Mặc định là true
    });

    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        // Mặc định mở category đầu tiên
        if (faqData.length > 0) {
            setActiveCategory(faqData[0].category);
        }
    }, []);

    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    const [showContactPopup, setShowContactPopup] = useState(false);

    const toggleContactPopup = () => {
        setShowContactPopup(!showContactPopup);
    };

    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen">
            {/* Sử dụng Navbar */}
            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />

            <div className="flex-1 flex flex-col">
                <TopNavbar />

                {/* Main Content */}
                <div className={`flex-1 p-6 overflow-auto ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                    {/* Title Text */}
                    <div className="mb-8">
                        <TitleText level={1} className="text-3xl font-bold text-gray-800">
                            Câu hỏi thường gặp (FAQ)
                        </TitleText>
                        <p className="text-gray-600 mt-2">
                            Tìm câu trả lời cho các câu hỏi phổ biến về nền tảng TeachMe
                        </p>
                    </div>

                    {/* Categories Navigation */}
                    <div className="mb-8 flex flex-wrap gap-2">
                        {faqData.map((category) => (
                            <button
                                key={category.category}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    activeCategory === category.category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => setActiveCategory(category.category)}
                            >
                                {category.category}
                            </button>
                        ))}
                    </div>

                    {/* FAQ Content */}
                    <div className="mb-12">
                        {faqData
                            .filter((category) => activeCategory === null || category.category === activeCategory)
                            .map((category) => (
                                <FAQCategory key={category.category} title={category.category} faqs={category.items} />
                            ))}
                    </div>

                    {/* Policy Links */}
                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Điều khoản & Chính sách</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                to="/terms-of-service"
                                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <h3 className="font-medium text-blue-700">Điều khoản dịch vụ</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Các điều khoản và điều kiện khi sử dụng TeachMe
                                </p>
                            </Link>
                            <Link
                                to="/privacy-policy"
                                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <h3 className="font-medium text-blue-700">Chính sách bảo mật</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn
                                </p>
                            </Link>
                            <Link
                                to="/community-guidelines"
                                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <h3 className="font-medium text-blue-700">Quy tắc cộng đồng</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Hướng dẫn về hành vi và tương tác trên nền tảng
                                </p>
                            </Link>
                            <Link
                                to="/refund-policy"
                                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <h3 className="font-medium text-blue-700">Chính sách hoàn tiền</h3>
                                <p className="text-sm text-gray-600 mt-1">Quy định về hoàn tiền và hủy buổi học</p>
                            </Link>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="mt-12 bg-blue-50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-2 text-blue-800">Không tìm thấy câu trả lời?</h2>
                        <p className="text-blue-700 mb-4">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
                        <button
                            onClick={toggleContactPopup}
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                        >
                            Liên hệ hỗ trợ
                        </button>
                    </div>

                    {showContactPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Liên hệ hỗ trợ</h2>
                                    <button
                                        onClick={toggleContactPopup}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>

                                <form className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập họ và tên của bạn"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Chủ đề
                                        </label>
                                        <select
                                            id="subject"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Chọn chủ đề --</option>
                                            <option value="account">Vấn đề tài khoản</option>
                                            <option value="payment">Vấn đề thanh toán</option>
                                            <option value="class">Vấn đề lớp học</option>
                                            <option value="technical">Vấn đề kỹ thuật</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Nội dung
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Mô tả chi tiết vấn đề của bạn..."
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={toggleContactPopup}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Gửi yêu cầu
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">Hoặc liên hệ trực tiếp qua:</p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm">
                                            <span className="font-medium">Email:</span> support@teachme.vn
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Hotline:</span> 1900 xxxx (8:00 - 22:00)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Faqs;
