'use client';

import { Badge } from "@/lib/components/ui/badge";
import Link from 'next/link';
import FileList from "@/lib/customui/Basic/filelist";
import { Accordion } from "@chakra-ui/react";

interface PostSidebarProps {
  tags: string[];
  universities: { id: string; name: string; }[];
  ucasSubjects: { id: string; name: string; }[];
  files: { id: number; filename: string; path: string; type: string; }[];
}

/**
 * Sidebar component for UCAS post detail page with collapsible sections
 * Uses Chakra UI Accordion for collapsible functionality
 */
export function PostSidebar({ tags, universities, ucasSubjects, files }: PostSidebarProps) {
  return (
    <aside className="md:col-span-1 md:border-l md:pl-8 py-8">
      <Accordion.Root 
        defaultValue={['tags', 'universities', 'subjects', 'attachments']} 
        multiple
        collapsible
      >
        {/* Tags Section */}
        <Accordion.Item value="tags">
          <Accordion.ItemTrigger className="w-full py-4 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg px-2">
            <h2 className="text-2xl font-bold">Tags</h2>
            <Accordion.ItemIndicator className="transition-transform duration-200">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent className="pb-4 px-2">
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tags added</p>
            )}
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Universities Section */}
        <Accordion.Item value="universities">
          <Accordion.ItemTrigger className="w-full py-4 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg px-2">
            <h2 className="text-2xl font-bold">Related Universities</h2>
            <Accordion.ItemIndicator className="transition-transform duration-200">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent className="pb-4 px-2">
            {universities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {universities.map(uni => (
                  <Link key={uni.id} href={`/ucas/schools/${uni.id}`}>
                    <Badge className="hover:bg-primary/90 cursor-pointer">{uni.name}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No universities tagged</p>
            )}
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* UCAS Subjects Section */}
        <Accordion.Item value="subjects">
          <Accordion.ItemTrigger className="w-full py-4 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg px-2">
            <h2 className="text-2xl font-bold">Related UCAS Subjects</h2>
            <Accordion.ItemIndicator className="transition-transform duration-200">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent className="pb-4 px-2">
            {ucasSubjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ucasSubjects.map(subject => (
                  <Link key={subject.id} href={`/ucas/subjects/${subject.id}`}>
                    <Badge className="hover:bg-primary/90 cursor-pointer">{subject.name}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No UCAS subjects tagged</p>
            )}
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Attachments Section */}
        <Accordion.Item value="attachments">
          <Accordion.ItemTrigger className="w-full py-4 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg px-2">
            <h2 className="text-2xl font-bold">Attachments</h2>
            <Accordion.ItemIndicator className="transition-transform duration-200">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent className="pb-4 px-2">
            {files.length > 0 ? (
              <FileList files={files} />
            ) : (
              <p className="text-muted-foreground">No files attached</p>
            )}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </aside>
  );
}

