import React, { useState } from 'react';
import {
    Drawer,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    SelectChangeEvent
} from '@mui/material';
import { X } from 'lucide-react';

interface TaskDrawerProps {
    open: boolean;
    onClose: () => void;
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({ open, onClose }) => {
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [link, setLink] = useState<{ linkName: string; linkUrl: string }>({ linkName: '', linkUrl: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement task creation logic here
        onClose();
    };

    const handleMemberChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedMembers(event.target.value as string[]);
    };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink({ ...link, [e.target.name]: e.target.value });
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 400,
                    height: '100vh',
                    overflowY: 'auto',
                    backgroundColor: 'var(--sidebar-primary)',
                    color: 'white',
                    padding: '1.5rem',
                }
            }}
        >
            <div className="flex flex-col custom-scrollbar">
                <div className="flex justify-between items-center mb-6 custom-scrollbar">
                    <Typography variant="h6">Create Task</Typography>
                    <button onClick={onClose} className="text-text-primary hover:text-text-secondary">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField
                        label="Task name"
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                        }}
                    />
                    
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                        }}
                    />

                    <FormControl fullWidth required>
                        <InputLabel sx={{ color: 'white' }}>Project</InputLabel>
                        <Select
                            defaultValue=""
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            }}
                        >
                            <MenuItem value="project1">Project 1</MenuItem>
                            <MenuItem value="project2">Project 2</MenuItem>
                            <MenuItem value="project3">Project 3</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel sx={{ color: 'white' }}>Priority</InputLabel>
                        <Select
                            defaultValue=""
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            }}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Start date"
                        type="date"
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                        }}
                    />

                    <TextField
                        label="End date"
                        type="date"
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                        }}
                    />

                    <FormControl fullWidth required>
                        <InputLabel sx={{ color: 'white' }}>Members</InputLabel>
                        <Select
                            multiple
                            value={selectedMembers}
                            onChange={handleMemberChange as (event: SelectChangeEvent<string[]>) => void}
                            renderValue={(selected) => selected.join(', ')}
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            }}
                        >
                            <MenuItem value="member1">Member 1</MenuItem>
                            <MenuItem value="member2">Member 2</MenuItem>
                            <MenuItem value="member3">Member 3</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Link"
                        name="linkName"
                        value={link.linkName}
                        onChange={handleLinkChange}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                        }}
                    />
                    <TextField
                        label="URL"
                        name="linkUrl"
                        value={link.linkUrl}
                        onChange={handleLinkChange}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                        }}
                    />

                    <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: 'var(--blue-button-background)',
                                '&:hover': {
                                    backgroundColor: 'var(--blue-button-background-hover)',
                                },
                            }}
                        >
                            Tạo Task
                        </Button>
                    </Box>
                </form>
            </div>
        </Drawer>
    );
};

export default TaskDrawer;