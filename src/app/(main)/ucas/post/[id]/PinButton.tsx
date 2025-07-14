'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pin, PinOff } from 'lucide-react';
import { toaster } from '@/components/ui/toaster';

export function PinButton({ postId, initialPinned }: { postId: number, initialPinned: boolean }) {
  const [pinned, setPinned] = useState(initialPinned);

  async function handleTogglePin() {
    const response = await fetch(`/api/admin/ucas/posts/${postId}/toggle-pin`, {
      method: 'PUT',
    });

    if (response.ok) {
      const updatedPost = await response.json();
      setPinned(updatedPost.pinned);
      toaster.success({
        title: updatedPost.pinned ? "Post Pinned" : "Post Unpinned",
        description: `The post has been ${updatedPost.pinned ? 'pinned' : 'unpinned'}.`,
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