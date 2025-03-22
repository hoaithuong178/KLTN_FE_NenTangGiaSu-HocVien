import { useEffect, useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import axiosClient from '../configs/axios.config';
import useUserProfileStore from '../store/userProfileStore';
import { ethers } from 'ethers';
import contract from '../assets/TeachMeContract.json';
import { useWallet } from '../hooks/useWallet';

const contractAddress = '0x1f6BC0f73a630822Ae77c83ca201AbBa33266A7B';
const contractABI = contract.abi;

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

const Blockchain = () => {
    const { userProfile, connectedWallet, setUserProfile } = useUserProfileStore();
    const [teachMeContract, setTeachMeContract] = useState<ethers.Contract | null>(null);
    const { connectWallet } = useWallet();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const userProfileResponse = await axiosClient.get('/user-profiles');
            const userProfile = userProfileResponse.data;
            setUserProfile(userProfile);
        };

        fetchUserProfile();
    }, [setUserProfile]);

    useEffect(() => {
        const initializeContract = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                setTeachMeContract(contract);
            }
        };

        initializeContract();
    }, []);

    const handleCreateContract = async () => {
        try {
            if (!teachMeContract) {
                alert('Vui lòng kết nối ví MetaMask trước!');
                return;
            }

            if (!connectedWallet) {
                await connectWallet();
            }

            // Ví dụ dữ liệu để tạo contract
            const contractParams = {
                id: 'contract_' + Date.now(),
                studentId: 'student_123',
                tutorId: 'tutor_456',
                classId: 'class_789',
                startDate: Math.floor(Date.now() / 1000),
                endDate: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 ngày
                depositAmount: ethers.utils.parseEther('0.1'),
                totalAmount: ethers.utils.parseEther('1'),
                feePerSession: ethers.utils.parseEther('0.1'),
            };

            const extraParams = {
                grade: '12',
                subject: 'Math',
                feePerHour: ethers.utils.parseEther('0.05'),
                totalFee: ethers.utils.parseEther('1.5'),
                mode: true,
            };

            const tx = await teachMeContract.createContract(contractParams, extraParams);
            await tx.wait();
            alert('Tạo hợp đồng thành công!');
        } catch (error) {
            console.error('Lỗi khi tạo hợp đồng:', error);
            alert('Có lỗi xảy ra khi tạo hợp đồng!');
        }
    };

    return (
        <div>
            <h1>blockchain</h1>
            <p>{userProfile?.id}</p>
            <WalletConnect />
            <button
                onClick={handleCreateContract}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
            >
                Tạo Hợp Đồng Mới
            </button>
        </div>
    );
};

export default Blockchain;
