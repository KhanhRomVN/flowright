import React, { useState, useEffect } from 'react';
import { _GET } from '../../utils/auth_api';
import { FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditNoteContentDrawer from '@/components/Drawer/EditDrawer/EditNoteContentDrawer';

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

interface NoteContentProps {
    id: number | null;
}

const NoteContent: React.FC<NoteContentProps> = ({ id }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint = id ? `/notes/group/${id}` : '/notes';
                const data = await _GET(endpoint);
                setNotes(data);
                if (data.length > 0) {
                    setSelectedNote(data[0]);
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
                setError('Failed to fetch notes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [id]);

    const renderNotePreview = (note: Note) => {
        const previewLength = 50;
        if (note.notes.length <= previewLength) return note.notes;
        return note.notes.substring(0, previewLength) + '...';
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="flex">
            {/* List Notes */}
            <div className="w-1/3 pr-2 border-r border-gray-700/50">
                {notes.length === 0 ? (
                    <p>No notes found.</p>
                ) : (
                    <ul className="space-y-2">
                        {notes.map((note) => (
                            <li
                                key={note.id}
                                className={`rounded cursor-pointer flex items-center p-2 transition-colors duration-200 ${
                                    selectedNote?.id === note.id
                                        ? 'bg-blue-500/20'
                                        : 'hover:bg-gray-500/50'
                                }`}
                                onClick={() => setSelectedNote(note)}
                            >
                                <Button
                                    variant="ghost"
                                    className="p-2 mr-3 bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200"
                                >
                                    <FileText className="h-5 w-5 text-white" />
                                </Button>
                                <div>
                                    <p className="text-sm">{note.title}</p>
                                    <p className="text-xs text-gray-600">{renderNotePreview(note)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Note Selected Content */}
            <div className="w-2/3 pl-4 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.3)]">
                {selectedNote ? (
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">{selectedNote.title}</h2>
                            <Button
                                variant="ghost"
                                className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                Edit
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {/* Note Content */}
                            <div className="border border-gray-800/100 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <FileText className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <h3 className="font-medium">{selectedNote.title}</h3>
                                </div>
                                <div className="mt-4 whitespace-pre-wrap">
                                    {selectedNote.notes}
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="text-xs text-gray-500 space-y-1 border border-gray-800/100 p-4 rounded-lg">
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Created: {new Date(selectedNote.createdAt).toLocaleString()}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Updated: {new Date(selectedNote.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No note selected.</p>
                )}
            </div>
            <EditNoteContentDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                note={selectedNote}
            />
        </div>
    );
};

export default NoteContent;