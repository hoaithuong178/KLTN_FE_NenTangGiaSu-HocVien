import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axiosClient from '../configs/axios.config';
import useUserProfileStore from '../store/userProfileStore';

export function useWallet() {
    const { userProfile, setUserProfile, setConnectedWallet } = useUserProfileStore();
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    useEffect(() => {
        const checkMetaMask = async () => {
            if (window.ethereum) {
                setIsMetaMaskInstalled(true);

                // Lắng nghe sự kiện thay đổi tài khoản
                window.ethereum?.on?.('accountsChanged', (accounts: string[]) => {
                    if (accounts.length > 0) {
                        setUserProfile({ ...userProfile!, walletAddress: accounts[0] });
                    } else {
                        setUserProfile({ ...userProfile!, walletAddress: undefined });
                    }
                });
            }
        };

        checkMetaMask();

        return () => {
            // Dọn dẹp event listeners khi component unmount
            if (window.ethereum) {
                window.ethereum.removeAllListeners?.('accountsChanged');
            }
        };
    }, [setUserProfile, userProfile]);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Vui lòng cài đặt MetaMask!');
            return null;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            // Yêu cầu quyền truy cập tài khoản
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            const account = accounts[0];

            if (!userProfile?.walletAddress) {
                await updateWalletAddress(account);

                setUserProfile({ ...userProfile!, walletAddress: account });
            }

            if (userProfile?.walletAddress !== account) {
                throw new Error('Wallet address is not valid');
            }
            setConnectedWallet(true);

            return account;
        } catch (error) {
            console.error('Lỗi khi kết nối ví:', error);
            return null;
        }
    };

    // Hàm gọi API cập nhật địa chỉ ví
    const updateWalletAddress = async (address: string) => {
        try {
            // Thay thế bằng API thực tế của bạn
            const response = await axiosClient.patch('/user-profiles/wallet-address', { walletAddress: address });

            console.log('🚀 ~ updateWalletAddress ~ response:', response);
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ ví:', error);
        }
    };

    return { isMetaMaskInstalled, provider, connectWallet };
}
