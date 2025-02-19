import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';

const Tutor: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        // Kiểm tra trạng thái từ localStorage
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true; // Mặc định là true
    });

    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);
    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen">
            {/* Sử dụng Navbar */}

            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />

            {/* Main Content */}
            {/* <Text className=" relative  text-right w-96">post pages</Text> */}
            <div className={`flex-1 p-6 ${isExpanded ? 'ml-56' : 'ml-16'}`}>
                {/* Title Text */}

                {/* Nội dung còn lại */}
            </div>
        </div>
    );
};

export default Tutor;
