/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SearchableOlympiadContent from "@/lib/customui/Olympiads/SearchableOlympiadContent";

// eslint-disable-next-line @typescript-eslint/no-unused-vars 
export default async function Page(req: any, res: any) {
  const params = await req.params;
  const oid = params.oid;

  const olympiad = await prisma.olympiad.findUnique({
    where: {
      id: +oid
    },
    include: {
      resources: true,
    },
    orderBy: {
      resources: {
        uploadedAt: 'desc'
      }
    }
  });

  if (!olympiad) {
    notFound();
  }

  const resources = olympiad.resources.filter((resource) => { return resource.approved });

  return (
    <SearchableOlympiadContent
      olympiad={olympiad}
      resources={resources}
    />
  );
}