'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toaster, Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { put } from '@vercel/blob';

export async function upload_image(file: File) {
  const blob = await put(file.name, file, {
    access: 'public',
  });
  return blob;
}

interface StoredImage {
  name: string;
  url: string;
}

/**
 * A component for uploading images to Supabase storage and selecting existing ones.
 * @param onUploadFinished Callback function executed with the public URL of the uploaded image.
 * @returns A JSX element containing the image upload and selection UI.
 */
export function ImageUploader({ onUploadFinished }: { onUploadFinished: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageList, setImageList] = useState<StoredImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const supabase = createClient();
  const SESSION_STORAGE_KEY = 'session-uploaded-images';


  useEffect(() => {
    setIsLoadingImages(true);
    try {
      const storedImages = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedImages) {
        setImageList(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error('Could not parse images from sessionStorage', error);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setIsLoadingImages(false);
  }, []);

  /**
   * Handles changes to the file input element.
   * @param e The change event from the file input.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        toaster.error({
          title: 'Invalid file type',
          description: 'Please select an image file.',
        });
        setFile(null);
        if (e.target) {
          e.target.value = ''; // Reset file input
        }
        return;
      }
      setFile(selectedFile);
    }
  };

  /**
   * Handles the file upload to Supabase storage.
   */
  const handleUpload = async () => {
    if (!file) {
      toaster.error({
        title: 'No file selected',
        description: 'Please select an image to upload.',
      });
      return;
    }

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `public/${fileName}`;

    const { error } = await supabase.storage.from('images').upload(filePath, file);

    if (error) {
      toaster.error({
        title: 'Upload failed',
        description: error.message,
      });
      console.error('Error uploading file:', error);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);

    if (data) {
      toaster.success({
        title: 'Upload successful',
        description: 'Image has been uploaded.',
      });
      const newImage = { name: fileName, url: data.publicUrl };
      const updatedImageList = [...imageList, newImage];
      setImageList(updatedImageList);
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedImageList));
      onUploadFinished(data.publicUrl);
    }

    setFile(null);
    setUploading(false);
  };

  return (
    <>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload New</TabsTrigger>
          <TabsTrigger value="select">Select Existing</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <div className="flex flex-col gap-4 p-4">
            <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            <Button onClick={handleUpload} disabled={uploading || !file} size="lg">
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="select">
          <div className="p-4">
            {isLoadingImages ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {imageList.length > 0 ? (
                  imageList.map(image => (
                    <div key={image.name} className="relative aspect-square group">
                      <Image
                        src={image.url}
                        alt={image.name}
                        className="object-cover w-full h-full rounded-md cursor-pointer transition-transform group-hover:scale-105"
                        onClick={() => onUploadFinished(image.url)}
                        loading="lazy"
                        width={150}
                        height={150}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onUploadFinished(image.url)}>
                        <p className="text-white text-xs text-center p-1">Select</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground">No images found.</p>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <Toaster />
    </>
  );
}
