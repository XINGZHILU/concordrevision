'use client';

// File: app/admin/approval/[id]/note-review-actions.tsx

import React, { useState } from 'react';
import { toaster, Toaster } from "@/components/ui/toaster";
import { useRouter } from 'next/navigation';
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NoteReviewActionsProps {
    noteId: number;
}

export default function NoteReviewActions({ noteId }: NoteReviewActionsProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const isSubmitting = isApproving || isRejecting;
    const router = useRouter();

    // Handle approve action
    const handleApprove = async () => {
        setIsApproving(true);

        try {
            const response = await fetch('/api/admin/approve-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    noteId: noteId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to approve note');
            }

            toaster.success({
                title: "Note approved successfully",
                description: "The note is now available to users"
            });

            // Redirect back to the approval dashboard after a short delay
            setTimeout(() => {
                router.push('/admin/approval');
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error('Error approving note:', error);
            toaster.error({
                title: "Error",
                description: "Failed to approve note. Please try again."
            });
        } finally {
            setIsApproving(false);
        }
    };

    // Handle reject action
    const handleReject = async () => {
        setIsRejecting(true);

        try {
            const response = await fetch('/api/admin/reject-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    noteId: noteId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to reject note');
            }

            toaster.success({
                title: "Note rejected successfully",
                description: "The note has been rejected and will not be published"
            });

            // Redirect back to the approval dashboard after a short delay
            setTimeout(() => {
                router.push('/admin/approval');
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error('Error rejecting note:', error);
            toaster.error({
                title: "Error",
                description: "Failed to reject note. Please try again."
            });
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <>
            <Toaster />
            <div className="flex space-x-4">
                <DialogRoot>
                    <DialogTrigger asChild>
                        <Button variant="destructive" disabled={isSubmitting}>
                            {isRejecting ? "Rejecting..." : "Reject"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Note</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Are you sure you want to reject this note? This action cannot be undone.
                        </DialogDescription>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost" disabled={isSubmitting}>Cancel</Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={isSubmitting}
                            >
                                {isRejecting ? "Rejecting..." : "Reject"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogRoot>

                <Button
                    variant="default"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                >
                    {isApproving ? "Approving..." : "Approve"}
                </Button>
            </div>
        </>
    );
}