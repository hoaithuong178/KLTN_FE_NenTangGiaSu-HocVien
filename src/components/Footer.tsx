import { Link } from 'react-router-dom';
import Logo from '../assets/FullLogo.png';
const Footer = () => {
    const links = [
        { to: '/', label: 'Trang chủ' },
        { to: '/posts-landing', label: 'Bài đăng' },
        { to: '/tutors-landing', label: 'Gia sư' },
        { to: '/faqs', label: 'FAQs' },
        { to: '/contact', label: 'Liên hệ' },
    ];
    return (
        <footer className="bg-[#1b223b] text-white px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Column 1 */}
                <div>
                    <img src={Logo} alt="Logo" className="h-12 object-contain mb-4" />
                    <div className="flex space-x-4 mb-4">
                        <a href="#" className="hover:text-[#ffc569]">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="hover:text-[#ffc569]">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="hover:text-[#ffc569]">
                            <i className="fas fa-envelope"></i>
                        </a>
                        <a href="#" className="hover:text-[#ffc569]">
                            <i className="fab fa-zalo"></i>
                        </a>
                    </div>
                    <p>12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM</p>
                </div>

                {/* Column 2 */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        {links.map(({ to, label }) => (
                            <li key={to}>
                                <Link to={to} className="hover:text-[#ffc569] transition-colors duration-300">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3 */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">About Us</h3>
                    <p className="text-sm">
                        Chúng tôi là nền tảng kết nối gia sư và học viên, mang đến những trải nghiệm học tập tốt nhất và
                        minh bạch trong các dịch vụ.
                    </p>
                </div>

                {/* Column 4 */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Theo dõi trên Facebook</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="w-full h-16 bg-gray-300 rounded-md"></div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
