import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SpecializationDetailsProps {
    specialization: {
        name: string;
        description: string;
        members: Array<{ id: string; name: string; level: string }>; // Adjust based on your member structure
    } | null;
}

const SpecializationDetails: React.FC<SpecializationDetailsProps> = ({ specialization }) => {
    if (!specialization) {
        return <p>Please select a specialization to see the details.</p>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold">{specialization.name}</h2>
            <p>{specialization.description}</p>
            <Tabs defaultValue="info">
                <TabsList>
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Info</h3>
                        <p>Additional information can go here.</p>
                    </div>
                </TabsContent>
                <TabsContent value="members">
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Members</h3>
                        <ul>
                            {specialization.members.map(member => (
                                <li key={member.id}>
                                    {member.name} - {member.level}
                                </li>
                            ))}
                        </ul>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SpecializationDetails;