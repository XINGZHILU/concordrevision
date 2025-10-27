import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LuUpload, LuUser, LuCalendar, LuMail, LuUsers, LuSettings } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Account home page with user profile and quick actions
 */
export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const quickActions = [
    {
      title: "Manage Uploads",
      description: "View and edit all your uploaded content",
      href: "/account/uploads",
      icon: LuUpload,
      color: "text-primary",
    },
    {
      title: "Upload New Content",
      description: "Add new revision notes, olympiad resources, or UCAS posts",
      href: "/upload",
      icon: LuUpload,
      color: "text-success",
    },
    {
      title: "Manage Subscriptions",
      description: "Subscribe to subjects and manage notification preferences",
      href: "/account/subscriptions",
      icon: LuUsers,
      color: "text-primary",
    },
    {
      title: "Account Settings",
      description: "Update your name, year group, and other preferences",
      href: "/account/settings",
      icon: LuSettings,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="p-8">
      {/* Profile Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <LuUser className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <LuMail className="w-4 h-4" />
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <LuCalendar className="w-4 h-4" />
              Member since
            </div>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <LuUser className="w-4 h-4" />
              Account Status
            </div>
            <p className="font-medium text-success">Active</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className={cn("mt-1", action.color)}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center py-8">
            <LuCalendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Recent activity will appear here
            </p>
            <Link href="/account/uploads">
              <Button variant="outline">
                View My Uploads
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
