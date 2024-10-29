import React, { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import {
    X, User, Calendar, MapPin, CreditCard, Car, Phone, Mail, Briefcase, FileText, Globe, ChevronDown, ChevronUp
} from 'lucide-react';
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

interface IdentifyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function IdentifyDrawer({ isOpen, onClose }: IdentifyDrawerProps) {
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [groups, setGroups] = useState<Group[]>([]);

    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    const [formValues, setFormValues] = useState({
        // Personal
        firstname: '',
        lastname: '',
        dateOfBirth: '',
        gender: '',
        country: '',
        city: '',
        street: '',
        zipcode: '',

        // Passport
        passportID: '',
        passportIssuedBy: '',
        passportIssuedDate: '',
        passportExpiredDate: '',

        // ID Card
        idCardID: '',
        idCardIssuedBy: '',
        idCardIssuedDate: '',
        idCardExpiredDate: '',

        // Driving License
        drivingLicenseID: '',
        drivingLicenseIssuedBy: '',
        drivingLicenseIssuedDate: '',
        drivingLicenseExpiredDate: '',

        // Contact
        phone: '',
        gmail: '',
        passwordGmail: '',
        twoFactorGmail: '',

        // Job
        jobTitle: '',
        jobCompany: '',
        jobDescription: '',
        jobStartDate: '',
        jobEndDate: '',
        notes: '',
    });

    const [expandedSections, setExpandedSections] = useState({
        job: false,
        passport: false,
        idCard: false,
        drivingLicense: false
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const groupsData = await _GET('/group/identify');
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

    const handleCreateIdentity = async () => {
        const newErrors: { [key: string]: string } = {};

        // Validate required fields
        if (!formValues.firstname.trim()) {
            newErrors.firstname = 'First Name is required';
        }
        if (!formValues.lastname.trim()) {
            newErrors.lastname = 'Last Name is required';
        }

        // If there are any errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        // Clear any existing errors
        setFormErrors({});

        try {
            const identityData = {
                ...formValues,
                groupId: selectedGroupId ? selectedGroupId : -1,
                type: 'identify',
                isFavorite: false,
            };

            await _POST('/identities', identityData);
            onClose();
        } catch (error) {
            console.error("Error creating identity:", error);
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
            <div className="p-4 bg-sidebar-primary h-full overflow-y-auto custom-scrollbar">
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
                            onClick={handleCreateIdentity}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                        

                <div className="space-y-4">
                    {/* Personal Information */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <User className="h-5 w-5 text-purple-400" />
                                </div>
                                <input
                                    type="text"
                                    value={formValues.firstname}
                                    onChange={(e) => handleInputChange('firstname', e.target.value)}
                                    placeholder="First Name"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.firstname ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.firstname && <span className="text-red-500 text-sm ml-11">{formErrors.firstname}</span>}
                        </div>
                        <div className="space-y-3 mt-3">
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    value={formValues.lastname}
                                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                                    placeholder="Last Name"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.lastname ? 'border border-red-500' : ''}`}
                                />
                                {formErrors.lastname && <span className="text-red-500 text-sm">{formErrors.lastname}</span>}
                            </div>
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
                                placeholder="Phone Number"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                value={formValues.gmail}
                                onChange={(e) => handleInputChange('gmail', e.target.value)}
                                placeholder="Gmail"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
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
                                placeholder="Street Address"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={formValues.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="City"
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
                    </div>

                    {/* Job Information */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('job')}
                        >
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400">Job Information</span>
                            </div>
                            {expandedSections.job ?
                                <ChevronUp className="h-4 w-4 text-gray-400" /> :
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            }
                        </div>

                        {expandedSections.job && (
                            <div className="space-y-3 mt-3">
                                <input
                                    type="text"
                                    value={formValues.jobTitle}
                                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                    placeholder="Job Title"
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <input
                                    type="text"
                                    value={formValues.jobCompany}
                                    onChange={(e) => handleInputChange('jobCompany', e.target.value)}
                                    placeholder="Company"
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <textarea
                                    value={formValues.jobDescription}
                                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                                    placeholder="Job Description"
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={formValues.jobStartDate}
                                            onChange={(e) => handleInputChange('jobStartDate', e.target.value)}
                                            placeholder="Start Date"
                                            className="bg-gray-800 rounded px-2 py-1 w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={formValues.jobEndDate}
                                            onChange={(e) => handleInputChange('jobEndDate', e.target.value)}
                                            placeholder="End Date"
                                            className="bg-gray-800 rounded px-2 py-1 w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Passport Information */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('passport')}
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400">Passport Information</span>
                            </div>
                            {expandedSections.passport ?
                                <ChevronUp className="h-4 w-4 text-gray-400" /> :
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            }
                        </div>

                        {expandedSections.passport && (
                            <div className="space-y-3 mt-3">
                                <input
                                    type="text"
                                    value={formValues.passportID}
                                    onChange={(e) => handleInputChange('passportID', e.target.value)}
                                    placeholder="Passport ID"
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <input
                                    type="text"
                                    value={formValues.passportIssuedBy}
                                    onChange={(e) => handleInputChange('passportIssuedBy', e.target.value)}
                                    placeholder="Issued By"
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={formValues.passportIssuedDate}
                                            onChange={(e) => handleInputChange('passportIssuedDate', e.target.value)}
                                            placeholder="Issue Date"
                                            className="bg-gray-800 rounded px-2 py-1 w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={formValues.passportExpiredDate}
                                            onChange={(e) => handleInputChange('passportExpiredDate', e.target.value)}
                                            placeholder="Expiry Date"
                                            className="bg-gray-800 rounded px-2 py-1 w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ID Card Information */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('idCard')}
                        >
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400">ID Card Information</span>
                            </div>
                            {expandedSections.idCard ?
                                <ChevronUp className="h-4 w-4 text-gray-400" /> :
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            }
                        </div>

                        {expandedSections.idCard && (
                            <div className="space-y-3 mt-3">
                                <input
                                    type="text"
                                    value={formValues.idCardID}
                                    onChange={(e) => handleInputChange('idCardID', e.target.value)}
                                    placeholder="ID Card Number"
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <input
                                    type="text"
                                    value={formValues.idCardIssuedBy}
                                    onChange={(e) => handleInputChange('idCardIssuedBy', e.target.value)}
                                    placeholder="Issued By"
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={formValues.idCardIssuedDate}
                                            onChange={(e) => handleInputChange('idCardIssuedDate', e.target.value)}
                                            placeholder="Issue Date"
                                            className="bg-gray-800 rounded px-2 py-1 w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={formValues.idCardExpiredDate}
                                            onChange={(e) => handleInputChange('idCardExpiredDate', e.target.value)}
                                            placeholder="Expiry Date"
                                            className="bg-gray-800 rounded px-2 py-1 w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Driving License Information */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('drivingLicense')}
                        >
                            <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400">Driving License Information</span>
                            </div>
                            {expandedSections.drivingLicense ?
                                <ChevronUp className="h-4 w-4 text-gray-400" /> :
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            }
                        </div>

                        {expandedSections.drivingLicense && (
                            <div className="space-y-3 mt-3">
                                <input
                                    type="text"
                                    value={formValues.drivingLicenseID}
                                    onChange={(e) => handleInputChange('drivingLicenseID', e.target.value)}
                                    placeholder="License Number"
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <input
                                    type="text"
                                    value={formValues.drivingLicenseIssuedBy}
                                    onChange={(e) => handleInputChange('drivingLicenseIssuedBy', e.target.value)}
                                    placeholder="Issued By"
                                    className="bg-gray-800 rounded px-2 py-1 w-full"
                                />
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={formValues.drivingLicenseIssuedDate}
                                            onChange={(e) => handleInputChange('drivingLicenseIssuedDate', e.target.value)}
                                            placeholder="Issue Date"
                                            className="bg-gray-800 rounded px-2 py-1 w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={formValues.drivingLicenseExpiredDate}
                                            onChange={(e) => handleInputChange('drivingLicenseExpiredDate', e.target.value)}
                                            placeholder="Expiry Date"
                                            className="bg-gray-800 rounded px-2 py-1 w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
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
        </Drawer>
    );

}