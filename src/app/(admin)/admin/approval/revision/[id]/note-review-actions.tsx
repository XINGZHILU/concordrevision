'use client';

// File: app/admin/approval/[id]/note-review-actions.tsx

import React, { useState } from 'react';
import { Button } from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";
import { useRouter } from 'next/navigation';
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";

interface NoteReviewActionsProps {
    noteId: number;
}

export default function NoteReviewActions({ noteId }: NoteReviewActionsProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    // Handle approve action
    const handleApprove = async () => {
        setIsApproving(true);
        setIsSubmitting(true);

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
            setIsSubmitting(false);
        }
    };

    // Handle reject action
    const handleReject = async () => {
        setIsRejecting(true);
        setIsSubmitting(true);

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
            setIsSubmitting(false);
            closeDialog();
        }
    };

    return (
        <>
            <Toaster />
            <div className="flex space-x-4">
                <Button
                    colorScheme="red"
                    onClick={openDialog}
                    loading={isRejecting}
                    loadingText="Rejecting..."
                    disabled={isSubmitting}
                >
                    Reject
                </Button>

                <Button
                    colorScheme="green"
                    onClick={handleApprove}
                    loading={isApproving}
                    loadingText="Approving..."
                    disabled={isSubmitting}
                >
                    Approve
                </Button>
            </div>

            {/* Confirmation Dialog for Rejection */}
            {/* @ts-ignore */}
            <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Note</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        Are you sure you want to reject this note? This action cannot be undone.
                    </DialogBody>
                    <DialogFooter>
                        <Button onClick={closeDialog} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleReject}
                            ml={3}
                            loading={isRejecting}
                            loadingText="Rejecting..."
                            disabled={isSubmitting}
                        >
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </>
    );
}