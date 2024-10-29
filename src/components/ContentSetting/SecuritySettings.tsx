import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SecuritySettings: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Unlock Methods Section */}
      <div className='border border-outline p-4'>
        <div className='flex items-center justify-between border-b border-outline mb-4'>
          <h3 className="text-lg font-medium mb-2">Unlock with</h3>
        </div>
        <RadioGroup defaultValue="password" className="space-y-4">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="none" id="none" />
            <div className="space-y-0.5">
              <Label htmlFor="none" className="text-base">None</Label>
              <p className="text-sm text-muted-foreground">Proton Pass will always be accessible</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="pin" id="pin" />
            <div className="space-y-0.5">
              <Label htmlFor="pin" className="text-base">PIN</Label>
              <p className="text-sm text-muted-foreground">Online access to Proton Pass will require your PIN. You will be logged out after 3 failed attempts.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <RadioGroupItem value="password" id="password" />
            <div className="space-y-0.5">
              <Label htmlFor="password" className="text-base">Password</Label>
              <p className="text-sm text-muted-foreground">Access to Proton Pass will always require your Proton password.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <RadioGroupItem value="biometrics" id="biometrics" disabled />
            <div className="space-y-0.5">
              <Label htmlFor="biometrics" className="text-base">Biometrics</Label>
              <p className="text-sm text-muted-foreground">This option is currently not available on your device.</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Auto-Lock Section */}
      <div className='border border-outline p-4'>
        <div className='flex items-center justify-between border-b border-outline mb-4'>
          <h3 className="text-lg font-medium mb-2">Auto-lock after</h3>
        </div>
        <Select defaultValue="10">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="10">10 minutes</SelectItem>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Secondary Password Section */}
      <div className='border border-outline p-4'>
        <div className='flex items-center justify-between border-b border-outline mb-4'>
          <h3 className="text-lg font-medium mb-2">Secondary Password</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Protect Proton Pass with an extra password</Label>
            <p className="text-sm text-muted-foreground">
              Secondary password will be required to use Proton Pass. It works as an additional password besides your Proton password.
            </p>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;