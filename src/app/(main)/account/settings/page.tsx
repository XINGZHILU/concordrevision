import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserSettingsForm from "@/lib/customui/Account/UserSettingsForm";

/**
 * Account settings page - allows users to edit their profile information
 */
export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  // Get user data from database
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      year: true,
      email: true,
    }
  });

  if (!dbUser) {
    notFound();
  }

  // Combine Clerk user data with database user data
  const userData = {
    id: dbUser.id,
    firstname: dbUser.firstname || user.firstName || '',
    lastname: dbUser.lastname || user.lastName || '',
    email: dbUser.email,
    year: dbUser.year,
  };

  return <UserSettingsForm user={userData} />;
}
