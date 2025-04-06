// File: src/app/(admin)/admin/approval/olympiad/[id]/olympiad-resource-review-actions.tsx

'use client';

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

interface ResourceReviewActionsProps {
    resourceId: number;
}

export default function ResourceReviewActions({ resourceId }: ResourceReviewActionsProps) {
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
            const response = await fetch('/api/admin/approve-olympiad-resource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resourceId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to approve resource');
            }

            toaster.success({
                title: "Resource approved successfully",
                description: "The resource is now available to users"
            });

            // Redirect back to the approval dashboard after a short delay
            setTimeout(() => {
                router.push('/admin/approval');
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error('Error approving resource:', error);
            toaster.error({
                title: "Error",
                description: "Failed to approve resource. Please try again."
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
            const response = await fetch('/api/admin/reject-olympiad-resource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resourceId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to reject resource');
            }

            toaster.success({
                title: "Resource rejected successfully",
                description: "The resource has been rejected and will not be published"
            });

            // Redirect back to the approval dashboard after a short delay
            setTimeout(() => {
                router.push('/admin/approval');
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error('Error rejecting resource:', error);
            toaster.error({
                title: "Error",
                description: "Failed to reject resource. Please try again."
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
                        <DialogTitle>Reject Resource</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        Are you sure you want to reject this olympiad resource? This action cannot be undone.
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