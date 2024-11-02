import React from 'react';
import {
    Drawer,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@mui/material';
import { X } from 'lucide-react';

interface TaskDrawerProps {
    open: boolean;
    onClose: () => void;
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({ open, onClose }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement task creation logic here
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 400,
                    backgroundColor: 'var(--sidebar-primary)',
                    color: 'white',
                    padding: '1.5rem',
                }
            }}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <Typography variant="h6">Tạo Task Mới</Typography>
                    <button onClick={onClose} className="text-white hover:text-gray-300">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField
                        label="Tên task"
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

                    <FormControl fullWidth>
                        <InputLabel sx={{ color: 'white' }}>Độ ưu tiên</InputLabel>
                        <Select
                            defaultValue=""
                            required
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                            }}
                        >
                            <MenuItem value="low">Thấp</MenuItem>
                            <MenuItem value="medium">Trung bình</MenuItem>
                            <MenuItem value="high">Cao</MenuItem>
                        </Select>
                    </FormControl>

                    <div className="flex gap-4">
                        <TextField
                            label="Thời gian bắt đầu"
                            type="time"
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
                            label="Thời gian kết thúc"
                            type="time"
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
                    </div>

                    <TextField
                        label="Mô tả"
                        multiline
                        rows={4}
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