import React, { useState, useEffect } from 'react';
import { _GET } from '../../utils/auth_api';
import { User, Mail, UserCircle, KeyRound, Shield, Phone, StickyNote, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditAccountContentDrawer from '@/components/Drawer/EditDrawer/EditAccountContentDrawer';


interface Account {
    id: number;
    userId: number;
    title: string;
    type: string;
    groupId: number;
    website_URL: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    twoFactor: string;
    notes: string;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AccountContentProps {
    id: number | null;
}

const AccountContent: React.FC<AccountContentProps> = ({ id }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint = id ? `/accounts/group/${id}` : '/accounts';
                const data = await _GET(endpoint);
                setAccounts(data);
                if (data.length > 0) {
                    setSelectedAccount(data[0]);
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
                setError('Failed to fetch accounts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [id]);

    const renderAccountInfo = (account: Account) => {
        if (account.phone) return account.phone;
        if (account.email) return account.email;
        if (account.username) return account.username;
        return '';
    };

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="flex">
            {/* List Account */}
            <div className="w-1/3 pr-2 border-r border-gray-700/50">
                {accounts.length === 0 ? (
                    <p>No accounts found.</p>
                ) : (
                    <ul className="space-y-2">
                        {accounts.map((account) => (
                            <li
                                key={account.id}
                                className={`rounded cursor-pointer flex items-center p-2 transition-colors duration-200 ${selectedAccount?.id === account.id
                                    ? 'bg-blue-500/20'
                                    : 'hover:bg-gray-500/50'
                                    }`}
                                onClick={() => setSelectedAccount(account)}
                            >
                                <Button
                                    variant="ghost"
                                    className="p-2 mr-3 bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200"
                                >
                                    <User className="h-5 w-5 text-white" />
                                </Button>
                                <div>
                                    <p className="text-sm">{account.title}</p>
                                    <p className="text-xs text-gray-600">{renderAccountInfo(account)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Account Selected Content */}
            <div className="w-2/3 pl-4 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.3)]">
                {selectedAccount ? (
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">{selectedAccount.title}</h2>
                            <Button
                                variant="ghost"
                                className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                Edit
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {/* Website Info */}
                            <div className="border border-gray-800/100 p-4 rounded-lg">                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <User className="h-5 w-5 text-purple-400" />
                                </div>
                                <h3 className="font-medium">{selectedAccount.title}</h3>
                            </div>
                                <a
                                    href={selectedAccount.website_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-400 hover:text-purple-400"
                                >
                                    {selectedAccount.website_URL || 'N/A'}
                                </a>
                            </div>

                            {/* Login Details */}
                            <div className="border border-gray-800/100 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Email
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedAccount.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <UserCircle className="h-4 w-4" /> Username
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedAccount.username || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <KeyRound className="h-4 w-4" /> Password
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-sm">
                                            {selectedAccount.password ?
                                                (showPassword ? selectedAccount.password : '••••••••')
                                                : 'N/A'}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-purple-400 hover:bg-purple-400/10"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="border border-gray-800/100 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Shield className="h-4 w-4" /> Two Factor
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedAccount.twoFactor || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Phone
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedAccount.phone || 'N/A'}</span>
                                </div>
                                {selectedAccount.notes && (
                                    <div className="pt-2 border-t border-gray-700">
                                        <p className="text-gray-400 text-sm flex items-center gap-2">
                                            <StickyNote className="h-4 w-4" /> Notes
                                        </p>
                                        <p className="mt-1 text-sm">{selectedAccount.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className="text-xs text-gray-500 space-y-1 border border-gray-800/100 p-4 rounded-lg">
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Created: {new Date(selectedAccount.createdAt).toLocaleString()}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Updated: {new Date(selectedAccount.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No account selected.</p>
                )}
            </div>
            <EditAccountContentDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                account={selectedAccount}
            />
        </div>
    );
};

export default AccountContent;