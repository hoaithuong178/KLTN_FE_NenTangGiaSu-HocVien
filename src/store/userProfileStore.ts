import { create } from 'zustand';

export interface UserProfile {
    id: string;
    avatar: string;
    idCardNumber?: string;
    address?: string;
    dob: string;
    gender: string;
    walletAddress?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: string;
}

interface UserProfileState {
    userProfile: UserProfile | null;
    connectedWallet: boolean;
    setUserProfile: (userProfile: UserProfile) => void;
    setConnectedWallet: (connectedWallet: boolean) => void;
    setWalletAddress: (walletAddress: string) => void;
}

const useUserProfileStore = create<UserProfileState>((set) => ({
    userProfile: null,
    connectedWallet: false,
    setUserProfile: (userProfile) => set({ userProfile }),
    setConnectedWallet: (connectedWallet) => set({ connectedWallet }),
    setWalletAddress: (walletAddress: string) =>
        set((state) => ({
            userProfile: state.userProfile ? { ...state.userProfile, walletAddress } : null,
        })),
}));

export default useUserProfileStore;
