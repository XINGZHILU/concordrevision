'use client';

import React from 'react';
import Link from 'next/link';
import {
  LuArrowUpRight,
  LuLandmark,
  LuUniversity
} from "react-icons/lu";

export function UniversityCard({ university }: {
  university: {
    id: string,
    name: string,
  }
}) {
  return (
    <div className="p-3">
      <Link href={`/ucas/schools/${university.id}`} className="block h-full">
        <div
          className="group relative h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          {/* Trophy decoration - top right */}
          <div className="absolute top-4 right-4 opacity-10">
            <LuUniversity className="h-24 w-24 text-muted-foreground" />
          </div>

          {/* Card content */}
          <div className="relative z-10 p-6">
            {/* Title and icon */}
            <div className="mt-3 flex items-start">
              <div className="mr-3 p-2 rounded-full bg-muted">
                <LuLandmark className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary">
                {university.name}
              </h3>
            </div>
            <br />

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
              <span className="inline-flex items-center text-accent-foreground font-medium text-sm">
                Explore
                <LuArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-[-0.25rem]" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function UCASSubjectCard({ ucasSubject }: {
  ucasSubject: {
    id: string,
    name: string,
  }
}) {
  return (
    <div className="p-3">
      <Link href={`/ucas/subjects/${ucasSubject.id}`} className="block h-full">
        <div
          className="group relative h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          {/* Trophy decoration - top right */}
          <div className="absolute top-4 right-4 opacity-10">
            <LuUniversity className="h-24 w-24 text-muted-foreground" />
          </div>

          {/* Card content */}
          <div className="relative z-10 p-6">
            {/* Title and icon */}
            <div className="mt-3 flex items-start">
              <div className="mr-3 p-2 rounded-full bg-muted">
                <LuLandmark className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary">
                {ucasSubject.name}
              </h3>
            </div>
            <br />

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
              <span className="inline-flex items-center text-accent-foreground font-medium text-sm">
                Explore
                <LuArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-[-0.25rem]" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}