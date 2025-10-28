import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/lib/components/ui/alert-dialog';
import { LuTriangle, LuInfo } from "react-icons/lu";

export function MaxSizeAlert() {
    return <AlertDialog>
        <AlertDialogTrigger>
            <div className="flex items-center space-x-2">
                <LuTriangle className="h-4 w-4 text-destructive" />
                <p>Uploaded files must be less than 2GB in size.</p>
            </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>File Size Limit</AlertDialogTitle>
                <AlertDialogDescription>
                    Uploaded files must be less than 2GB in size.
                </AlertDialogDescription>
            </AlertDialogHeader>
        </AlertDialogContent>
    </AlertDialog>;
}

export function UploadInfo() {
    return <AlertDialog>
        <AlertDialogTrigger>
            <div className="flex items-center space-x-2">
                <LuInfo className="h-4 w-4" />
                <p>Upload guidelines</p>
            </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Upload guidelines</AlertDialogTitle>
                <AlertDialogDescription>
                    <p>Uploaded files must be less than <b>2GB</b> in size.</p>
                    <p>Click <a href={'https://www.markdownguide.org/basic-syntax/'} target="_blank"
                        rel="noopener noreferrer"><b>here</b></a> for how to format your post</p>
                </AlertDialogDescription>
            </AlertDialogHeader>
        </AlertDialogContent>
    </AlertDialog>;
}