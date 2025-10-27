import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import SubscriptionManager from "@/lib/customui/Account/SubscriptionManager";

/**
 * Account subscriptions page - allows users to manage all their subject subscriptions
 */
export default async function SubscriptionsPage() {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  return <SubscriptionManager userId={user.id} />;
}
