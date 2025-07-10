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

interface NoteReviewActionsProps {
    noteId: number;
}

export default function NoteReviewActions({ noteId }: NoteReviewActionsProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const router = useRouter();
    const isSubmitting = isApproving || isRejecting;

    async function handleApprove() {
        setIsApproving(true);
        try {
            const res = await fetch(`/api/admin/approve-note`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId }),
            });
            if (res.ok) {
                toaster.success({
                    title: "Note Approved",
                    description: "The note has been successfully approved and is now public."
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
            const res = await fetch(`/api/admin/reject-note`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId }),
            });
            if (res.ok) {
                toaster.success({
                    title: "Note Rejected",
                    description: "The note has been rejected and will not be made public."
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