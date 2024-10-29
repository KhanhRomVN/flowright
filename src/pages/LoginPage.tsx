import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FormInput from '@/components/FormInput/FormInput';
import { apiUrl } from '@/api';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const inputFields = [
        { title: "Email", placeholder: "Please type email...", key: "email", type: "email" },
        { title: "Password", placeholder: "Enter your password", key: "password", type: "password" }
    ];

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${apiUrl}/users/login`, formData);

            if (response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                const existingAccounts = JSON.parse(localStorage.getItem('ListAccount') || '[]');
                
                if (!existingAccounts.includes(formData.email)) {
                    existingAccounts.push(formData.email);
                    localStorage.setItem('ListAccount', JSON.stringify(existingAccounts));
                }
                window.location.href = '/';
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-blue-900 flex flex-col">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-2">◆</span> Soladal
                </h1>
            </div>
            <div className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-gray-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                        <p className="text-gray-400">to continue to Soladal</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <FormInput
                                fields={inputFields}
                                values={formData}
                                onChange={handleInputChange}
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Sign in</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;