// TutorProfile.tsx
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import TutorProfileComponent, { TutorProfileComponentProps } from '../components/TutorProfileComponent';

const TutorProfile = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const location = useLocation();
    const [tutor, setTutor] = useState<TutorProfileComponentProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorDetail = async () => {
            try {
                const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
                const response = await axios.get(`${API_URL}/tutors/${id}`);
                const tutorData = response.data.data;

                const mappedTutor: TutorProfileComponentProps = {
                    id: tutorData.id || 0,
                    avatar: tutorData.userProfile?.avatar || 'https://default-avatar.com',
                    name: tutorData.name || 'Unknown',
                    pricePerSession: tutorData.tutorProfile?.hourlyPrice || 0,
                    email: tutorData.email || '',
                    phone: tutorData.phone || '',
                    isFavorite: false,
                    violations: tutorData.violations || 0,
                    subjects: tutorData.tutorProfile?.specializations || [],
                    gender: tutorData.userProfile?.gender || 'UNKNOWN',
                    educationLevel: tutorData.tutorProfile?.educationLevel || 'Unknown',
                    experience: tutorData.tutorProfile?.experiences || 0,
                    birthYear: tutorData.userProfile?.dob ? new Date(tutorData.userProfile.dob).getFullYear() : 2000,
                    totalClasses: tutorData.tutorProfile?.taughtStudentsCount || 0,
                    location: tutorData.tutorProfile?.tutorLocations?.[0] || 'Unknown',
                    schedule: tutorData.schedule || {},
                    rating: tutorData.tutorProfile?.rating || 0,
                    reviews: tutorData.reviews || [],
                    description: tutorData.tutorProfile?.decription || '',
                };

                setTutor(mappedTutor);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tutor:', error);
                setLoading(false);
            }
        };

        // Nếu có dữ liệu từ state của Link, dùng nó làm dữ liệu ban đầu
        if (location.state) {
            setTutor(location.state as TutorProfileComponentProps);
            setLoading(false);
        } else {
            fetchTutorDetail();
        }
    }, [id, location.state]);

    if (loading) return <div>Loading...</div>;
    if (!tutor) return <div>Không tìm thấy gia sư</div>;
    return (
        <>
            <SEO
                title={`${tutor.name} - Gia sư ${tutor.subjects.join(', ')}`}
                description={`${tutor.name} - Gia sư ${tutor.subjects.join(', ')} với ${
                    tutor.experience
                } năm kinh nghiệm. Đánh giá ${tutor.rating}/5 từ ${tutor.reviews.length} học sinh.`}
                ogImage={tutor.avatar}
            />
            <TutorProfileComponent {...tutor} />
        </>
    );
};

export default TutorProfile;
