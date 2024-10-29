import React from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { Mail, UserCircle, KeyRound, Shield, Phone, StickyNote, User, EyeOff, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface EditAccountContentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    account: Account | null;
}

const EditAccountContentDrawer: React.FC<EditAccountContentDrawerProps> = ({
    isOpen,
    onClose,
    account
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    if (!account) return null;

    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            direction="right"
            size={500}
        >
            <div className="p-4 bg-sidebar-primary h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={onClose} className="text-gray-400">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className="bg-purple-500 hover:bg-purple-600">
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Website Info */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <User className="h-5 w-5 text-purple-400" />
                            </div>
                            <input
                                type="text"
                                defaultValue={account.title}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <input
                            type="url"
                            defaultValue={account.website_URL}
                            placeholder="Website URL"
                            className="bg-gray-800 rounded px-2 py-1 w-full text-sm"
                        />
                    </div>

                    {/* Login Details */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                defaultValue={account.email}
                                placeholder="Email"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <UserCircle className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                defaultValue={account.username}
                                placeholder="Username"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-gray-400" />
                            <div className="relative w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    defaultValue={account.password}
                                    placeholder="Password"
                                    className="bg-gray-800 rounded px-2 py-1 w-full pr-8"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                defaultValue={account.twoFactor}
                                placeholder="Two Factor Authentication"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <input
                                type="tel"
                                defaultValue={account.phone}
                                placeholder="Phone"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="pt-2 border-t border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <StickyNote className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400">Notes</span>
                            </div>
                            <textarea
                                defaultValue={account.notes}
                                placeholder="Add notes..."
                                className="bg-gray-800 rounded px-2 py-1 w-full min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default EditAccountContentDrawer;