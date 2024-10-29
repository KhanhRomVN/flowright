import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FormInput from '@/components/FormInput/FormInput';
import { apiUrl } from '@/api';
import { router } from "@/routes/router";


const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const inputFields = [
        { title: "Full Name", placeholder: "Enter your full name", key: "name" },
        { title: "Username", placeholder: "Choose a username", key: "username" },
        { title: "Email", placeholder: "Enter your email", key: "email", type: "email" },
        { title: "Password", placeholder: "Create a password", key: "password", type: "password" }
    ];

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${apiUrl}/users`, formData);

            if (response.data) {
                router.navigate({ to: '/login' });
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-purple-900 flex flex-col">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-2">◆</span> Soladal
                </h1>
            </div>
            <div className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-gray-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
                        <p className="text-gray-400">Create your Soladal account</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <FormInput
                                fields={inputFields}
                                values={formData}
                                onChange={handleInputChange}
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Create Account</Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-400">
                            {/* Already have an account? <Link href="/login" className="text-purple-400 hover:underline">Sign in</Link> */}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;