'use client';

// File: app/admin/users/[id]/user-actions.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toaster } from "@/components/ui/toaster";
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

interface UserActionsProps {
    userId: string;
    uploadPermission: boolean;
    isTeacher: boolean;
}

export default function UserActions({ userId, uploadPermission, isTeacher }: UserActionsProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const toggleUploadPermission = async () => {
        setIsUpdating(true);

        try {
            const response = await fetch(`/api/admin/users/${userId}/toggle-upload-permission`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    upload_permission: !uploadPermission,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user permission');
            }

            toaster.success({
                title: "Success",
                description: `Upload permission ${uploadPermission ? 'revoked' : 'granted'} successfully`
            });

            // Refresh the page to show updated data
            setTimeout(() => {
                router.refresh();
            }, 1000);
        } catch (error) {
            console.error('Error updating user permission:', error);
            toaster.error({
                title: "Error",
                description: "Failed to update user permission"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const toggleTeacherStatus = async () => {
        setIsUpdating(true);

        try {
            const response = await fetch(`/api/admin/users/${userId}/toggle-teacher-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teacher: !isTeacher,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user role');
            }

            toaster.success({
                title: "Success",
                description: `User role updated to ${isTeacher ? 'Student' : 'Teacher'} successfully`
            });

            // Refresh the page to show updated data
            setTimeout(() => {
                router.refresh();
            }, 1000);
        } catch (error) {
            console.error('Error updating user role:', error);
            toaster.error({
                title: "Error",
                description: "Failed to update user role"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={uploadPermission ? "destructive" : "default"} disabled={isUpdating}>
                            {uploadPermission ? 'Revoke Upload Permission' : 'Grant Upload Permission'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {uploadPermission ? 'Revoke Upload Permission' : 'Grant Upload Permission'}
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Are you sure you want to {uploadPermission ? 'revoke' : 'grant'} upload permission for this user?
                            {uploadPermission
                                ? ' They will no longer be able to upload new resources.'
                                : ' They will be able to upload new notes, resources, and materials.'
                            }
                        </DialogDescription>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button
                                onClick={toggleUploadPermission}
                                disabled={isUpdating}
                                variant={uploadPermission ? "destructive" : "default"}
                            >
                                {isUpdating ? 'Updating...' : 'Confirm'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={isTeacher ? "secondary" : "default"} disabled={isUpdating}>
                             {isTeacher ? 'Convert to Student' : 'Convert to Teacher'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {isTeacher ? 'Convert to Student' : 'Convert to Teacher'}
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Are you sure you want to change this user&apos;s role from {isTeacher ? 'Teacher' : 'Student'} to {isTeacher ? 'Student' : 'Teacher'}?
                            This may affect their access to certain features.
                        </DialogDescription>
                        <DialogFooter>
                             <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button
                                onClick={toggleTeacherStatus}
                                disabled={isUpdating}
                                variant={isTeacher ? "destructive" : "default"}
                            >
                                {isUpdating ? 'Updating...' : 'Confirm'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}