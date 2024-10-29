import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Bug, Mail, MessageSquare } from 'lucide-react';

const SupportSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Bug Report Section */}
      <div className="border border-outline p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Bug className="mr-2 h-5 w-5" />
          Bug Report
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Reports are not end-to-end encrypted, please do not send any sensitive information.
        </p>
        <Textarea 
          placeholder="Please describe the issue and any error messages"
          className="min-h-[150px] mb-4"
        />
        <Button className="w-full">Send</Button>
      </div>

      {/* Contact Support Section */}
      <div className="border border-outline p-4 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <HelpCircle className="mr-2 h-5 w-5" />
          Contact Support
        </h2>

        <div className="space-y-4">
          {/* Email Support */}
          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
            <Mail className="h-5 w-5 mt-1" />
            <div>
              <h3 className="font-medium">Email Support</h3>
              <p className="text-sm text-muted-foreground">
                support@soladal.com
              </p>
            </div>
          </div>

          {/* Live Chat */}
          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
            <MessageSquare className="h-5 w-5 mt-1" />
            <div>
              <h3 className="font-medium">Live Chat</h3>
              <p className="text-sm text-muted-foreground">
                Chat directly with our support team
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border border-outline p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">FAQ</h2>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            How to reset password?
          </Button>
          <Button variant="outline" className="w-full justify-start">
            How to secure my account?
          </Button>
          <Button variant="outline" className="w-full justify-start">
            How to export my data?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportSettings;