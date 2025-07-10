// File: src/app/(admin)/admin/approval/olympiad/[id]/olympiad-resource-review-actions.tsx

'use client';

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

interface ResourceReviewActionsProps {
    resourceId: number;
}

export default function ResourceReviewActions({ resourceId }: ResourceReviewActionsProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const isSubmitting = isApproving || isRejecting;
    const router = useRouter();

    // Handle approve action
    const handleApprove = async () => {
        setIsApproving(true);

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
        }
    };

    // Handle reject action
    const handleReject = async () => {
        setIsRejecting(true);

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
                            <DialogTitle>Reject Resource</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Are you sure you want to reject this olympiad resource? This action cannot be undone.
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