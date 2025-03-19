import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/Button'; // Giả sử bạn đã có Button component
import ContactImage from '../assets/SignIn3.jpg'; // Giả sử bạn có ảnh trang trí
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Xử lý gửi form (có thể gọi API ở đây)
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' }); // Reset form
        setTimeout(() => setSubmitted(false), 3000); // Ẩn thông báo sau 3s
    };

    return (
        <>
            <Helmet>
                <title>Liên hệ | TeachMe</title>
                <meta
                    name="description"
                    content="Liên hệ với TeachMe để được hỗ trợ nhanh chóng hoặc tạo tài khoản để bắt đầu hành trình học tập."
                />
                <meta property="og:title" content="Liên hệ | TeachMe" />
                <meta property="og:description" content="Hỗ trợ nhanh chóng và tạo tài khoản dễ dàng." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <Header />
            <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-8 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1B223B] tracking-tight">
                            Liên hệ với chúng tôi
                        </h1>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                            Đội ngũ TeachMe luôn sẵn sàng hỗ trợ bạn trên hành trình học tập!
                        </p>
                        <div className="mt-8 flex justify-center gap-6">
                            <Button
                                title="Nhắn tin ngay"
                                backgroundColor="#FFC569"
                                hoverBackgroundColor="#FFB347"
                                foreColor="#1B223B"
                                className="px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                onClick={() => window.open('mailto:support@teachme.com', '_blank')}
                            />
                            <Button
                                title="Tạo tài khoản"
                                backgroundColor="#1B223B"
                                hoverBackgroundColor="#2A3349"
                                foreColor="white"
                                className="px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                onClick={() => (window.location.href = '/signup')}
                            />
                        </div>
                    </div>

                    {/* Ảnh trang trí */}
                    <div className="flex justify-center mb-16">
                        <img
                            src={ContactImage}
                            alt="Liên hệ TeachMe"
                            className="w-full max-w-md rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                        />
                    </div>

                    {/* Nội dung chính - 2 cột */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Cột Form */}
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-semibold text-[#1B223B] mb-6">Gửi tin nhắn cho chúng tôi</h2>
                            {submitted && (
                                <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Tin nhắn của bạn đã được gửi thành công!
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none transition-all"
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none transition-all"
                                        placeholder="Nhập email của bạn"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                                        Tin nhắn
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFC569] focus:outline-none transition-all"
                                        placeholder="Viết tin nhắn của bạn tại đây..."
                                    />
                                </div>
                                <Button
                                    title="Gửi tin nhắn"
                                    backgroundColor="#1B223B"
                                    hoverBackgroundColor="#2A3349"
                                    foreColor="white"
                                    className="w-full py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                    type="submit"
                                />
                            </form>
                        </div>

                        {/* Cột Thông tin liên hệ */}
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-semibold text-[#1B223B] mb-6">Thông tin liên hệ</h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <svg
                                        className="w-6 h-6 text-[#FFC569] mr-3 mt-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-gray-700 font-medium">Email</p>
                                        <a
                                            href="mailto:support@teachme.com"
                                            className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                                        >
                                            support@teachme.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg
                                        className="w-6 h-6 text-[#FFC569] mr-3 mt-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-gray-700 font-medium">Chat trực tuyến</p>
                                        <a
                                            href="https://m.me/teachme"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                                        >
                                            Chat với chúng tôi qua Messenger
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg
                                        className="w-6 h-6 text-[#FFC569] mr-3 mt-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-gray-700 font-medium">Số điện thoại</p>
                                        <a
                                            href="tel:+84987654321"
                                            className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                                        >
                                            (+84) 987 654 321
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg
                                        className="w-6 h-6 text-[#FFC569] mr-3 mt-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828-2.828L6.343 13.657a4 4 0 000 5.656l4 4a4 4 0 005.656 0l4-4a4 4 0 000-5.656zM12 3v6"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-gray-700 font-medium">Địa chỉ</p>
                                        <p className="text-[#1B223B]">12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Yếu tố độc đáo: Social Media */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-[#1B223B] mb-4">Theo dõi chúng tôi</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="https://facebook.com/teachme"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                                    >
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://instagram.com/teachme"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#1B223B] hover:text-[#FFC569] transition-colors"
                                    >
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Yếu tố độc đáo: Quote */}
                    <div className="mt-16 text-center bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
                        <p className="text-lg text-gray-700 italic">
                            "Học tập là hành trình không ngừng, và chúng tôi ở đây để đồng hành cùng bạn."
                        </p>
                        <p className="mt-2 text-sm text-[#1B223B] font-semibold">- Đội ngũ TeachMe</p>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Contact;
