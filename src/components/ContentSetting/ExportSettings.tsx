import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';

const ExportSettings: React.FC = () => {
  return (
    <div className="space-y-6 border border-outline p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Export</h2>
      
      {/* File Format Selection */}
      <div className="space-y-4">
        <h3 className="text-base font-medium">File format</h3>
        <RadioGroup defaultValue="pgp-json">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pgp-json" id="pgp-json" />
            <Label htmlFor="pgp-json">PGP-encrypted JSON (recommended)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="json" id="json" />
            <Label htmlFor="json">JSON</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="csv" id="csv" />
            <Label htmlFor="csv">CSV</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Password Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Your exported file is encrypted with PGP and needs a strong password.
        </p>
        <div className="relative">
          <Input type="password" className="pr-10" />
          <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Export Button */}
      <Button className="w-full">Export</Button>
    </div>
  );
};

export default ExportSettings;