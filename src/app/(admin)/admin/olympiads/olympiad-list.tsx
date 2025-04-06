'use client';

// File: app/admin/olympiads/olympiad-list.tsx

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { olympiad_subjects } from "@/lib/consts";

// Define olympiad type with resources count
type OlympiadWithCount = {
  id: number;
  title: string;
  desc: string;
  area: string;
  links: string[];
  _count: {
    resources: number;
  };
};

interface OlympiadListProps {
  olympiads: OlympiadWithCount[];
}

export default function OlympiadList({ olympiads }: OlympiadListProps) {
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string | 'all'>('all');
  const [deleteOlympiadId, setDeleteOlympiadId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get unique areas for filtering
  const uniqueAreas = useMemo(() => {
    return olympiad_subjects;
  }, []);

  // Filter olympiads based on search and area
  const filteredOlympiads = useMemo(() => {
    return olympiads.filter(olympiad => {
      const matchesSearch = olympiad.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           olympiad.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = selectedArea === 'all' || olympiad.area === selectedArea;
      return matchesSearch && matchesArea;
    });
  }, [olympiads, searchTerm, selectedArea]);

  // Open delete confirmation dialog
  const openDeleteDialog = (olympiadId: number) => {
    setDeleteOlympiadId(olympiadId);
    setIsDeleteDialogOpen(true);
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteOlympiadId(null);
  };

  // Handle delete olympiad
  const handleDeleteOlympiad = async () => {
    if (!deleteOlympiadId) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/admin/olympiads/${deleteOlympiadId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete olympiad');
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting olympiad:', error);
      toaster.error({
        title: "Error",
        description: "Failed to delete olympiad. Please try again."
      });
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };

  // Get olympiad for current delete dialog
  const olympiadToDelete = useMemo(() => {
    if (!deleteOlympiadId) return null;
    return olympiads.find(olympiad => olympiad.id === deleteOlympiadId);
  }, [olympiads, deleteOlympiadId]);

  return (
    <div>
      <Toaster />
      {/* Search and Filter */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Olympiads
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="areaFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Area
            </label>
            <select
              id="areaFilter"
              value={selectedArea.toString()}
              onChange={(e) => setSelectedArea(e.target.value === 'all' ? 'all' : e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Areas</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Olympiads Count */}
      <h2 className="text-lg font-semibold mb-4">
        Olympiads ({filteredOlympiads.length})
        {filteredOlympiads.length !== olympiads.length && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Filtered from {olympiads.length} total)
          </span>
        )}
      </h2>
      
      {/* Olympiads List */}
      {filteredOlympiads.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          {olympiads.length === 0 ? (
            <>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No olympiads found</h3>
              <p className="mt-1 text-gray-500">Get started by adding your first olympiad.</p>
            </>
          ) : (
            <>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No matching olympiads</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Area
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resources
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOlympiads.map((olympiad) => (
                <tr key={olympiad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{olympiad.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge colorPalette="purple">
                      {olympiad.area}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">{olympiad.desc}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {olympiad._count.resources}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/olympiads/${olympiad.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      {/* 
                      <button
                        onClick={() => openDeleteDialog(olympiad.id)}
                        className={`text-red-600 hover:text-red-900 ${olympiad._count.resources > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={olympiad._count.resources > 0}
                      >
                        Delete
                      </button>
                      */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      {/* @ts-ignore */}
      <DialogRoot open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Olympiad</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {olympiadToDelete && (
              <>
                <p className="mb-2">
                  Are you sure you want to delete the olympiad <strong>{olympiadToDelete.title}</strong>?
                </p>
                {olympiadToDelete._count.resources > 0 ? (
                  <div className="bg-amber-50 text-amber-800 p-3 rounded border border-amber-200 text-sm">
                    <strong>Warning:</strong> This olympiad has {olympiadToDelete._count.resources} resources associated with it. 
                    Please reassign or delete these resources before deleting the olympiad.
                  </div>
                ) : (
                  <p className="text-gray-600">This action cannot be undone.</p>
                )}
              </>
            )}
          </DialogBody>
          <DialogFooter>
            <button
              onClick={closeDeleteDialog}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteOlympiad}
              className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors ${
                (olympiadToDelete && olympiadToDelete._count.resources > 0) || isDeleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={(olympiadToDelete && olympiadToDelete._count.resources > 0) || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}