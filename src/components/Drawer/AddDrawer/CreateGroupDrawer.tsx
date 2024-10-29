import React, { useContext, useRef, useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import FormInputV2 from '@/components/FormInput/FormInputV2';
import { Button } from '@/components/ui/button';
import { _POST } from '@/utils/auth_api';
import * as LucideIcons from 'lucide-react';

interface CreateGroupDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateGroupDrawer: React.FC<CreateGroupDrawerProps> = ({ isOpen, onClose }) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const [formValues, setFormValues] = useState({
        title: '',
    });
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>('account');

    if (!isOpen) return null;

    const handleInputChange = (key: string, value: string) => {
        setFormValues(prev => ({ ...prev, [key]: value }));
    };

    const handleCreateGroup = async () => {
        try {
            const groupData = {
                title: formValues.title,
                type: selectedType,
                lucideIcon: selectedIcon ? `<${selectedIcon} className="h-4 w-4 text-icon-primary" />` : null,
                canDelete: true,
            };

            const response = await _POST('/group', groupData);
            onClose();
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    const fields = [
        { key: 'title', title: 'Title', placeholder: 'Enter group title', type: 'text', icon: <LucideIcons.Folder size={20} /> },
    ];

    const iconList = [
        'User', 'Users', 'UserPlus', 'UserMinus', 'UserCheck', 'UserX', 'UserCog',
        'Key', 'KeyRound', 'Lock', 'Unlock', 'ShieldCheck', 'ShieldAlert', 'ShieldQuestion',
        'Fingerprint', 'Scan', 'QrCode', 'Smartphone', 'Tablet', 'Laptop', 'Desktop',
        'CreditCard', 'Wallet', 'DollarSign', 'PiggyBank', 'Banknote', 'Receipt',
        'FileText', 'FileLock', 'FileKey', 'FileSignature', 'Folder', 'FolderOpen',
        'Mail', 'Inbox', 'Send', 'MessageSquare', 'MessageCircle', 'Bell', 'BellRing',
        'Globe', 'Cloud', 'Database', 'Lock', 'Unlock', 'ShieldCheck', 'ShieldAlert', 'ShieldQuestion',
        'Fingerprint', 'Scan', 'QrCode', 'Smartphone', 'Tablet', 'Laptop', 'Desktop',
    ];

    const typeOptions = ["account", "card", "identify", "google", "clone", "note"];

    return (
        <div className="fixed inset-y-0 right-0 w-[45rem] bg-background shadow-xl z-50 text-white p-4 border-l border-gray-700" ref={drawerRef}>
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200 rounded-sm bg-gray-800 p-1">
                        <X size={24} />
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <select
                                id="type"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-gray-700 text-white rounded-md border border-gray-600 focus:border-primary focus:ring-primary appearance-none pr-10 py-2 pl-3 text-sm"
                            >
                                {typeOptions.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <Button className="bg-primary hover:bg-primary-dark text-white" onClick={handleCreateGroup}>
                            Create Group
                        </Button>
                    </div>
                </div>
                {/* Form */}
                <form className="flex-grow overflow-y-auto">
                    <div className="mb-4">
                        <FormInputV2 fields={fields} values={formValues} onChange={handleInputChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Icon</label>
                        <div className="grid grid-cols-8 gap-2">
                            {iconList.map((iconName) => {
                                const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
                                if (!IconComponent) {
                                    console.warn(`Icon not found: ${iconName}`);
                                    return null;
                                }
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        className={`p-2 rounded-md ${selectedIcon === iconName ? 'bg-primary' : 'bg-gray-700'} hover:bg-gray-600`}
                                        onClick={() => setSelectedIcon(iconName)}
                                    >
                                        <IconComponent size={24} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupDrawer;