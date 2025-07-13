/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SearchableOlympiadContent from "@/lib/customui/Olympiads/SearchableOlympiadContent";
import { currentUser } from "@clerk/nextjs/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars 
export default async function Page(req: any, res: any) {
  const params = await req.params;
  const oid = params.oid;

  const user = await currentUser();
  if (!user){
    notFound();
  }

  const userRecord = await prisma.user.findUnique({
    where: {
      id : user.id
    }
  });

  if (!userRecord){
    notFound();
  }

  const olympiad = await prisma.olympiad.findUnique({
    where: {
      id: +oid
    },
    include: {
      resources: {
        include: {
          author: true
        },
        where: {
          approved: true
        },
        orderBy: [
          {
            pinned: 'desc'
          },
          {
            uploadedAt: 'desc'
          }
        ]
      }
    }
  });

  if (!olympiad) {
    notFound();
  }

  return (
    <SearchableOlympiadContent
      olympiad={olympiad}
      resources={olympiad.resources}
      user={userRecord}
    />
  );
}