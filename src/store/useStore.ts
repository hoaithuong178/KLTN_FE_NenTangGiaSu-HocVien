import { create } from 'zustand';

interface Notification {
    id: number;
    title: string;
    content: string;
    time: string;
    isRead: boolean;
    link?: string;
}

interface StoreState {
    language: 'En' | 'Vi';
    notifications: Notification[];
    setLanguage: (language: 'En' | 'Vi') => void;
    markNotificationAsRead: (id: number) => void;
    markAllAsRead: () => void;
}

const useStore = create<StoreState>((set) => ({
    language: 'En',
    notifications: [
        {
            id: 1,
            title: 'Có người muốn nhận lớp của bạn',
            content: 'Nguyễn Văn A muốn nhận lớp Toán lớp 10',
            time: '2 phút trước',
            isRead: false,
            link: '/post/1',
        },
        {
            id: 2,
            title: 'Yêu cầu thương lượng giá',
            content: 'Trần Thị B muốn thương lượng giá cho lớp Tiếng Anh',
            time: '1 giờ trước',
            isRead: false,
        },
        {
            id: 3,
            title: 'Yêu cầu thương lượng giá',
            content: 'Trần Thị B muốn thương lượng giá cho lớp Tiếng Anh',
            time: '1 giờ trước',
            isRead: false,
        },
        {
            id: 4,
            title: 'Yêu cầu thương lượng giá',
            content: 'Trần Thị B muốn thương lượng giá cho lớp Tiếng Anh',
            time: '1 giờ trước',
            isRead: false,
        },
        {
            id: 5,
            title: 'Yêu cầu thương lượng giá',
            content: 'Trần Thị B muốn thương lượng giá cho lớp Tiếng Anh',
            time: '1 giờ trước',
            isRead: true,
        },
        {
            id: 6,
            title: 'Yêu cầu thương lượng giá',
            content: 'Trần Thị B muốn thương lượng giá cho lớp Tiếng Anh',
            time: '1 giờ trước',
            isRead: true,
        },
        // ... các thông báo khác
    ],
    setLanguage: (language) => set({ language }),
    markNotificationAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((noti) => (noti.id === id ? { ...noti, isRead: true } : noti)),
        })),
    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((noti) => ({ ...noti, isRead: true })),
        })),
}));

export default useStore;
