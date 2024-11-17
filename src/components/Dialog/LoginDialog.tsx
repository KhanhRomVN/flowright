import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface LoginDialogProps {
    email: string;
    isOpen: boolean;
    onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ email, isOpen, onClose }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5050/api/users/login', {
                email,
                password
            });

            if (response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('currentEmail', email);
                window.location.href = '/';
            }
        } catch (err) {
            setError('Login failed. Please check your password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle>Login to continue</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="email"
                            value={email}
                            disabled
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            autoFocus
                        />
                    </div>
                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}
                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;