import React, { useRef, useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { X, User, ChevronDown, CreditCard, Calendar, KeyRound, FileText } from 'lucide-react';
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

interface CardDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CardDrawer({ isOpen, onClose }: CardDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    const [formValues, setFormValues] = useState({
        title: '',
        fullName: '',
        cardNumber: '',
        expirationDate: '',
        pin: '',
        notes: '',
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const groupsData = await _GET('/group/card');
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

    const handleCreateCard = async () => {
        const newErrors: { [key: string]: string } = {};
        
        // Validate all required fields
        if (!formValues.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formValues.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
        }
        if (!formValues.cardNumber.trim()) {
            newErrors.cardNumber = 'Card Number is required';
        }
        if (!formValues.expirationDate.trim()) {
            newErrors.expirationDate = 'Expiration Date is required';
        }
        if (!formValues.pin.trim()) {
            newErrors.pin = 'PIN is required';
        }

        // If there are any errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        // Clear any existing errors
        setFormErrors({});

        try {
            const cardData = {
                title: formValues.title,
                groupId: selectedGroupId ? selectedGroupId : -1,
                fullName: formValues.fullName,
                cardNumber: formValues.cardNumber,
                expirationDate: formValues.expirationDate,
                pin: formValues.pin,
                notes: formValues.notes,
                isFavorite: false,
                type: 'card',
            };

            await _POST('/cards', cardData);
            onClose();
        } catch (error) {
            console.error("Error creating card:", error);
        }
    };

    const fields = [
        { 
            key: 'title', 
            title: 'Title (*)', 
            placeholder: 'Place your title here', 
            type: 'text', 
            icon: <FileText size={20} />,
            required: true,
            error: formErrors.title 
        },
        { key: 'fullName', title: 'Full Name', placeholder: 'Card holder name', type: 'text', icon: <User size={20} />, halfWidth: true },
        { key: 'cardNumber', title: 'Card Number', placeholder: 'XXXX XXXX XXXX XXXX', type: 'text', icon: <CreditCard size={20} />, halfWidth: true },
        { key: 'expirationDate', title: 'Expiration Date', placeholder: 'MM/YY', type: 'text', icon: <Calendar size={20} />, halfWidth: true },
        { key: 'pin', title: 'PIN', placeholder: 'Enter PIN', type: 'password', icon: <KeyRound size={20} />, halfWidth: true },
    ];

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
                            onClick={handleCreateCard}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Title Section */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <CreditCard className="h-5 w-5 text-purple-400" />
                                </div>
                                <input
                                    type="text"
                                    value={formValues.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Card Title"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.title ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.title && <span className="text-red-500 text-sm ml-11">{formErrors.title}</span>}
                        </div>
                    </div>

                    {/* Card Details */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formValues.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    placeholder="Full Name"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.fullName ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.fullName && <span className="text-red-500 text-sm ml-6">{formErrors.fullName}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formValues.cardNumber}
                                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                    placeholder="Card Number"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.cardNumber ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.cardNumber && <span className="text-red-500 text-sm ml-6">{formErrors.cardNumber}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formValues.expirationDate}
                                    onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                                    placeholder="MM/YY"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.expirationDate ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.expirationDate && <span className="text-red-500 text-sm ml-6">{formErrors.expirationDate}</span>}
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <KeyRound className="h-4 w-4 text-gray-400" />
                                <input
                                    type="password"
                                    value={formValues.pin}
                                    onChange={(e) => handleInputChange('pin', e.target.value)}
                                    placeholder="PIN"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.pin ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.pin && <span className="text-red-500 text-sm ml-6">{formErrors.pin}</span>}
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