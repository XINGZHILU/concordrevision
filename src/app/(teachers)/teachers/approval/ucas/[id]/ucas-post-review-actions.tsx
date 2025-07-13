'use client';

import React, { useState } from 'react';
import { toaster } from "@/components/ui/toaster";
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UCASPostReviewActionsProps {
    postId: number;
}

export default function UCASPostReviewActions({ postId }: UCASPostReviewActionsProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const router = useRouter();
    const isSubmitting = isApproving || isRejecting;

    async function handleApprove() {
        setIsApproving(true);
        try {
            const res = await fetch(`/api/admin/approve-ucas-post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId }),
            });
            if (res.ok) {
                toaster.success({
                    title: "UCAS Post Approved",
                    description: "The UCAS post has been successfully approved and is now public."
                });
                router.push('/teachers/approval');
            } else {
                const errorData = await res.json();
                toaster.error({
                    title: "Approval Failed",
                    description: errorData.error || "An unknown error occurred."
                });
            }
        } catch (error) {
            console.error("Approval Error:", error);
            toaster.error({
                title: "Network Error",
                description: "Could not connect to the server. Please try again later."
            });
        } finally {
            setIsApproving(false);
        }
    }

    async function handleReject() {
        setIsRejecting(true);
        try {
            const res = await fetch(`/api/admin/reject-ucas-post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId }),
            });
            if (res.ok) {
                toaster.success({
                    title: "UCAS Post Rejected",
                    description: "The UCAS post has been rejected and will not be made public."
                });
                router.push('/teachers/approval');
            } else {
                const errorData = await res.json();
                toaster.error({
                    title: "Rejection Failed",
                    description: errorData.error || "An unknown error occurred."
                });
            }
        } catch (error) {
            console.error("Rejection Error:", error);
            toaster.error({
                title: "Network Error",
                description: "Could not connect to the server. Please try again later."
            });
        } finally {
            setIsRejecting(false);
        }
    }

    return (
        <div className="flex space-x-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive" disabled={isSubmitting}>
                        {isRejecting ? "Rejecting..." : "Reject"}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject UCAS Post</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to reject this post? This action cannot be undone.
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
            </Dialog>

            <Button
                variant="default"
                onClick={handleApprove}
                disabled={isSubmitting}
            >
                {isApproving ? "Approving..." : "Approve"}
            </Button>
        </div>
    );
} 