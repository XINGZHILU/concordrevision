'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pin, PinOff } from 'lucide-react';
import { toaster } from '@/components/ui/toaster';

export function PinButton({ noteId, initialPinned }: { noteId: number, initialPinned: boolean }) {
  const [pinned, setPinned] = useState(initialPinned);

  async function handleTogglePin() {
    const response = await fetch(`/api/admin/notes/${noteId}/toggle-pin`, {
      method: 'PUT',
    });

    if (response.ok) {
      const updatedNote = await response.json();
      setPinned(updatedNote.pinned);
      toaster.success({
        title: updatedNote.pinned ? "Resource Pinned" : "Resource Unpinned",
        description: `The resource has been ${updatedNote.pinned ? 'pinned' : 'unpinned'}.`,
      });
    } else {
      const error = await response.json();
      toaster.error({ title: "Error", description: error.message });
    }
  }

  return (
    <Button
      onClick={handleTogglePin}
      variant={pinned ? "default" : "outline"}
      size="icon"
      className="ml-2"
      title={pinned ? "Click to unpin resource" : "Click to pin resource"}
    >
      {pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
    </Button>
  );
} 