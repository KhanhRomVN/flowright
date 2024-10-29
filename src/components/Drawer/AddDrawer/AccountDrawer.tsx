import React, { useRef, useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { X, Mail, User, Lock, Key, Globe, Eye, EyeOff, Phone, ChevronDown, FileText } from 'lucide-react';
import FormInputV2 from '@/components/FormInput/FormInputV2';
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

interface AccountDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountDrawer({ isOpen, onClose }: AccountDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const [formValues, setFormValues] = useState({
        title: '',
        email: '',
        username: '',
        password: '',
        totp: '',
        website: '',
        notes: '',
        phone: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const groupsData = await _GET('/group/account');
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
        // Clear error when user starts typing
        if (formErrors[key]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleCreateAccount = async () => {
        const newErrors: { [key: string]: string } = {};
        
        // Validate required fields
        if (!formValues.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formValues.website.trim()) {
            newErrors.website = 'Website is required';
        }
        if (!formValues.password.trim()) {
            newErrors.password = 'Password is required';
        }

        // Check if at least one of email, username, or phone is provided
        if (!formValues.email.trim() && !formValues.username.trim() && !formValues.phone.trim()) {
            newErrors.email = 'At least one contact method is required (Email, Username, or Phone)';
            newErrors.username = 'At least one contact method is required (Email, Username, or Phone)';
            newErrors.phone = 'At least one contact method is required (Email, Username, or Phone)';
        }

        // If there are any errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        // Clear any existing errors
        setFormErrors({});

        try {
            const accountData = {
                title: formValues.title,
                groupId: selectedGroupId ? selectedGroupId : -1,
                website_URL: formValues.website,
                username: formValues.username,
                email: formValues.email,
                password: formValues.password,
                isFavorite: false,
                phone: formValues.phone,
                note: formValues.notes,
                totp: formValues.totp,
                type: 'account',
            };

            await _POST('/accounts', accountData);
            onClose();
        } catch (error) {
            console.error("Error creating account:", error);
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
            <div className="p-4 bg-sidebar-primary h-full">
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
                            onClick={handleCreateAccount}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Title and Website Section */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <FileText className="h-5 w-5 text-purple-400" />
                                </div>
                                <input
                                    type="text"
                                    value={formValues.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Title"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.title ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.title && <span className="text-red-500 text-sm ml-11">{formErrors.title}</span>}
                        </div>
                        <div className="flex flex-col gap-1 mt-3">
                            <input
                                type="url"
                                value={formValues.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                placeholder="Website URL"
                                className={`bg-gray-800 rounded px-2 py-1 w-full text-sm ${formErrors.website ? 'border border-red-500' : ''}`}
                            />
                            {formErrors.website && <span className="text-red-500 text-sm">{formErrors.website}</span>}
                        </div>
                    </div>

                    {/* Login Details */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={formValues.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Email"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.email ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.email && <span className="text-red-500 text-sm ml-6">{formErrors.email}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formValues.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    placeholder="Username"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.username ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.username && <span className="text-red-500 text-sm ml-6">{formErrors.username}</span>}
                        </div>
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
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                    >
                                        {showPassword ?
                                            <EyeOff className="h-4 w-4" /> :
                                            <Eye className="h-4 w-4" />
                                        }
                                    </button>
                                </div>
                            </div>
                            {formErrors.password && <span className="text-red-500 text-sm ml-6">{formErrors.password}</span>}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.totp}
                                onChange={(e) => handleInputChange('totp', e.target.value)}
                                placeholder="Two Factor Authentication"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formValues.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="Phone"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.phone ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.phone && <span className="text-red-500 text-sm ml-6">{formErrors.phone}</span>}
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