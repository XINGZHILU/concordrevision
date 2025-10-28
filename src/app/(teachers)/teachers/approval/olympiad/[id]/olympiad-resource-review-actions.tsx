// File: src/app/(teachers)/teachers/approval/olympiad/[id]/olympiad-resource-review-actions.tsx

'use client';

import { Button } from "@/lib/components/ui/button";
import { useRouter } from "next/navigation";
import { toaster } from "@/lib/components/ui/toaster";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose
} from "@/lib/components/ui/dialog";
import { useState } from "react";

export function OlympiadResourceReviewActions({ resourceId }: { resourceId: number }) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const router = useRouter();
    const isSubmitting = isApproving || isRejecting;

    async function handleApprove() {
        setIsApproving(true);
        try {
            const res = await fetch(`/api/admin/approve-olympiad-resource`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceId }),
            });
            if (res.ok) {
                toaster.success({
                    title: "Resource Approved",
                    description: "The resource is now public."
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
            const res = await fetch(`/api/admin/reject-olympiad-resource`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resourceId }),
            });
            if (res.ok) {
                toaster.success({
                    title: "Resource Rejected",
                    description: "The resource has been rejected."
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
        <div className="flex justify-end space-x-2 p-4 bg-background border-t">
            <Dialog>
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
                        Are you sure you want to reject this resource? This action cannot be undone.
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
            <Button onClick={handleApprove} disabled={isSubmitting}>
                {isApproving ? "Approving..." : "Approve"}
            </Button>
        </div>
    );
} 