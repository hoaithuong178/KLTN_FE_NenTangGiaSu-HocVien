import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import { Button, Card, Tabs, Tag } from 'antd';

// Mock data
const mockData = {
    balance: '150000 ETH',
    pendingTransactions: [
        {
            id: 1,
            className: 'Lớp Toán 12A',
            dueDate: '2024-03-25',
            amount: '0.5 ETH',
            remainingDays: 2,
        },
        {
            id: 2,
            className: 'Lớp Văn 11B',
            dueDate: '2024-03-26',
            amount: '0.3 ETH',
            remainingDays: 3,
        },
    ],
    transactionHistory: [
        {
            id: 1,
            type: 'expense', // chi
            description: 'Thanh toán lớp Toán 12A',
            date: '2024-03-20',
            amount: '-0.5 ETH',
            status: 'completed',
        },
        {
            id: 2,
            type: 'income', // thu
            description: 'Hoàn tiền lớp Lý 11C',
            date: '2024-03-19',
            amount: '+0.3 ETH',
            status: 'completed',
        },
    ],
};

const Transaction: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        // Kiểm tra trạng thái từ localStorage
        const storedState = localStorage.getItem('navbarExpanded');
        return storedState ? JSON.parse(storedState) : true; // Mặc định là true
    });

    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    return (
        <div className="absolute top-0 left-0 flex h-screen w-screen">
            {/* Sử dụng Navbar */}
            <Navbar isExpanded={isExpanded} toggleNavbar={toggleNavbar} />
            <TopNavbar />

            {/* Main Content */}
            <div className={`flex-1 p-6 ${isExpanded ? 'ml-56' : 'ml-16'} bg-gray-50`}>
                {/* Balance Card */}
                <Card className="mb-6 top-10">
                    <div className="text-center">
                        <p className="text-gray-600 mb-2">Số dư hiện tại</p>
                        <h2 className="text-3xl font-bold text-blue-600">{mockData.balance}</h2>
                    </div>
                </Card>

                {/* Pending Transactions */}
                <Card title="Giao dịch cần thanh toán" className="mb-6">
                    <div className="space-y-4">
                        {mockData.pendingTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                            >
                                <div>
                                    <h3 className="font-medium">{transaction.className}</h3>
                                    <p className="text-sm text-gray-500">Hạn còn {transaction.remainingDays} ngày</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-medium text-gray-900">{transaction.amount}</span>
                                    <Button type="primary">Thanh toán</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Transaction History */}
                <Card title="Lịch sử giao dịch">
                    <Tabs
                        defaultActiveKey="all"
                        items={[
                            {
                                key: 'all',
                                label: 'Tất cả',
                            },
                            {
                                key: 'income',
                                label: 'Tiền thu',
                            },
                            {
                                key: 'expense',
                                label: 'Tiền chi',
                            },
                        ]}
                    />
                    <div className="mt-4 space-y-4">
                        {mockData.transactionHistory.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium">{transaction.description}</h3>
                                        <Tag color={transaction.type === 'income' ? 'green' : 'red'}>
                                            {transaction.type === 'income' ? 'Thu' : 'Chi'}
                                        </Tag>
                                    </div>
                                    <p className="text-sm text-gray-500">{transaction.date}</p>
                                </div>
                                <span
                                    className={`font-medium ${
                                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {transaction.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Transaction;
