// components/ReportIssueModal.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast"
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';


interface ReportIssueModalProps {
    novelId?: string;
    chapterId?: string;
}

export function ReportIssueModal({ novelId, chapterId }: ReportIssueModalProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const { toast } = useToast();
    const { data: session } = useSession()

    const mutation = useMutation({
        mutationFn: async () => {
            await api.post('/reports', { novelId, chapterId, reason, description });
        },
        onSuccess: () => {
            toast({ title: 'Report submitted', description: 'Your report has been submitted successfully.' });
            setOpen(false);
            setReason('');
            setDescription('');
        },
        onError: () => {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit report.' });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to report an issue.' });
            return;
        }
        if (!reason) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a reason.' });
            return;
        }
        mutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full hover:bg-muted/50 transition-all">
                    Report Issue
                </Button>
            </DialogTrigger>
            {
                session ?
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Report an Issue</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Reason</label>
                                <Select value={reason} onValueChange={setReason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Content Error">Content Error</SelectItem>
                                        <SelectItem value="Inappropriate Content">Inappropriate Content</SelectItem>
                                        <SelectItem value="Formatting Issue">Formatting Issue</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide more details about the issue"
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending ? 'Submitting...' : 'Submit Report'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                    :
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Please Log In</DialogTitle>
                        </DialogHeader>
                        <p className="mb-4">You must be logged in to report an issue.</p>
                        <div className="flex justify-end">
                            <Link className='hover:underline' href="/signup">
                                Sign Up
                            </Link>
                            <Link className="ml-2 text-primary hover:underline" href="/login">
                                Sign in
                            </Link>
                        </div>
                    </DialogContent>
            }
        </Dialog>
    );
}