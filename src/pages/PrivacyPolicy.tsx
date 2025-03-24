const PrivacyPolicy = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Chính sách Bảo mật</h1>

                        <div className="text-right text-sm text-gray-500 mb-6">
                            Cập nhật lần cuối: 23 tháng 3 năm 2025
                        </div>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Giới thiệu</h2>
                            <p className="text-gray-600 mb-3">
                                Tôi, Hà Anh Thảo, là một nhà phát triển độc lập đang trong quá trình học tập. Chính sách
                                bảo mật này mô tả cách tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn
                                sử dụng ứng dụng của tôi.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Thông tin thu thập</h2>
                            <p className="text-gray-600 mb-3">
                                Tôi chỉ thu thập những thông tin cần thiết để cung cấp dịch vụ:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-1">
                                <li>Tên và địa chỉ email (thông qua đăng nhập Facebook)</li>
                                <li>Thông tin sử dụng ứng dụng</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Mục đích sử dụng thông tin</h2>
                            <p className="text-gray-600 mb-3">Thông tin được sử dụng để:</p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-1">
                                <li>Cung cấp và cải thiện dịch vụ</li>
                                <li>Liên lạc với bạn về ứng dụng</li>
                                <li>Phân tích cách ứng dụng được sử dụng</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Bảo mật dữ liệu</h2>
                            <p className="text-gray-600 mb-3">Tôi cam kết bảo vệ dữ liệu của bạn bằng cách:</p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-1">
                                <li>Sử dụng các biện pháp bảo mật hợp lý</li>
                                <li>Không chia sẻ thông tin với bên thứ ba, trừ khi được yêu cầu bởi pháp luật</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Quyền của bạn</h2>
                            <p className="text-gray-600 mb-3">Bạn có quyền:</p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-1">
                                <li>Yêu cầu truy cập vào dữ liệu của mình</li>
                                <li>Yêu cầu sửa đổi hoặc xóa dữ liệu</li>
                                <li>Rút lại sự đồng ý cho phép sử dụng dữ liệu</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Thay đổi chính sách</h2>
                            <p className="text-gray-600">
                                Tôi có thể cập nhật chính sách này và sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng
                                nào.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Liên hệ</h2>
                            <p className="text-gray-600 mb-3">
                                Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ tôi qua:
                            </p>
                            <p className="text-gray-600">
                                Email:{' '}
                                <a href="mailto:thaoanhhaa1@gmail.com" className="text-blue-600 hover:underline">
                                    thaoanhhaa1@gmail.com
                                </a>
                            </p>
                        </section>

                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <p className="text-gray-600 text-sm italic">
                                Bằng cách sử dụng ứng dụng của tôi, bạn đồng ý với các điều khoản trong chính sách bảo
                                mật này.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
