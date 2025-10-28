// File: app/admin/users/[id]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import UserActions from "@/app/(admin)/admin/users/[id]/user-actions";

export default async function UserDetailPage({ params }: { params: { id: string } }) {

  const userId = params.id;

  if (!userId) {
    notFound();
  }

  // Fetch user with contributions
  const userDetails = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      notes: {
        include: {
          subject: true,
        },
        orderBy: { id: 'desc' },
      },
      olympiad_resources: true
    },
  });

  if (!userDetails) {
    notFound();
  }

  // Categorize notes by year group
  /*
  const notesByYearGroup = userDetails.notes.reduce((acc, note) => {
    const yearGroup = note.subject.level;
    if (!acc[yearGroup]) {
      acc[yearGroup] = [];
    }
    acc[yearGroup].push(note);
    return acc;
  }, {} as Record<number, typeof userDetails.notes>);
  */

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Link
          href="/admin/users"
          className="px-4 py-2 bg-muted rounded hover:bg-accent transition-colors"
        >
          Back to Users
        </Link>
      </div>

      <div className="bg-card shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-xl font-bold text-foreground">{`${userDetails.firstname} ${userDetails.lastname}` || 'Anonymous User'}</h2>
              <p className="text-muted-foreground">{userDetails.email}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Badge variant={userDetails.teacher ? 'default' : 'secondary'}>
                {userDetails.teacher ? 'Teacher' : 'Student'}
              </Badge>
              <Badge variant={userDetails.upload_permission ? 'default' : 'destructive'}>
                {userDetails.upload_permission ? 'Upload Permission' : 'No Upload Permission'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">{userDetails.notes.length}</div>
              <div className="text-sm text-primary/80">Notes</div>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-500">{userDetails.olympiad_resources.length}</div>
              <div className="text-sm text-green-500/80">Olympiad Resources</div>
            </div>
          </div>

          <UserActions
            userId={userDetails.id}
            uploadPermission={userDetails.upload_permission}
            isTeacher={userDetails.teacher}
          />
        </div>
      </div>

      {/* User's contributions */}
      <div className="bg-card shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Recent Contributions</h3>

          {
            /*
            {userDetails.notes.length === 0 ? (
              <p className="text-muted-foreground">This user hasn&#39;t made any contributions yet.</p>
          ) : (
              <>
                  <div className="mb-4">
                      <p className="text-muted-foreground">Showing {userDetails.notes.length} most recent notes</p>
                  </div>

                  {Object.entries(notesByYearGroup).map(([yearGroupIndex, notes]) => (
                      <div key={yearGroupIndex} className="mb-6">
                          <h4 className="text-md font-semibold mb-2 text-foreground">
                              Year Group: {yearGroupIndex} ({notes.length} notes)
                          </h4>
                          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                              <table className="min-w-full">
                                  <thead>
                                      <tr>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border">
                                      {notes.map(note => (
                                          <tr key={note.id} className="hover:bg-accent">
                                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-foreground">{note.title}</td>
                                              <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">{note.subject.title}</td>
                                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                  <Badge variant={note.approved ? 'default' : 'secondary'}>
                                                      {note.approved ? 'Approved' : 'Pending'}
                                                  </Badge>
                                              </td>
                                              <td className="px-4 py-2 whitespace-nowrap text-sm text-primary">
                                                  {note.approved ? (
                                                      <Link href={`/revision/${note.subject.id}/resources/${note.id}`}>
                                                          View
                                                      </Link>
                                                  ) : (
                                                      <Link href={`/admin/approval/${note.id}`}>
                                                          Review
                                                      </Link>
                                                  )}
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  ))}
              </>
          )}
            */
          }
        </div>
      </div>
    </div>
  );
}