interface ClassCardProps {
    className?: string;
    classInfo: {
        name: string;
        teacherName: string;
        teacherAvatar: string;
        totalSessions: number;
        completedSessions: number;
        paymentStatus: string;
        paymentDueDate?: Date;
    };
}

const ClassCard: React.FC<ClassCardProps> = ({ className, classInfo }) => {
    return (
        <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
            <h3 className="font-semibold text-lg mb-2">{classInfo.name}</h3>

            <div className="flex items-center mb-3">
                <img src={classInfo.teacherAvatar} alt={classInfo.teacherName} className="w-8 h-8 rounded-full mr-2" />
                <span className="text-gray-600">{classInfo.teacherName}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
                <div className="w-full bg-gray-300 rounded-full h-2.5">
                    <div
                        className="bg-[#5d6fb1] h-2.5 rounded-full"
                        style={{ width: `${(classInfo.completedSessions / classInfo.totalSessions) * 100}%` }}
                    />
                </div>
                <div className="text-sm text-gray-600 mt-1">
                    {classInfo.completedSessions}/{classInfo.totalSessions} buổi
                </div>
            </div>

            {/* Payment Status */}
            <button
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium
                    ${
                        classInfo.paymentStatus === 'Đã thanh toán'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
            >
                {classInfo.paymentStatus}
            </button>
        </div>
    );
};

export default ClassCard;
