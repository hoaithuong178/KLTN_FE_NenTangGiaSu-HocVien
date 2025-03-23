import { useState } from 'react';
import axiosClient from '../configs/axios.config';

const UserDataDeletion = () => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequestDeletion = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (!localStorage.getItem('token')) {
                setError('Bạn cần đăng nhập để yêu cầu xóa dữ liệu');
                return;
            }

            // Giả lập API call để gửi yêu cầu xóa dữ liệu
            await axiosClient.post('/user/delete');

            // Xử lý thành công
            setIsSuccess(true);
            setShowConfirmation(false);
        } catch (err) {
            console.log(err);

            setError('Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Xóa Dữ Liệu Người Dùng</h1>

                        {isSuccess ? (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">
                                            Yêu cầu xóa dữ liệu của bạn đã được gửi thành công. Chúng tôi sẽ xử lý yêu
                                            cầu của bạn trong vòng 30 ngày và gửi email xác nhận khi hoàn tất.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="prose prose-blue max-w-none mb-8">
                                    <p>
                                        Theo chính sách bảo mật của chúng tôi, bạn có quyền yêu cầu xóa toàn bộ dữ liệu
                                        cá nhân của mình khỏi hệ thống của chúng tôi.
                                    </p>

                                    <h2 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                                        Những điều cần biết trước khi xóa dữ liệu:
                                    </h2>

                                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                        <li>
                                            Việc xóa dữ liệu là{' '}
                                            <span className="font-semibold">không thể hoàn tác</span>
                                        </li>
                                        <li>Tất cả thông tin cá nhân của bạn sẽ bị xóa vĩnh viễn</li>
                                        <li>Quá trình xóa dữ liệu có thể mất đến 30 ngày</li>
                                        <li>Bạn sẽ nhận được email xác nhận khi quá trình xóa hoàn tất</li>
                                    </ul>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-5 w-5 text-red-500"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!showConfirmation ? (
                                    <button
                                        onClick={() => setShowConfirmation(true)}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Yêu cầu xóa dữ liệu của tôi
                                    </button>
                                ) : (
                                    <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận xóa dữ liệu</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Bạn có chắc chắn muốn xóa tất cả dữ liệu cá nhân của mình? Hành động này
                                            không thể hoàn tác.
                                        </p>
                                        <div className="flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmation(false)}
                                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                disabled={isSubmitting}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRequestDeletion}
                                                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center justify-center">
                                                        <svg
                                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                        Đang xử lý...
                                                    </div>
                                                ) : (
                                                    'Xác nhận xóa dữ liệu'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Liên hệ với chúng tôi</h3>
                            <p className="text-sm text-gray-600">
                                Nếu bạn có bất kỳ câu hỏi nào về việc xóa dữ liệu, vui lòng liên hệ với chúng tôi qua
                                email:{' '}
                                <a href="mailto:thaoanhhaa1@gmail.com" className="text-blue-600 hover:underline">
                                    thaoanhhaa1@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDataDeletion;
