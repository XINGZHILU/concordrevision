'use client';

import { useState } from 'react';
import { Button } from "@/lib/components/ui/button";
import { Pin, PinOff } from 'lucide-react';
import { toaster } from "@/lib/components/ui/toaster";

export function PinButton({ resourceId, initialPinned }: { resourceId: number, initialPinned: boolean }) {
  const [pinned, setPinned] = useState(initialPinned);

  async function handleTogglePin() {
    const response = await fetch(`/api/admin/olympiads/resources/${resourceId}/toggle-pin`, {
      method: 'PUT',
    });

    if (response.ok) {
      const updatedResource = await response.json();
      setPinned(updatedResource.pinned);
      toaster.success({
        title: updatedResource.pinned ? "Resource Pinned" : "Resource Unpinned",
        description: `The resource has been ${updatedResource.pinned ? 'pinned' : 'unpinned'}.`,
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