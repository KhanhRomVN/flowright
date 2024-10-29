import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { _PUT } from '@/utils/auth_api';

interface Note {
    id: number;
    userId: number;
    groupId: number;
    title: string;
    notes: string;
    type: string;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface EditNoteContentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
}

const EditNoteContentDrawer: React.FC<EditNoteContentDrawerProps> = ({
    isOpen,
    onClose,
    note
}) => {
    const [formValues, setFormValues] = useState<Note | null>(note);

    if (!note || !formValues) return null;

    const handleInputChange = (key: keyof Note, value: string) => {
        setFormValues(prev => prev ? { ...prev, [key]: value } : null);
    };

    const handleUpdateNote = async () => {
        try {
            if (!formValues) return;
            
            await _PUT(`/notes/${note.id}`, formValues);
            onClose();
        } catch (error) {
            console.error("Error updating note:", error);
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
                            onClick={handleUpdateNote}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Title Section */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <FileText className="h-5 w-5 text-purple-400" />
                            </div>
                            <input
                                type="text"
                                value={formValues.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                    </div>

                    {/* Note Content */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Notes</span>
                        </div>
                        <textarea
                            value={formValues.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            className="bg-gray-800 rounded px-2 py-1 w-full min-h-[400px]"
                        />
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default EditNoteContentDrawer;