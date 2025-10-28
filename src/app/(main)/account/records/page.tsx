import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import PastPaperRecordManager from "@/lib/customui/Account/PastPaperRecordManager";

/**
 * Account past paper records page - allows users to manage all their past paper records
 */
export default async function RecordsPage() {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  return <PastPaperRecordManager userId={user.id} />;
}

