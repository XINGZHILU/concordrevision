// File: app/admin/page.tsx

import React from 'react';
import Link from 'next/link';
import { prisma } from "@/lib/prisma";
import { LuUsers, LuBook, LuCog, LuMedal, LuSchool, LuHouse, LuFileCheck, LuLibrary, LuUserCheck } from "react-icons/lu";

// Admin dashboard card component
function AdminCard({ title, description, icon, href, count, variant = "primary" }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  count?: number;
  variant?: "primary" | "secondary" | "warning" | "success";
}) {
  // Define color variants
  const variants = {
    primary: "bg-primary/10 border-primary/20 text-primary",
    secondary: "bg-secondary/10 border-secondary/20 text-secondary-foreground",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    success: "bg-green-500/10 border-green-500/20 text-green-500"
  };

  const colorClass = variants[variant];

  return (
    <Link href={href} className="block group">
      <div className={`border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colorClass}`}>
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-full bg-background/80">
            {icon}
          </div>
          {count !== undefined && (
            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-background text-foreground">
              {count}
            </span>
          )}
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm opacity-80">{description}</p>
      </div>
    </Link>
  );
}

export default async function AdminHomePage() {

  // Fetch some stats for the dashboard
  const unapprovedNotesCount = await prisma.note.count({
    where: {
      approved: false,
    },
  });

  const olympiadResourcesCount = await prisma.olympiad_Resource.count();

  const unapprovedOlympiadResourcesCount = await prisma.olympiad_Resource.count({
    where: {
      approved: false,
    },
  });

  const totalNotesCount = await prisma.note.count();
  const totalResourcesCount = totalNotesCount - unapprovedNotesCount + olympiadResourcesCount - unapprovedOlympiadResourcesCount;

  const unapprovedCount = unapprovedNotesCount + unapprovedOlympiadResourcesCount;

  const totalSubjectsCount = await prisma.subject.count();

  const totalUsersCount = await prisma.user.count();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-lg text-muted-foreground">
          Manage content, users, and system settings
        </p>
      </div>

      {/* Quick stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Pending Approvals</h2>
              <p className="text-3xl font-bold text-foreground">{unapprovedCount}</p>
            </div>
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <LuFileCheck className="h-8 w-8" />
            </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6 flex items-center justify-between">
            <div>
                <h2 className="text-sm font-medium text-muted-foreground">Total Resources</h2>
                <p className="text-3xl font-bold text-foreground">{totalResourcesCount}</p>
            </div>
            <div className="p-4 rounded-full bg-success/10 text-success">
                <LuLibrary className="h-8 w-8" />
            </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Subjects</h2>
              <p className="text-3xl font-bold text-foreground">{totalSubjectsCount}</p>
            </div>
            <div className="p-4 rounded-full bg-secondary/10 text-secondary-foreground">
              <LuBook className="h-8 w-8" />
            </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Users</h2>
              <p className="text-3xl font-bold text-foreground">{totalUsersCount}</p>
            </div>
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <LuUsers className="h-8 w-8" />
            </div>
        </div>
      </div>

      {/* Admin functions */}
      <h2 className="text-xl font-bold text-foreground mb-4">Admin Functions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        <AdminCard
          title="User Management"
          description="Manage user accounts and permissions"
          icon={<LuUserCheck className="h-8 w-8" />}
          href="/admin/users"
          variant="secondary"
        />

        <AdminCard
          title="Subject Management"
          description="Add, edit, or remove subjects and categories"
          icon={<LuBook className="h-8 w-8" />}
          href="/admin/subjects"
          variant="success"
        />

        <AdminCard
          title="System Settings"
          description="Configure system-wide settings and preferences"
          icon={<LuCog className="h-8 w-8" />}
          href="/admin/settings"
          variant="secondary"
        />

        <AdminCard
          title="Olympiad Management"
          description="Manage olympiad resources and categories"
          icon={<LuMedal className="h-8 w-8" />}
          href="/admin/olympiads"
          variant="primary"
        />
        <AdminCard
          title="University and Courses Management"
          description="Add, edit, or remove universities and courses"
          icon={<LuSchool className="h-8 w-8" />}
          href="/admin/ucas"
          variant={"primary"}
        />
        <AdminCard
          title="Return to Site"
          description="Go back to the main student portal"
          icon={<LuHouse className="h-8 w-8" />}
          href="/"
          variant="success"
        />



      </div>

      {/* Recent activity section - could be implemented later */}
      {/*
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <p className="text-gray-600 text-center py-4">
                        Recent activity tracking will be implemented in a future update.
                    </p>
                </div>
            </div>
            */}
    </div>
  );
}