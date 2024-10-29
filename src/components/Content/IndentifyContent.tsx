import React, { useState, useEffect } from 'react';
import { _GET } from '../../utils/auth_api';
import { User, Calendar, MapPin, Phone, Mail, Briefcase, Building2, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditIdentifyContentDrawer from '@/components/Drawer/EditDrawer/EditIdentifyContentDrawer';

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

interface IdentifyContentProps {
    id: number | null;
}

const IdentifyContent: React.FC<IdentifyContentProps> = ({ id }) => {
    const [identities, setIdentities] = useState<Identity[]>([]);
    const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showSensitive, setShowSensitive] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchIdentities = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint = id ? `/identities/group/${id}` : '/identities';
                const data = await _GET(endpoint);
                setIdentities(data);
                if (data.length > 0) {
                    setSelectedIdentity(data[0]);
                }
            } catch (error) {
                console.error('Error fetching identities:', error);
                setError('Failed to fetch identities. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchIdentities();
    }, [id]);

    const renderIdentityInfo = (identity: Identity) => {
        if (identity.phone) return identity.phone;
        if (identity.gmail) return identity.gmail;
        return `${identity.firstname} ${identity.lastname}`;
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="flex">
            {/* List Identities */}
            <div className="w-1/3 pr-2 border-r border-gray-700/50 ">
                {identities.length === 0 ? (
                    <p>No identities found.</p>
                ) : (
                    <ul className="space-y-2">
                        {identities.map((identity) => (
                            <li
                                key={identity.id}
                                className={`rounded cursor-pointer flex items-center p-2 transition-colors duration-200 ${
                                    selectedIdentity?.id === identity.id
                                        ? 'bg-blue-500/20'
                                        : 'hover:bg-gray-500/50'
                                }`}
                                onClick={() => setSelectedIdentity(identity)}
                            >
                                <Button
                                    variant="ghost"
                                    className="p-2 mr-3 bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200"
                                >
                                    <User className="h-5 w-5 text-white" />
                                </Button>
                                <div>
                                    <p className="text-sm">{`${identity.firstname} ${identity.lastname}`}</p>
                                    <p className="text-xs text-gray-600">{renderIdentityInfo(identity)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Identity Selected Content */}
            <div className="w-2/3 pl-4 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.3)] overflow-hidden custom-scrollbar">
                {selectedIdentity ? (
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">{`${selectedIdentity.firstname} ${selectedIdentity.lastname}`}</h2>
                            <Button
                                variant="ghost"
                                className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                Edit
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {/* Personal Information */}
                            <div className="border border-gray-800/100 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <User className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <h3 className="font-medium">{`${selectedIdentity.firstname} ${selectedIdentity.lastname}`}</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-400">
                                            {selectedIdentity.dateOfBirth || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-400">
                                            {selectedIdentity.gender || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Phone
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedIdentity.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Gmail
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedIdentity.gmail || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Gmail Password
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-sm">
                                            {selectedIdentity.passwordGmail ? 
                                                (showSensitive ? selectedIdentity.passwordGmail : '••••••••')
                                                : 'N/A'}
                                        </span>
                                        {selectedIdentity.passwordGmail && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-purple-400 hover:bg-purple-400/10"
                                                onClick={() => setShowSensitive(!showSensitive)}
                                            >
                                                {showSensitive ? 'Hide' : 'Show'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Street
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedIdentity.street || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> City
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedIdentity.city || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Globe className="h-4 w-4" /> Country
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedIdentity.country || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Job Information */}
                            <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" /> Job Title
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedIdentity.jobTitle || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm flex items-center gap-2">
                                        <Building2 className="h-4 w-4" /> Company
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedIdentity.jobCompany || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedIdentity.notes && (
                                <div className="border border-gray-800/100 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> Notes
                                    </p>
                                    <p className="mt-1 text-sm">{selectedIdentity.notes}</p>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="text-xs text-gray-500 space-y-1 border border-gray-800/100 p-4 rounded-lg">
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Created: {new Date(selectedIdentity.createdAt).toLocaleString()}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Updated: {new Date(selectedIdentity.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No identity selected.</p>
                )}
            </div>
            <EditIdentifyContentDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                identity={selectedIdentity}
            />
        </div>
    );
};

export default IdentifyContent;