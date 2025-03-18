export interface IPost {
    user: User;
    subject: Subject;
    id: string;
    grade: string;
    postTime: string;
    title: string;
    content: string;
    locations: string[];
    sessionPerWeek: number;
    duration: number;
    schedule: string[];
    requirements: string[];
    mode: boolean;
    feePerSession: number;
    createdAt: string;
    updatedAt: string;
    score: number;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface Subject {
    id: string;
    name: string;
}
