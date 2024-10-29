import React, { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { EyeOff, Eye, X, Mail, Lock, Key, Phone, User, Globe, Calendar, Languages, Monitor, Network, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { _GET, _POST } from '@/utils/auth_api';

interface Group {
    id: number;
    title: string;
    userId: number;
    lucideIcon: string;
    canDelete: boolean;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface GoogleDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GoogleDrawer({ isOpen, onClose }: GoogleDrawerProps) {
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
        recoveryEmail: '',
        twoFactor: '',
        phone: '',
        displayName: '',
        dateOfBirth: '',
        country: '',
        language: '',
        agent: '',
        proxy: '',
        status: '',
        notes: '',
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    const validateEmail = (email: string): boolean => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const fetchGroups = async () => {
        try {
            const groupsData = await _GET('/group/google');
            if (Array.isArray(groupsData) && groupsData.length > 0) {
                setGroups(groupsData);
                const allGroupsId = groupsData.find((group: Group) => group.title === "All Groups")?.id;
                setSelectedGroupId(allGroupsId || null);
            } else {
                setGroups([]);
                setSelectedGroupId(null);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            setGroups([]);
            setSelectedGroupId(null);
        }
    };

    const handleInputChange = (key: string, value: string) => {
        setFormValues(prev => ({ ...prev, [key]: value }));
        if (formErrors[key]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleCreateGoogle = async () => {
        const newErrors: { [key: string]: string } = {};

        // Validate email
        if (!formValues.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formValues.email)) {
            newErrors.email = 'Must be a valid Gmail address (@gmail.com)';
        }

        // Validate password
        if (!formValues.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formValues.password)) {
            newErrors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
        }

        // If there are any errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        // Clear any existing errors
        setFormErrors({});

        try {
            const googleData = {
                ...formValues,
                groupId: selectedGroupId ? selectedGroupId : -1,
                type: 'google',
                isFavorite: false,
            };

            await _POST('/googles', googleData);
            onClose();
        } catch (error) {
            console.error("Error creating Google account:", error);
        }
    };

    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            direction="right"
            size={500}
            className="h-full"
        >
            <div className="p-4 bg-sidebar-primary h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Button variant="ghost" onClick={onClose} className="text-gray-400">
                        <X className="h-4 w-4" />
                    </Button>

                    <div className="flex justify-end gap-2">
                        <div className="relative">
                            {groups.length > 0 ? (
                                <select
                                    id="dropdown"
                                    value={selectedGroupId ?? -1}
                                    onChange={(e) => setSelectedGroupId(Number(e.target.value))}
                                    className="w-full bg-gray-700 text-white rounded-md border border-gray-600 focus:border-primary focus:ring-primary appearance-none pr-10 py-2 pl-3 text-sm"
                                >
                                    <option value={-1}>Identity</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.title}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="w-full bg-gray-700 text-gray-400 rounded-md border border-gray-600 py-2 pl-3 pr-10 text-sm">
                                    No groups available
                                </div>
                            )}
                            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <Button
                            className="bg-purple-500 hover:bg-purple-600"
                            onClick={handleCreateGoogle}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Title Section */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Mail className="h-5 w-5 text-purple-400" />
                                </div>
                                <input
                                    type="email"
                                    value={formValues.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Gmail Address"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.email ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.email && <span className="text-red-500 text-sm ml-11">{formErrors.email}</span>}
                        </div>
                    </div>

                    {/* Account Credentials */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-gray-400" />
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formValues.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="Password"
                                        className={`bg-gray-800 rounded px-2 py-1 w-full pr-8 ${formErrors.password ? 'border border-red-500' : ''}`}
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
                            {formErrors.password && <span className="text-red-500 text-sm ml-6">{formErrors.password}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                value={formValues.recoveryEmail}
                                onChange={(e) => handleInputChange('recoveryEmail', e.target.value)}
                                placeholder="Recovery Email"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.twoFactor}
                                onChange={(e) => handleInputChange('twoFactor', e.target.value)}
                                placeholder="2FA Code"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.displayName}
                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                placeholder="Display Name"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <input
                                type="tel"
                                value={formValues.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Phone Number"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                value={formValues.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                placeholder="Date of Birth"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                placeholder="Country"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Languages className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.language}
                                onChange={(e) => handleInputChange('language', e.target.value)}
                                placeholder="Language"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.agent}
                                onChange={(e) => handleInputChange('agent', e.target.value)}
                                placeholder="User Agent"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Network className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.proxy}
                                onChange={(e) => handleInputChange('proxy', e.target.value)}
                                placeholder="Proxy"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="pt-2 border-t border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400">Notes</span>
                            </div>
                            <textarea
                                value={formValues.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Add notes..."
                                className="bg-gray-800 rounded px-2 py-1 w-full min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}