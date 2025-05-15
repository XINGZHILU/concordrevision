'use client';

// File: app/admin/users/[id]/user-actions.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toaster, Toaster } from "@/components/ui/toaster";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";

interface UserActionsProps {
    userId: string;
    uploadPermission: boolean;
    isTeacher: boolean;
}

export default function UserActions({ userId, uploadPermission, isTeacher }: UserActionsProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'upload' | 'teacher' | null>(null);
    const router = useRouter();

    // Open confirmation dialog
    const openDialog = (action: 'upload' | 'teacher') => {
        setDialogAction(action);
        setIsDialogOpen(true);
    };

    // Close dialog
    const closeDialog = () => {
        setIsDialogOpen(false);
        setDialogAction(null);
    };

    // Toggle upload permission
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
            closeDialog();
        }
    };

    // Toggle teacher status
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
            closeDialog();
        }
    };

    const handleConfirmAction = () => {
        if (dialogAction === 'upload') {
            toggleUploadPermission();
        } else if (dialogAction === 'teacher') {
            toggleTeacherStatus();
        }
    };

    return (
        <div>
            <Toaster />

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => openDialog('upload')}
                    className={`px-4 py-2 rounded-md text-white ${uploadPermission
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isUpdating}
                >
                    {uploadPermission ? 'Revoke Upload Permission' : 'Grant Upload Permission'}
                </button>

                <button
                    onClick={() => openDialog('teacher')}
                    className={`px-4 py-2 rounded-md text-white ${isTeacher
                            ? 'bg-gray-600 hover:bg-gray-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isUpdating}
                >
                    {isTeacher ? 'Convert to Student' : 'Convert to Teacher'}
                </button>
            </div>

            {/* @ts-ignore */}
            <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialogAction === 'upload'
                                ? (uploadPermission ? 'Revoke Upload Permission' : 'Grant Upload Permission')
                                : (isTeacher ? 'Convert to Student' : 'Convert to Teacher')
                            }
                        </DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        {dialogAction === 'upload' && (
                            <p>
                                Are you sure you want to {uploadPermission ? 'revoke' : 'grant'} upload permission for this user?
                                {uploadPermission
                                    ? ' They will no longer be able to upload new resources.'
                                    : ' They will be able to upload new notes, resources, and materials.'
                                }
                            </p>
                        )}

                        {dialogAction === 'teacher' && (
                            <p>
                                Are you sure you want to change this user&#39;s role from {isTeacher ? 'Teacher' : 'Student'} to {isTeacher ? 'Student' : 'Teacher'}?
                                This may affect their access to certain features.
                            </p>
                        )}
                    </DialogBody>
                    <DialogFooter>
                        <button
                            onClick={closeDialog}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors mr-2"
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmAction}
                            className={`px-4 py-2 text-white rounded transition-colors ${dialogAction === 'upload'
                                    ? (uploadPermission ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700')
                                    : (isTeacher ? 'bg-gray-600 hover:bg-gray-700' : 'bg-indigo-600 hover:bg-indigo-700')
                                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Confirm'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </div>
    );
}