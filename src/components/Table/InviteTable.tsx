import React, { useEffect, useState, useRef } from 'react';
import { _DELETE, _GET } from '@/utils/auth_api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw, Mail, Clock, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";



interface Invite {
    id: string;
    email: string;
    roleId: string;
    roleName: string;
    token: string;
    status: string;
    expiresAt: string;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig = {
        PENDING: {
            className: "bg-yellow-100 text-yellow-800",
            label: "Pending"
        },
        ACCEPTED: {
            className: "bg-green-100 text-green-800",
            label: "Accepted"
        },
        EXPIRED: {
            className: "bg-red-100 text-red-800",
            label: "Expired"
        }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
        className: "bg-gray-100 text-gray-800",
        label: status
    };

    return (
        <span className={cn(
            "px-2 py-1 rounded-full text-sm font-medium",
            config.className
        )}>
            {config.label}
        </span>
    );
};

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
    return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {role}
        </span>
    );
};

const LoadingSkeleton: React.FC = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {[...Array(5)].map((_, i) => (
                        <TableHead key={i}>
                            <Skeleton height={20} />
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        {[...Array(5)].map((_, j) => (
                            <TableCell key={j}>
                                <Skeleton height={20} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const InviteTable: React.FC = () => {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    const fetchInvites = async () => {
        try {
            const data = await _GET('/workspace/service/invites/workspace');
            setInvites(data);
        } catch (error) {
            console.error('Error fetching invites:', error);
            toast.error('Failed to fetch invites');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            setDeletingIds(prev => new Set(prev).add(id));
            await _DELETE(`/workspace/service/invites?id=${id}`);
            setInvites(invites.filter(invite => invite.id !== id));
            toast.success('Invite deleted successfully');
        } catch (error) {
            console.error('Error deleting invite:', error);
            toast.error('Failed to delete invite');
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
        >
            <div className="rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-bold">
                                <div className="flex items-center space-x-2">
                                    <UserCircle className="w-4 h-4" />
                                    <span>Role</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="font-bold">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Expires At</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-bold">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {invites.map(invite => (
                                <motion.tr
                                    key={invite.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-sidebar-primary transition-colors"
                                >
                                    <TableCell className="font-medium">{invite.email}</TableCell>
                                    <TableCell>
                                        <RoleBadge role={invite.roleName} />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={invite.status} />
                                    </TableCell>
                                    <TableCell>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {new Date(invite.expiresAt).toLocaleString()}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Expires at {new Date(invite.expiresAt).toLocaleString()}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(invite.id)}
                                            disabled={deletingIds.has(invite.id)}
                                            className="hover:scale-105 transition-transform"
                                        >
                                            {deletingIds.has(invite.id) ? (
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4 mr-2" />
                                            )}
                                            Delete
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {invites.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No invites found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
};

export default InviteTable;