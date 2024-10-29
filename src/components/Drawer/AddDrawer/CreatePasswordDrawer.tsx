import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import { X, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreatePasswordDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePasswordDrawer({ isOpen, onClose }: CreatePasswordDrawerProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [length, setLength] = useState(32);
    const [useSpecialChars, setUseSpecialChars] = useState(true);
    const [name, setName] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [age, setAge] = useState('');
    const [passwordType, setPasswordType] = useState<'random' | 'personal'>('random');

    const generatePassword = () => {
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (useSpecialChars) {
            charset += "!@#$%^&*()_+";
        }

        let newPassword = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            newPassword += charset[randomIndex];
        }
        setPassword(newPassword);
    };

    const generatePersonalPassword = () => {
        if (!name || !birthYear || !age) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const namePart = name.replace(/\s/g, '').toLowerCase();
        const specialChars = useSpecialChars ? ['!', '@', '#', '$', '%', '^', '&', '*'] : [];
        const numbers = birthYear + age;
        
        let newPassword = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        newPassword += numbers;
        if (specialChars.length > 0) {
            newPassword += specialChars[Math.floor(Math.random() * specialChars.length)];
        }
        
        setPassword(newPassword);
    };

    const handleGeneratePassword = () => {
        if (passwordType === 'personal') {
            generatePersonalPassword();
        } else {
            generatePassword();
        }
    };

    const handleCopyAndClose = () => {
        navigator.clipboard.writeText(password);
        onClose();
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
                        <Button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="bg-primary hover:bg-gray-800/80"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Generate
                        </Button>
                        <Button
                            className="bg-purple-500 hover:bg-purple-600"
                            onClick={handleCopyAndClose}
                        >
                            Copy and Close
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Password Type Selection */}
                    <div className="border border-gray-800/100 p-4 rounded-lg">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setPasswordType('random')}
                                className={`px-4 py-2 rounded ${
                                    passwordType === 'random' ? 'bg-purple-500' : 'bg-gray-700'
                                }`}
                            >
                                Ngẫu nhiên
                            </button>
                            <button
                                onClick={() => setPasswordType('personal')}
                                className={`px-4 py-2 rounded ${
                                    passwordType === 'personal' ? 'bg-purple-500' : 'bg-gray-700'
                                }`}
                            >
                                Thông tin cá nhân
                            </button>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-400" />
                            <div className="relative flex-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    readOnly
                                    placeholder="Generated Password"
                                    className="bg-gray-800 rounded px-2 py-1 w-full pr-16"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-300"
                                    >
                                        {showPassword ?
                                            <EyeOff className="h-4 w-4" /> :
                                            <Eye className="h-4 w-4" />
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info Fields */}
                    {passwordType === 'personal' && (
                        <div className="border border-gray-800/100 p-4 rounded-lg space-y-3">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Họ và tên"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                            <input
                                type="number"
                                value={birthYear}
                                onChange={(e) => setBirthYear(e.target.value)}
                                placeholder="Năm sinh"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Tuổi"
                                className="bg-gray-800 rounded px-2 py-1 w-full"
                            />
                        </div>
                    )}

                    {/* Settings */}
                    <div className="border border-gray-800/100 p-4 rounded-lg space-y-4">
                        {passwordType === 'random' && (
                            <div>
                                <label className="text-gray-400 text-sm">
                                    Length ({length} characters)
                                </label>
                                <input
                                    type="range"
                                    min="8"
                                    max="64"
                                    value={length}
                                    onChange={(e) => setLength(Number(e.target.value))}
                                    className="w-full mt-2"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Special characters (!@#$%^&*)</span>
                            <div
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                                    useSpecialChars ? 'bg-purple-500' : 'bg-gray-600'
                                }`}
                                onClick={() => setUseSpecialChars(!useSpecialChars)}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                        useSpecialChars ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}