/* eslint-disable @typescript-eslint/no-unused-vars */


import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { isNumeric } from "@/lib/utils";
import FileList from "@/lib/customui/Basic/filelist";
import MDViewer from "@/lib/customui/Basic/showMD";
import Link from "next/link";
import { LuArrowLeft, LuFileText, LuFile, LuExternalLink, LuPencil } from "react-icons/lu";
import { currentUser } from "@clerk/nextjs/server";
import { PinButton } from "@/app/(main)/olympiads/[oid]/resources/[rid]/PinButton";

export default async function Page({ params }: { params: { oid: string, rid: string } }) {
  const page_params = await params;
  const oid = page_params.oid;
  const rid = page_params.rid;

  if (!isNumeric(oid) || !isNumeric(rid)) {
    notFound();
  }

  const olympiad = await prisma.olympiad.findUnique({
    where: {
      id: +oid
    }
  });

  if (!olympiad) {
    notFound();
  }

  const resource = await prisma.olympiad_Resource.findUnique({
    where: {
      id: +rid
    },
    include: {
      files: true,
      author: {
        select: {
          id: true,
          firstname: true,
          lastname: true
        }
      }
    }
  });

  if (!resource) {
    notFound();
  }

  // Get current user to check authorization for pending resources
  const user = await currentUser();
  const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;

  // If resource is not approved, only allow access to author or admin
  if (!resource.approved) {
    if (!user || (resource.authorId !== user.id && !dbUser?.admin)) {
      notFound();
    }
  }

  const resourceType = getResourceTypeLabel(resource.type);
  const authorName = resource.author.firstname && resource.author.lastname
    ? `${resource.author.firstname} ${resource.author.lastname}`
    : "Anonymous";
  const isAdmin = dbUser?.admin ?? false;
  const canEdit = user && (resource.author.id === user.id || isAdmin);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/olympiads/${olympiad.id}`}
          className="flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <LuArrowLeft className="mr-2" />
          <span>Back to {olympiad.title}</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8 border-b pb-4">
        <div className="flex flex-wrap items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {resource.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {resourceType}
            </span>
            {canEdit && (
              <Link href={`olympiads/${oid}/resources/${rid}/edit`} className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                <LuPencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            )}
            {isAdmin && <PinButton resourceId={resource.id} initialPinned={resource.pinned} />}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{olympiad.title}</span>
          <span>•</span>
          <span>{olympiad.area}</span>
          <span>•</span>
          <span>Contributed by {authorName}</span>
        </div>
      </div>

      {/* Two-column layout */}
      {/* Conditional layout based on whether there are files */}
      {resource.files.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content - larger proportion */}
          <div className="flex-grow md:w-3/4">
            <div className="rounded-lg shadow-md border border-border p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-5 text-primary border-b pb-3 border-border">Olympiad Resource Content</h2>
              <div className="prose prose-lg max-w-none text-foreground">
                <MDViewer content={resource.desc} />
              </div>
            </div>
          </div>

          {/* Sidebar for files - only shown when there are files */}
          <div className="md:w-1/4">
            <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <LuFileText className="mr-2" />
                Attachments
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({resource.files.length})
                </span>
              </h2>
              <FileList files={resource.files} />
            </div>
          </div>
        </div>
      ) : (
        /* Full width content when no files */
        <div className="w-full">
          <div className=" rounded-lg shadow-md border border-border p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-5 text-primary border-b pb-3 border-border">Olympiad Resource Content</h2>
            <div className="prose prose-lg max-w-none text-foreground">
              <MDViewer content={resource.desc} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getResourceTypeLabel(type: number): string {
  switch (type) {
    case 0: return "Past Paper";
    case 1: return "Solution";
    case 2: return "Other";
    default: return "Resource";
  }
}