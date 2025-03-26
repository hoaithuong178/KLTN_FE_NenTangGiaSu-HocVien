import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import TutorProfileComponent, { TutorProfileComponentProps } from '../components/TutorProfileComponent';

const TutorProfile = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const [tutor, setTutor] = useState<TutorProfileComponentProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorDetail = async () => {
            try {
                const API_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';
                const response = await axios.get(`${API_URL}/tutors/${id}`);
                const tutorData = response.data;
                console.log('Raw API response:', response.data);
                console.log('Tutor data from API:', tutorData);
                console.log('Tutor locations from API:', tutorData.tutorProfile?.tutorLocations);

                const mappedTutor: TutorProfileComponentProps = {
                    id: tutorData.id
                        ? parseInt(
                              (tutorData.id ? String(tutorData.id) : '')
                                  .split('')
                                  .filter((char: string) => !isNaN(parseInt(char)))
                                  .join('') || '0',
                          )
                        : 0,
                    avatar: tutorData.userProfile?.avatar || 'https://via.placeholder.com/150',
                    name: tutorData.name || 'Unknown',
                    pricePerSession: tutorData.tutorProfile?.hourlyPrice || 0,
                    email: tutorData.email || 'N/A',
                    phone: tutorData.phone || 'N/A',
                    isFavorite: false,
                    learningTypes: tutorData.tutorProfile?.learningTypes || [],
                    subjects: tutorData.tutorProfile?.specializations || [],
                    gender: tutorData.userProfile?.gender || 'Unknown',
                    educationLevel: tutorData.tutorProfile?.level || 'Unknown',
                    experience: tutorData.tutorProfile?.experiences || 0,
                    birthYear: tutorData.userProfile?.dob ? new Date(tutorData.userProfile.dob).getFullYear() : 2000,
                    totalClasses: tutorData.tutorProfile?.taughtStudentsCount || 0,
                    tutorLocations:
                        tutorData.tutorProfile?.tutorLocations || (tutorData.location ? [tutorData.location] : []),
                    schedule: {},
                    rating: tutorData.tutorProfile?.rating || 0,
                    reviews: [],
                    description: tutorData.tutorProfile?.description || '',
                };

                console.log('Mapped tutor data:', mappedTutor);
                setTutor(mappedTutor);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tutor:', error);
                setLoading(false);
            }
        };

        if (location.state) {
            const stateTutor = location.state as TutorProfileComponentProps;
            console.log('Original state tutor:', stateTutor);

            const correctedTutor: TutorProfileComponentProps = {
                id: stateTutor.id
                    ? typeof stateTutor.id === 'string'
                        ? parseInt(
                              (stateTutor.id ? String(stateTutor.id) : '')
                                  .split('')
                                  .filter((char: string) => !isNaN(parseInt(char)))
                                  .join('') || '0',
                          )
                        : stateTutor.id
                    : 0,
                avatar: stateTutor.avatar || 'https://via.placeholder.com/150',
                name: stateTutor.name || 'Unknown',
                pricePerSession: stateTutor.pricePerSession || 0,
                email: stateTutor.email || 'N/A',
                phone: stateTutor.phone || 'N/A',
                isFavorite: stateTutor.isFavorite || false,
                learningTypes: Array.isArray(stateTutor.learningTypes)
                    ? stateTutor.learningTypes
                    : [stateTutor.learningTypes || 'Unknown'],
                subjects: stateTutor.subjects || [],
                gender: stateTutor.gender || 'Unknown',
                educationLevel: stateTutor.educationLevel || 'Unknown',
                experience: stateTutor.experience || 0,
                birthYear: stateTutor.birthYear || 2000,
                totalClasses: stateTutor.totalClasses || 0,
                tutorLocations: stateTutor.tutorLocations || [],
                schedule: stateTutor.schedule || {},
                rating: stateTutor.rating || 0,
                reviews: stateTutor.reviews || [],
                description: stateTutor.description || '',
            };
            console.log('Corrected tutor data from state:', correctedTutor);
            setTutor(correctedTutor);
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
