import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Mail, User, KeyRound } from 'lucide-react';

const ProfileSettings: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Avatar Section */}
            <div className="border border-outline p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center">
                            <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <Button size="icon" className="absolute bottom-0 right-0 rounded-full w-8 h-8">
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Recommended: Square image, at least 200x200px
                        </p>
                        <Button variant="outline" size="sm">Upload Image</Button>
                    </div>
                </div>
            </div>

            {/* Personal Information Section */}
            <div className="border border-outline p-4 rounded-lg space-y-6">
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                
                {/* Username Field */}
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                        <Input 
                            id="username"
                            className="pl-10" 
                            placeholder="Enter your username"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Input 
                            id="email"
                            type="email"
                            className="pl-10" 
                            placeholder="Enter your email"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Password Change Section */}
            <div className="border border-outline p-4 rounded-lg space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <Button variant="outline">
                        <KeyRound className="mr-2 h-4 w-4" />
                        Change Password
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Secure your account with a strong password. We recommend using a combination of letters, numbers, and special characters.
                </p>
            </div>
        </div>
    );
};

export default ProfileSettings;