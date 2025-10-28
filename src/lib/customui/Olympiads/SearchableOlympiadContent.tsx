'use client';

import { useState, useMemo } from 'react';
import { OlympiadResourceCard } from '@/lib/customui/Basic/cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuSearch, LuX, LuExternalLink, LuFileText, LuInfo } from "react-icons/lu";
import MDViewer from "@/lib/customui/Basic/showMD";

interface OlympiadResource {
  id: number;
  title: string;
  desc: string;
  olympiadId: number;
  type: number;
  approved: boolean;
  uploadedAt: Date;
  authorId: string;
  pinned: boolean;
  author: {
    id: string;
    email: string;
    firstname: string | null;
    lastname: string | null;
    teacher: boolean;
    admin: boolean;
    upload_permission: boolean;
    year: number;
  };
}

interface Olympiad {
  id: number;
  title: string;
  area: string;
  desc: string;
  links: string[];
  link_descriptions: string[];
}

interface User {
  id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  teacher: boolean;
  admin: boolean;
  upload_permission: boolean;
  year: number;
}

interface SearchableOlympiadContentProps {
  olympiad: Olympiad;
  resources: OlympiadResource[];
  user: User;
}

/**
 * Client component that displays olympiad details with tabs for About and Resources
 * Provides search functionality for resources and external links
 */
const SearchableOlympiadContent = ({
  olympiad,
  resources,
  user
}: SearchableOlympiadContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('about');

  /**
   * Get resource type label
   */
  const getResourceTypeLabel = (type: number) => {
    if (type == -1) return "Resource";
    return "Resource";
  };

  /**
   * Filter resources based on search query
   */
  const filteredResources = useMemo(() => {
    if (!searchQuery.trim()) return resources;

    const lowerQuery = searchQuery.toLowerCase();
    return resources.filter(resource =>
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.desc.toLowerCase().includes(lowerQuery) ||
      getResourceTypeLabel(resource.type).toLowerCase().includes(lowerQuery)
    );
  }, [resources, searchQuery]);

  /**
   * Filter external links based on search query
   */
  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) {
      return olympiad.links.map((link, index) => ({
        link,
        description: olympiad.link_descriptions && olympiad.link_descriptions[index]
          ? olympiad.link_descriptions[index]
          : 'No description available',
        index
      }));
    }

    const lowerQuery = searchQuery.toLowerCase();
    return olympiad.links
      .map((link, index) => ({
        link,
        description: olympiad.link_descriptions && olympiad.link_descriptions[index]
          ? olympiad.link_descriptions[index]
          : 'No description available',
        index
      }))
      .filter(item =>
        item.link.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      );
  }, [olympiad.links, olympiad.link_descriptions, searchQuery]);

  /**
   * Clear search input
   */
  const clearSearch = () => {
    setSearchQuery('');
  };

  /**
   * Calculate total resources count (uploaded resources + external links)
   */
  const totalResourcesCount = resources.length + olympiad.links.length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2">{olympiad.title}</h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {olympiad.area}
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="about" className="flex items-center gap-2">
            <LuInfo className="h-4 w-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <LuFileText className="h-4 w-4" />
            Resources
            {totalResourcesCount > 0 && (
              <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {totalResourcesCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="mt-0">
          <div className="prose dark:prose-invert max-w-none">
            <MDViewer content={olympiad.desc} />
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-0">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources and links..."
                className="block w-full pl-9 pr-8 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <LuX className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-muted-foreground">
                Searching for: <span className="font-medium">&quot;{searchQuery}&quot;</span>
              </p>
            )}
          </div>

          {/* External Links Section */}
          <div className="mb-8">
            <h2 className="flex items-center mb-4">
              <LuExternalLink className="h-5 w-5 mr-2" />
              External Links
              {filteredLinks.length > 0 && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {filteredLinks.length}
                </span>
              )}
            </h2>

            {filteredLinks.length === 0 ? (
              searchQuery ? (
                <div className="text-center py-6 bg-muted rounded-lg">
                  <p className="text-muted-foreground">No external links found for &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                <div className="text-center py-6 bg-muted rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background mb-3">
                    <LuExternalLink className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No external links available</p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLinks.map((item) => (
                  <a
                    key={item.index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-card rounded-lg border border-border p-4 hover:border-primary hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors duration-200 mb-2">
                          {item.description}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200">
                          <LuExternalLink className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {item.link.replace(/^https?:\/\//, '')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 group-hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors duration-200">
                          <LuExternalLink className="h-4 w-4 text-primary group-hover:text-primary/90 transition-colors duration-200" />
                        </div>
                      </div>
                    </div>

                    {/* Subtle animation line */}
                    <div className="mt-3 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transform transition-transform duration-300 origin-left rounded-full"></div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Uploaded Resources Section */}
          <div>
            <h2 className="flex items-center mb-4">
              <LuFileText className="h-5 w-5 mr-2" />
              Uploaded Resources
              {filteredResources.length > 0 && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {filteredResources.length}
                </span>
              )}
            </h2>

            {filteredResources.length === 0 ? (
              searchQuery ? (
                <div className="text-center py-8 bg-muted rounded-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
                    <LuFileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">No resources found</h3>
                  <p className="text-muted-foreground">No resources found for &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                <div className="text-center py-8 bg-muted rounded-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
                    <LuFileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">No resources available</h3>
                  <p className="text-muted-foreground">This olympiad doesn&apos;t have any uploaded resources yet.</p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="relative">
                    <OlympiadResourceCard resource={resource} canEdit={user.admin || (resource.authorId == user.id)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchableOlympiadContent; 