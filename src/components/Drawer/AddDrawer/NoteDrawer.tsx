import React, { useRef, useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { X, FileText, ChevronDown } from 'lucide-react';
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

interface NoteDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NoteDrawer({ isOpen, onClose }: NoteDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const groupsData = await _GET('/group/note');
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

    const handleCreateNote = async () => {
        const newErrors: { [key: string]: string } = {};

        // Validate all fields
        if (!formValues.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formValues.notes.trim()) {
            newErrors.notes = 'Notes content is required';
        }

        // If there are any errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        // Clear any existing errors
        setFormErrors({});

        try {
            const noteData = {
                title: formValues.title,
                notes: formValues.notes,
                groupId: selectedGroupId ? selectedGroupId : -1,
                type: 'note',
                isFavorite: false,
            };

            await _POST('/notes', noteData);
            onClose();
        } catch (error) {
            console.error("Error creating note:", error);
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
                            onClick={handleCreateNote}
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
                                    <FileText className="h-5 w-5 text-purple-400" />
                                </div>
                                <input
                                    type="text"
                                    value={formValues.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Note Title"
                                    className={`bg-gray-800 rounded px-2 py-1 w-full ${formErrors.title ? 'border border-red-500' : ''}`}
                                />
                            </div>
                            {formErrors.title && <span className="text-red-500 text-sm ml-11">{formErrors.title}</span>}
                        </div>
                    </div>

                    {/* Note Content */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Notes</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <textarea
                                value={formValues.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Enter your notes here..."
                                className={`bg-gray-800 rounded px-2 py-1 w-full min-h-[400px] ${formErrors.notes ? 'border border-red-500' : ''}`}
                            />
                            {formErrors.notes && <span className="text-red-500 text-sm">{formErrors.notes}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}