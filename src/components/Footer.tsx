import { Link } from 'react-router-dom';
import Logo from '../assets/FullLogo.png';
const Footer = () => {
    const links = [
        { to: '/', label: 'Trang chủ' },
        { to: 'subjects', label: 'Môn học' },
        { to: 'tutors', label: 'Gia sư' },
        { to: 'process', label: 'Quy trình' },
        { to: 'reviews', label: 'Đánh giá' },
        { to: 'contact', label: 'Liên hệ' },
    ];
    return (
        <footer className="bg-[#1b223b] text-white px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Column 1 */}
                <div>
                    <Link to="/">
                        <img src={Logo} alt="Logo" className="h-12 object-contain mb-4" />
                    </Link>
                    <div className="flex space-x-4 mb-4">
                        <a
                            href="https://facebook.com/teachme"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#ffc569]"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                        </a>
                        <a
                            href="https://instagram.com/teachme"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#ffc569]"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a href="mailto:support@teachme.com" className="hover:text-[#ffc569]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </a>
                        <a
                            href="https://zalo.me/teachme"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#ffc569]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
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
                                <Link
                                    to={to.startsWith('/') ? to : `#${to}`}
                                    className="hover:text-[#ffc569] transition-colors duration-300"
                                >
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
