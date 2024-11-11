import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';

const fakeSpecializations = [
    {
        "id": "b023423d-79a7-41d8-8fb0-fe8009e17f96",
        "name": "Frontend Developer",
        "description": "Converts interface design code into a visual image of an application or website for ease of use by users",
        "workspaceId": "f241696e-5e64-41a1-ad16-57258e55a696"
    },
    {
        "id": "b023423d-79a7-41d8-8fb0-fe8009e17f97",
        "name": "Backend Developer",
        "description": "Converts interface design code into a visual image of an application or website for ease of use by users",
        "workspaceId": "f241696e-5e64-41a1-ad16-57258e55a696"
    },
    {
        "id": "b023423d-79a7-41d8-8fb0-fe8009e17f98",
        "name": "Full Stack Developer",
        "description": "Converts interface design code into a visual image of an application or website for ease of use by users",
        "workspaceId": "f241696e-5e64-41a1-ad16-57258e55a696"
    }
];

interface Specialization {
    id: string;
    name: string;
    description: string;
    workspaceId: string;
}

const SpecializationSetting: React.FC = () => {
    const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);

    return (
        <div className="flex gap-2">
            <SpecializationSidebar onSelect={setSelectedSpecialization} /> {/* Use the new sidebar component */}
            <div className="w-3/4">
                <SpecializationDetails specialization={selectedSpecialization} />
            </div>
        </div>
    );
};

const SpecializationSidebar: React.FC<{ onSelect: (specialization: Specialization) => void }> = ({ onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSpecializations = fakeSpecializations.filter(specialization =>
        specialization.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddSpecialization = () => {
        setIsDialogOpen(true);
    };

    return (
        <div className="w-1/3 p-4 border-r bg-sidebar-primary border h-[calc(100vh-13rem)] rounded-lg flex flex-col justify-between">
            <div>
                <h2 className="text-lg font-bold mb-2">Specializations</h2>
                <div className="relative mb-4 bg-sidebar-secondary rounded-lg">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <Input
                        placeholder="Search specializations..."
                        className="pl-8 text-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search specializations"
                    />
                </div>
                <ul className="max-h-[calc(100vh-20rem)] overflow-y-auto space-y-2 scrollbar-hide">
                    {filteredSpecializations.length > 0 ? (
                        filteredSpecializations.map((specialization) => (
                            <li
                                key={specialization.id}
                                className="cursor-pointer hover:bg-button-blueOpacity p-2 transition-colors duration-200 focus:bg-button-blueBackground rounded-lg"
                                onClick={() => onSelect(specialization)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && onSelect(specialization)}
                            >
                                {specialization.name}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">No specializations found.</li>
                    )}
                </ul>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4 flex items-center gap-2" onClick={handleAddSpecialization}>
                <Plus className="mr-2 w-4 h-4" />
                Add Specialization
            </Button>
        </div>
    );
};

const SpecializationDetails: React.FC<{ specialization: Specialization | null }> = ({ specialization }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'member'>('info');
    const specializationMembers = fakeSpecializationMember();

    const [searchTerm, setSearchTerm] = useState('');

    const filteredMembers = specialization?.id
        ? specializationMembers.filter(member =>
            member.specializationId === specialization.id && // Sửa đổi ở đây
            (member.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.specializationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.yearOfExperience.toString().includes(searchTerm))
        )
        : [];

    return (
        <div>
            <div className="bg-sidebar-primary rounded-lg p-4 border h-[calc(100vh-13rem)]">
                {/* Tab Navigation */}
                <div className="flex space-x-4 border-b mb-2">
                    <button
                        className={`p-2 ${activeTab === 'info' ? 'font-bold' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Info
                    </button>
                    <button
                        className={`p-2 ${activeTab === 'member' ? 'font-bold' : ''}`}
                        onClick={() => setActiveTab('member')}
                    >
                        Member
                    </button>
                </div>
                {/* Tab Content */}
                {activeTab === 'info' ? (
                    <div className="p-4 rounded-lg">
                        <Input
                            className="text-2xl font-bold text-blue-600"
                            value={specialization?.name || ''}
                        />
                        <Input
                            className="text-gray-700 mt-2"
                            value={specialization?.description || ''}
                        />
                    </div>
                ) : (
                    <SpecializationMember specializationId={specialization?.id} />
                )}
            </div>
        </div>
    );
};

const SpecializationMember: React.FC<{ specializationId: string | undefined }> = ({ specializationId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const specializationMembers = fakeSpecializationMember();

    const filteredMembers = specializationId
        ? specializationMembers.filter(member =>
            member.specializationId === specializationId &&
            member.level.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <div>
            <h3 className="text-lg font-semibold">Members</h3>
            <div className="relative mb-4">
                <Input
                    placeholder="Search members by level..."
                    className="pl-8 text-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search members"
                />
            </div>
            {filteredMembers.length > 0 ? (
                <ul className="space-y-2">
                    {filteredMembers.map(member => (
                        <li key={member.id} className="p-2 border rounded-lg bg-gray-800 text-white">
                            <div>
                                <strong>Username:</strong> {member.username}
                            </div>
                            <div>
                                <strong>Email:</strong> {member.email}
                            </div>
                            <div>
                                <strong>Level:</strong> {member.level}
                            </div>
                            <div>
                                <strong>Years of Experience:</strong> {member.yearOfExperience}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No members found for this specialization.</p>
            )}
        </div>
    );
};

export default SpecializationSetting;


interface SpecializationMember {
    id: string;
    memberId: string;
    username: string;
    email: string;
    specializationId: string;
    specializationName: string;
    level: string;
    yearOfExperience: number;
    isDefault: boolean;
}

// A member can have multiple specializations but only one default specialization
const fakeSpecializationMember = () => {
    return [
        {
            "id": "b023423d-79a7-41d8-8fb0-fe8009e17f96",
            "memberId": "1234567890",
            "username": "John Doe",
            "email": "john.doe@example.com",
            "specializationId": "b023423d-79a7-41d8-8fb0-fe8009e17f96",
            "specializationName": "Frontend Developer",
            "level": "junior",
            "yearOfExperience": 1,
            "isDefault": false
        },
        {
            "id": "b023423d-79a7-41d8-8fb0-fe8009e17f97",
            "memberId": "1234567890",
            "username": "Jane Doe",
            "email": "jane.doe@example.com",
            "specializationId": "b023423d-79a7-41d8-8fb0-fe8009e17f96",
            "specializationName": "Frontend Developer",
            "level": "senior",
            "yearOfExperience": 3,
            "isDefault": true
        },
        {
            "id": "b023423d-79a7-41d8-8fb0-fe8009e17f98",
            "memberId": "1234567891",
            "username": "John Doe",
            "email": "john.doe@example.com",
            "specializationId": "b023423d-79a7-41d8-8fb0-fe8009e17f98",
            "specializationName": "Full Stack Developer",
            "level": "expert",
            "yearOfExperience": 5,
            "isDefault": false
        }
    ];
}