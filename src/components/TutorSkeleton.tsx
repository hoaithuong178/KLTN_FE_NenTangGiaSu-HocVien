import { motion } from 'framer-motion';

const SkeletonItem = () => (
    <div className="flex gap-4 p-4 border-b border-gray-200">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>

        {/* Thông tin */}
        <div className="flex flex-col flex-1 gap-2">
            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        </div>
    </div>
);

const TutorSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
        >
            {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonItem key={index} />
            ))}
        </motion.div>
    );
};

export default TutorSkeleton;
export const PostSkeleton = () => {
    return (
        <div className="border p-4 mb-4 shadow-md rounded-lg animate-pulse">
            {/* Header với avatar và thông tin người dùng */}
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                </div>
            </div>

            {/* Tiêu đề và môn học */}
            <div className="space-y-2 mb-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>

            {/* Thông tin chính */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
            </div>

            {/* Yêu cầu */}
            <div className="p-2 bg-gray-100 rounded-md mb-4">
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
                <div className="h-10 bg-gray-300 rounded w-32"></div>
                <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
        </div>
    );
};
