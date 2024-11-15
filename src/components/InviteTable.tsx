import React, { useEffect, useState } from 'react';
import { _DELETE, _GET } from '@/utils/auth_api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Ví dụ import Button
import { Alert } from "@/components/ui/alert"; // Ví dụ import Alert

interface Invite {
    id: string;
    email: string;
    roleId: string;
    roleName: string;
    token: string;
    status: string;
    expiresAt: string;
}

const InviteTable: React.FC = () => {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const data = await _GET('/workspace/service/invites');
                setInvites(data);
            } catch (error) {
                console.error('Error fetching invites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvites();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleDelete = async (id: string) => {
        try {
            await _DELETE(`/workspace/service/invites?id=${id}`); // Call delete API
            setInvites(invites.filter(invite => invite.id !== id)); // Update state to remove deleted invite
        } catch (error) {
            console.error('Error deleting invite:', error);
        }
    };  

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead>Action</TableHead> {/* Added Action header */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {invites.map(invite => (
                    <TableRow key={invite.id}>
                        <TableCell>{invite.email}</TableCell>
                        <TableCell>{invite.roleName}</TableCell>
                        <TableCell>{invite.status}</TableCell>
                        <TableCell>{new Date(invite.expiresAt).toLocaleString()}</TableCell>
                        <TableCell>
                            <Button onClick={() => handleDelete(invite.id)}>Delete</Button> {/* Added Delete button */}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default InviteTable;