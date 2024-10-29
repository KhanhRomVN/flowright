import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { router } from "@/routes/router";
import LoginDialog from "@/components/LoginDialog";
import { Link } from "@tanstack/react-router";

const SwitchPage: React.FC = () => {
    const accounts = JSON.parse(localStorage.getItem('ListAccount') || '[]');
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);


    const handleSignOut = (email: string) => {
        const updatedAccounts = accounts.filter((acc: string) => acc !== email);
        localStorage.setItem('ListAccount', JSON.stringify(updatedAccounts));
        if (email === localStorage.getItem('currentEmail')) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('currentEmail');
        }
        window.location.reload();
    };

    const handleSignOutAll = () => {
        localStorage.removeItem('ListAccount');
        localStorage.removeItem('access_token');
        localStorage.removeItem('currentEmail');
        window.location.href = '/login';
    };

    const handleAccountSelect = (email: string) => {
        setSelectedEmail(email);
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
                        <CardTitle className="text-2xl font-bold">Choose an account</CardTitle>
                        <p className="text-gray-400">to continue to Soladal</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {accounts.map((email: string) => (
                            <div key={email} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center" onClick={() => handleAccountSelect(email)}>
                                        <span className="text-xl font-bold">{email[0].toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium cursor-pointer" onClick={() => handleAccountSelect(email)}>{email}</p>
                                        <button 
                                            onClick={() => handleSignOut(email)}
                                            className="text-purple-400 text-sm hover:text-purple-300"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleAccountSelect(email)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    →
                                </button>
                            </div>
                        ))}
                        
                        <Button 
                            variant="outline" 
                            className="w-full mt-4 border-gray-700 text-white hover:bg-gray-800"
                        >
                            <Link to="/login">Add Soladal Account</Link>
                        </Button>
                        
                        <button 
                            onClick={handleSignOutAll}
                            className="w-full text-center text-purple-400 hover:text-purple-300 mt-4"
                        >
                            <Link to="/login">Sign out of all accounts</Link>
                        </button>
                    </CardContent>
                </Card>
            </div>
            <LoginDialog
                email={selectedEmail || ''}
                isOpen={!!selectedEmail}
                onClose={() => setSelectedEmail(null)}
            />
        </div>
    );
};

export default SwitchPage;