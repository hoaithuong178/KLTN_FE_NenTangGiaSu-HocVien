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
