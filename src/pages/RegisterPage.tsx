import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { apiUrl } from '@/api';
import { router } from "@/routes/router";
import { closeWindow, maximizeWindow, minimizeWindow } from '@/helpers/window_helpers';
import { Eye, EyeOff, Maximize2, Minus, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const inputFields = [
        {
            name: "name",
            type: "text",
            placeholder: "Full Name",
            value: formData.name
        },
        {
            name: "username",
            type: "text",
            placeholder: "Username",
            value: formData.username
        },
        {
            name: "email",
            type: "email",
            placeholder: "Email",
            value: formData.email
        },
        {
            name: "password",
            type: showPassword ? "text" : "password",
            placeholder: "Password",
            value: formData.password,
            icon: showPassword ? Eye : EyeOff,
            onIconClick: () => setShowPassword(!showPassword)
        }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${apiUrl}/auth/register`, formData);

            if (response.data) {
                toast.success('Registration successful!', {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
                router.navigate({ to: '/login' });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" // Changed from just flex to flex flex-col
            style={{
                backgroundImage: `url("src/assets/backgrounds/back1.jpg")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
            <ToastContainer />

            {/* Add Custom Navbar */}
            <div className="flex w-full items-center justify-between pt-3 px-4 bg-transparent">
                <p className="text-xl font-semibold text-gray-200">Flowright</p>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={minimizeWindow}
                        className="p-1 rounded-full hover:bg-button-blueOpacity hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        title="Minimize"
                    >
                        <span className="w-5 h-5 flex items-center justify-center">
                            <Minus />
                        </span>
                    </button>
                    <button
                        onClick={maximizeWindow}
                        className="p-1 rounded-full hover:bg-button-greenOpacity hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        title="Maximize"
                    >
                        <span className="w-5 h-5 flex items-center justify-center">
                            <Maximize2 />
                        </span>
                    </button>
                    <button
                        onClick={closeWindow}
                        className="p-1 rounded-full hover:bg-button-redOpacity hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                        title="Close"
                    >
                        <span className="w-5 h-5 flex items-center justify-center">
                            <X />
                        </span>
                    </button>
                </div>
            </div>

            {/* Wrap existing content */}
            <div className="flex items-center flex-1">
                <div className="w-full max-w-md p-4 rounded-lg ml-16">
                    <p className="font-semibold mb-4 text-gray-500">START MANAGER YOUR TASK WITH FLOWRIGHT</p>
                    <p className="text-4xl font-semibold mb-4">Create your account</p>
                    <p className="text-sm text-gray-600 mt-4 mb-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                    </p>
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <form onSubmit={handleRegister} className="space-y-4">
                        {inputFields.map((field) => (
                            <div key={field.name} className="relative">
                                <input
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    value={field.value}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-transparent border-0 border-b focus:outline-blue-600 focus:border-blue-500 focus:bg-[#595B63] transition-all"
                                />
                                {field.icon && (
                                    <button
                                        type="button"
                                        onClick={field.onIconClick}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {React.createElement(field.icon, { size: 20 })}
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="space-y-4">
                            <Button type="submit" className="w-full py-3 bg-[#5195EA] text-white">
                                Create Account
                            </Button>
                        </div>

                    </form>


                </div>

            </div>

        </div>

    );
};

export default RegisterPage;