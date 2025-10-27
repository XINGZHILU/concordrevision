import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LuUser, LuUpload, LuSettings, LuUsers } from "react-icons/lu";

/**
 * Layout for account pages with navigation sidebar
 */
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const navigationItems = [
    {
      name: "Profile",
      href: "/account",
      icon: LuUser,
      description: "Manage your profile information",
    },
    {
      name: "My Uploads",
      href: "/account/uploads",
      icon: LuUpload,
      description: "View and manage your uploads",
    },
    {
      name: "Subscriptions",
      href: "/account/subscriptions",
      icon: LuUsers,
      description: "Manage subject subscriptions",
    },
    {
      name: "Settings",
      href: "/account/settings",
      icon: LuSettings,
      description: "Account settings and preferences",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Account</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and uploads
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-muted group"
                >
                  <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  <div className="flex-1">
                    <div className="text-foreground group-hover:text-foreground">
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
