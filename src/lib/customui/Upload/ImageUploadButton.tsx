'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { upload_image } from "@/lib/customui/Upload/upload_image";

export function ImageUploadButton({ onImageUploaded }: { onImageUploaded: (url: string) => void }) {
    const { toast } = useToast();

    const handleImageUpload = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                toast({ title: "Uploading Image", description: "Please wait..." });
                try {
                    const result = await upload_image(file);
                    onImageUploaded(result.url);
                    toast({ title: "Success", description: "Image uploaded successfully." });
                } catch (error) {
                    console.error("Image upload failed:", error);
                    toast({ title: "Error", description: "Image upload failed.", variant: "destructive" });
                }
            }
        };
        fileInput.click();
    };

    return (
        <Button type="button" variant="outline" onClick={handleImageUpload}>
            Upload Image
        </Button>
    );
} 