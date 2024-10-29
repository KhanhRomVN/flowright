import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

const GeneralSettings: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Language Section */}
            <div className='border border-outline p-4'>
                <div className='flex items-center justify-between border-b border-outline mb-4'>
                    <h3 className="text-lg font-medium mb-2">Language</h3>
                </div>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your favorite language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="vi">Vietnamese</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Display Section */}
            <div className='border border-outline p-4'>
                <div className='flex items-center justify-between border-b border-outline mb-4'>
                    <h3 className="text-lg font-medium mb-2">Display</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Display web icon</Label>
                            <p className="text-sm text-muted-foreground">
                                Proton Pass will display the icon of the content through the anonymous image servers of Proton.
                            </p>
                        </div>
                        <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Always display the username field</Label>
                            <p className="text-sm text-muted-foreground">
                                When you create or edit a login account on Proton Pass, the "username" field will always be displayed.
                            </p>
                        </div>
                        <Switch />
                    </div>
                </div>
            </div>

            {/* Offline Mode Section */}
            <div className='border border-outline p-4'>
                <div className="flex items-center justify-between border-b border-outline mb-4">
                    <h3 className="text-lg font-medium">Offline Mode</h3>
                    <Button variant="outline" size="sm" className="text-blue-500">
                        Upgrade
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Offline mode is not available with your user package and is not compatible with the two-password mode.
                </p>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Turn on offline mode</Label>
                        <p className="text-sm text-muted-foreground">
                            Soladal Pass will ask for your Soladal password to access offline data.
                        </p>
                    </div>
                    <Switch disabled />
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;