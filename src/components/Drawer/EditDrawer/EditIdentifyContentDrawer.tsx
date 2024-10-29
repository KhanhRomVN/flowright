import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { 
    X, User, Calendar, MapPin, CreditCard, Car, Phone, Mail, Lock, 
    Key, Briefcase, Building2, FileText, UserCircle2, Globe, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { _PUT } from '@/utils/auth_api';

interface Identity {
    id: number;
    userId: number;
    groupId: number;
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    gender: string;
    country: string;
    city: string;
    street: string;
    zipcode: string;
    passportID: string;
    passportIssuedBy: string;
    passportIssuedDate: string;
    passportExpiredDate: string;
    idCardID: string;
    idCardIssuedBy: string;
    idCardIssuedDate: string;
    idCardExpiredDate: string;
    drivingLicenseID: string;
    drivingLicenseIssuedBy: string;
    drivingLicenseIssuedDate: string;
    drivingLicenseExpiredDate: string;
    phone: string;
    gmail: string;
    passwordGmail: string;
    twoFactorGmail: string;
    jobTitle: string;
    jobCompany: string;
    jobDescription: string;
    jobStartDate: string;
    jobEndDate: string;
    notes: string;
    type: string;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface EditIdentifyContentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    identity: Identity | null;
}

const EditIdentifyContentDrawer: React.FC<EditIdentifyContentDrawerProps> = ({
    isOpen,
    onClose,
    identity
}) => {
    const [formValues, setFormValues] = useState<Identity | null>(identity);
    const [showSensitive, setShowSensitive] = useState(false);

    if (!identity || !formValues) return null;

    const handleInputChange = (key: keyof Identity, value: string) => {
        setFormValues(prev => prev ? { ...prev, [key]: value } : null);
    };

    const handleUpdateIdentity = async () => {
        try {
            if (!formValues) return;
            
            await _PUT(`/identities/${identity.id}`, formValues);
            onClose();
        } catch (error) {
            console.error("Error updating identity:", error);
        }
    };

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
                    <Button variant="ghost" onClick={onClose} className="text-gray-400">
                        <X className="h-4 w-4" />
                    </Button>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            className="bg-purple-500 hover:bg-purple-600"
                            onClick={handleUpdateIdentity}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Personal Information */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <User className="h-5 w-5 text-purple-400" />
                            </div>
                            <input
                                type="text"
                                value={formValues.firstname}
                                onChange={(e) => handleInputChange('firstname', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={formValues.lastname}
                                onChange={(e) => handleInputChange('lastname', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={formValues.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <input
                                type="tel"
                                value={formValues.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                value={formValues.gmail}
                                onChange={(e) => handleInputChange('gmail', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-400" />
                            <div className="relative w-full">
                                <input
                                    type={showSensitive ? "text" : "password"}
                                    value={formValues.passwordGmail}
                                    onChange={(e) => handleInputChange('passwordGmail', e.target.value)}
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 hover:bg-purple-400/10"
                                    onClick={() => setShowSensitive(!showSensitive)}
                                >
                                    {showSensitive ? 'Hide' : 'Show'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.street}
                                onChange={(e) => handleInputChange('street', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                    </div>

                    {/* Job Information */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.jobTitle}
                                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.jobCompany}
                                onChange={(e) => handleInputChange('jobCompany', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Notes</span>
                        </div>
                        <textarea
                            value={formValues.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            className="bg-gray-800 rounded px-2 py-1 w-full min-h-[100px]"
                        />
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default EditIdentifyContentDrawer;