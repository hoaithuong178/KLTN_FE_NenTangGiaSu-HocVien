import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import TutorProfileComponent, { TutorProfileComponentProps } from '../components/TutorProfileComponent';
import { useAuthStore } from '../store/authStore';

const TutorProfile = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { user: currentUser } = useAuthStore();
    const [tutor, setTutor] = useState<TutorProfileComponentProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorDetail = async () => {
            try {
                const API_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';
                const tutorId = id || currentUser?.id;
                if (!tutorId) {
                    setLoading(false);
                    return;
                }

                const numericId = typeof tutorId === 'string' ? parseInt(tutorId.replace(/\D/g, '')) : tutorId;

                if (currentUser?.role === 'TUTOR' && currentUser.id === tutorId) {
                    console.log('Current User Data:', currentUser);

                    const mappedTutor: TutorProfileComponentProps = {
                        id: numericId,
                        avatar:
                            currentUser.userProfile?.avatar || currentUser.avatar || 'https://via.placeholder.com/150',
                        name: currentUser.name || 'Unknown',
                        pricePerSession: currentUser.tutorProfile?.hourlyPrice || 0,
                        email: currentUser.email || '',
                        phone: currentUser.userProfile?.phone || currentUser.phone || '',
                        isFavorite: false,
                        learningTypes: currentUser.tutorProfile?.learningTypes || [],
                        subjects: currentUser.tutorProfile?.specializations || [],
                        gender: currentUser.userProfile?.gender || 'Unknown',
                        educationLevel: currentUser.tutorProfile?.level || 'Unknown',
                        experience: currentUser.tutorProfile?.experiences || 0,
                        birthYear: currentUser.userProfile?.dob
                            ? new Date(currentUser.userProfile.dob).getFullYear()
                            : 2000,
                        totalClasses: currentUser.tutorProfile?.taughtStudentsCount || 0,
                        tutorLocations: currentUser.tutorProfile?.tutorLocations || [],
                        schedule: {},
                        rating: currentUser.tutorProfile?.rating || 0,
                        reviews: [],
                        description: currentUser.tutorProfile?.description || '',
                        currentUserId: currentUser.id,
                        userProfile: {
                            email: currentUser.email,
                            phone: currentUser.userProfile?.phone || currentUser.phone || '',
                            avatar: currentUser.userProfile?.avatar || currentUser.avatar || '',
                            gender: currentUser.userProfile?.gender || 'Unknown',
                            dob: currentUser.userProfile?.dob || '',
                        },
                        tutorProfile: currentUser.tutorProfile,
                    };

                    console.log('Mapped Tutor Data:', mappedTutor);
                    setTutor(mappedTutor);
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${API_URL}/api/v1/tutors/${numericId}`);
                const tutorData = response.data;

                console.log('API Response:', tutorData);

                const mappedTutor: TutorProfileComponentProps = {
                    id: numericId,
                    avatar: tutorData.userProfile?.avatar || tutorData.avatar || 'https://via.placeholder.com/150',
                    name: tutorData.name || 'Unknown',
                    pricePerSession: tutorData.tutorProfile?.hourlyPrice || 0,
                    email: tutorData.email || '',
                    phone: tutorData.phone || tutorData.userProfile?.phone || '',
                    isFavorite: false,
                    learningTypes: tutorData.tutorProfile?.learningTypes || [],
                    subjects: tutorData.tutorProfile?.specializations || [],
                    gender: tutorData.userProfile?.gender || 'Unknown',
                    educationLevel: tutorData.tutorProfile?.level || 'Unknown',
                    experience: tutorData.tutorProfile?.experiences || 0,
                    birthYear: tutorData.userProfile?.dob ? new Date(tutorData.userProfile.dob).getFullYear() : 2000,
                    totalClasses: tutorData.tutorProfile?.taughtStudentsCount || 0,
                    tutorLocations: tutorData.tutorProfile?.tutorLocations || [],
                    schedule: {},
                    rating: tutorData.tutorProfile?.rating || 0,
                    reviews: [],
                    description: tutorData.tutorProfile?.description || '',
                    currentUserId: currentUser?.id?.toString() || '',
                    userProfile: tutorData.userProfile,
                    tutorProfile: tutorData.tutorProfile,
                };

                console.log('Mapped Tutor Data:', mappedTutor);
                setTutor(mappedTutor);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tutor:', error);
                setLoading(false);
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    alert('Không tìm thấy thông tin gia sư');
                } else {
                    alert('Có lỗi xảy ra khi tải thông tin gia sư');
                }
            }
        };

        if (location.state) {
            const stateTutor = location.state as TutorProfileComponentProps;
            setTutor(stateTutor);
            setLoading(false);
        } else {
            fetchTutorDetail();
        }
    }, [id, location.state, currentUser]);

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
