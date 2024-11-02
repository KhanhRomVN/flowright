import React from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@mui/material";
import { Separator } from "@/components/ui/separator";

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: {
        id: number;
        name: string;
        description: string;
        status: string;
        priority: string;
        start_date: string;
        end_date: string;
        members: Array<{ member_id: number; name: string }>;
        link?: Array<{ link_id: number; link_name: string; link_url: string }>;
        logs?: Array<{ log_id: number; log_name: string; log_description: string }>;
    };
}

export default function TaskDialog({ open, onOpenChange, task }: TaskDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl">{task.name}</DialogTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant={
                                task.status === 'completed' ? 'secondary' :
                                    task.status === 'in_progress' ? 'default' :
                                        'outline'
                            }>
                                {task.status === 'not_started' ? 'To Do' :
                                    task.status === 'in_progress' ? 'In Progress' :
                                        'Completed'}
                            </Badge>
                            <Badge variant={
                                task.priority === 'High' ? 'destructive' :
                                    task.priority === 'Medium' ? 'secondary' :
                                        'secondary'
                            }>
                                {task.priority}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-4">
                    <Tabs defaultValue="details">
                        <TabsList>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="comments">Comments</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                            {/* Description Section */}
                            <div>
                                <h3 className="font-medium mb-2">Description</h3>
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>

                            <Separator />

                            {/* Date and Members Section */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">
                                            {format(new Date(task.start_date), 'MMM d, yyyy')} - 
                                            {format(new Date(task.end_date), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Assigned to</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {task.members.map((member) => (
                                                <div key={member.member_id} className="flex items-center gap-2 p-2 rounded-lg border">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{member.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {task.link && task.link.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Links</h4>
                                            <div className="space-y-2">
                                                {task.link.map((link) => (
                                                    <Button
                                                        key={link.link_id}
                                                        variant="outlined"
                                                        startIcon={<LinkIcon size={14} />}
                                                        href={link.link_url}
                                                        target="_blank"
                                                    >
                                                        {link.link_name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="comments">
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground">No comments yet.</div>
                            </div>
                        </TabsContent>

                        <TabsContent value="activity">
                            <div className="space-y-4">
                                {task.logs && task.logs.length > 0 ? (
                                    task.logs.map((log) => (
                                        <div key={log.log_id} className="flex items-start gap-3">
                                            <MessageSquare className="w-4 h-4 mt-1" />
                                            <div>
                                                <h4 className="text-sm font-medium">{log.log_name}</h4>
                                                <p className="text-sm text-muted-foreground">{log.log_description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground">No activity logs yet.</div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}