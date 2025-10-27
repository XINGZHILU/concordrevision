import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import UploadManager from "@/lib/customui/Account/UploadManager";

/**
 * Account uploads page - allows users to manage all their uploads
 */
export default async function UploadsPage() {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  return <UploadManager userId={user.id} />;
}
