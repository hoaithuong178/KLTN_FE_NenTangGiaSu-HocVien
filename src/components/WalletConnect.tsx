import React from 'react';
import { useWallet } from '../hooks/useWallet';
import useUserProfileStore from '../store/userProfileStore';

const WalletConnect: React.FC = () => {
    const { isMetaMaskInstalled, connectWallet } = useWallet();
    const { userProfile } = useUserProfileStore();

    if (!isMetaMaskInstalled) {
        return (
            <div className="wallet-connect">
                <p>Vui lòng cài đặt MetaMask để sử dụng tính năng này.</p>
                <a
                    href="https://metamask.io/download.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="install-button"
                >
                    Cài đặt MetaMask
                </a>
            </div>
        );
    }

    return (
        <div className="wallet-connect">
            {userProfile?.walletAddress ? (
                <div className="wallet-info">
                    <p>Đã kết nối với ví:</p>
                    <p className="wallet-address">{`${userProfile?.walletAddress.slice(
                        0,
                        6,
                    )}...${userProfile?.walletAddress.slice(-4)}`}</p>
                </div>
            ) : (
                <button className="connect-button" onClick={connectWallet}>
                    Kết nối ví
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
