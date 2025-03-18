export interface ITutor {
    id: string;
    email: string;
    name: string;
    phone: string;
    password: string;
    role: string;
    status: string;
    isOnline: boolean;
    lastActive?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    userProfile?: UserProfile;
    tutorProfile?: TutorProfile;
    score: number;
}

export interface TutorProfile {
    id: string;
    specializations: string[];
    experiences: number;
    rating: number;
    taughtStudentsCount: number;
    tutorLocations: string[];
    hourlyPrice: number;
    fee: number;
    level: string;
    learningTypes: string[];
    description: string;
}

export interface UserProfile {
    id: string;
    avatar: string;
    idCardNumber?: string;
    address?: string;
    dob: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: string;
}
