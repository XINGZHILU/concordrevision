'use client';

import { useState, useEffect, useMemo } from 'react';
import { UCASPost, Tag, University, UCASSubject } from '@prisma/client';
import { Input } from '@/lib/components/ui/input';
import { UCASPostList } from '@/lib/customui/UCAS/UCASPostList';
import { Pagination } from '@/lib/customui/UCAS/pagination';
import { Checkbox } from '@/lib/components/ui/checkbox';
import { Label } from '@/lib/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/lib/components/ui/radio-group';

type PostWithAuthor = UCASPost & { author: { firstname: string | null, lastname: string | null } };

export function PostList({ posts, tags, universities, ucasSubjects }: { 
  posts: PostWithAuthor[], 
  tags: Tag[], 
  universities: University[], 
  ucasSubjects: UCASSubject[] 
}) {
  const [displayedPosts, setDisplayedPosts] = useState<PostWithAuthor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [tagMatch, setTagMatch] = useState<'any' | 'all'>('any');
  
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [uniSearch, setUniSearch] = useState('');
  const [uniMatch, setUniMatch] = useState<'any' | 'all'>('any');

  const [selectedUCASSubjects, setSelectedUCASSubjects] = useState<string[]>([]);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectMatch, setSubjectMatch] = useState<'any' | 'all'>('any');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const searchMatch = post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase());
      
      const tagFilter = selectedTags.length === 0 || (tagMatch === 'any'
        ? selectedTags.some(t => post.tags.includes(t))
        : selectedTags.every(t => post.tags.includes(t)));

      const uniFilter = selectedUniversities.length === 0 || (uniMatch === 'any'
        ? selectedUniversities.some(u => post.universities.includes(u))
        : selectedUniversities.every(u => post.universities.includes(u)));
        
      const subjectFilter = selectedUCASSubjects.length === 0 || (subjectMatch === 'any'
        ? selectedUCASSubjects.some(s => post.ucasSubjects.includes(s))
        : selectedUCASSubjects.every(s => post.ucasSubjects.includes(s)));

      return searchMatch && tagFilter && uniFilter && subjectFilter;
    });
  }, [posts, search, selectedTags, tagMatch, selectedUniversities, uniMatch, selectedUCASSubjects, subjectMatch]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredPosts.length / 10));
    const paginatedPosts = filteredPosts.slice((currentPage - 1) * 10, currentPage * 10);
    setDisplayedPosts(paginatedPosts);
  }, [filteredPosts, currentPage]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 space-y-8">
            <FilterCheckboxGroup
                title="Tags"
                options={tags.map(t => ({ id: t.id, name: t.name }))}
                search={tagSearch}
                onSearchChange={setTagSearch}
                selected={selectedTags}
                onSelectedChange={setSelectedTags}
                match={tagMatch}
                onMatchChange={setTagMatch}
            />
            <FilterCheckboxGroup
                title="Universities"
                options={universities.map(u => ({ id: u.id, name: u.name }))}
                search={uniSearch}
                onSearchChange={setUniSearch}
                selected={selectedUniversities}
                onSelectedChange={setSelectedUniversities}
                match={uniMatch}
                onMatchChange={setUniMatch}
            />
            <FilterCheckboxGroup
                title="UCAS Subjects"
                options={ucasSubjects.map(s => ({ id: s.id, name: s.name }))}
                search={subjectSearch}
                onSearchChange={setSubjectSearch}
                selected={selectedUCASSubjects}
                onSelectedChange={setSelectedUCASSubjects}
                match={subjectMatch}
                onMatchChange={setSubjectMatch}
            />
        </div>
        <div className="md:col-span-3">
            <Input
              placeholder="Search in posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-8"
            />
            <UCASPostList posts={displayedPosts} />
            <div className="mt-6 flex justify-center">
                <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    </div>
  );
}

/**
 * Reusable filter checkbox group component for filtering posts by tags, universities, or subjects
 * @param title - Display title for the filter group
 * @param options - Array of options with id and name
 * @param search - Current search query
 * @param onSearchChange - Handler for search input change
 * @param selected - Array of selected option IDs
 * @param onSelectedChange - Handler for selection change
 * @param match - Match mode ('any' or 'all')
 * @param onMatchChange - Handler for match mode change
 */
function FilterCheckboxGroup({ title, options, search, onSearchChange, selected, onSelectedChange, match, onMatchChange }: {
    title: string;
    options: { id: string | number; name: string }[];
    search: string;
    onSearchChange: (value: string) => void;
    selected: string[];
    onSelectedChange: (value: string[]) => void;
    match: 'any' | 'all';
    onMatchChange: (value: 'any' | 'all') => void;
}) {
    const filteredOptions = options.filter(opt => opt.name.toLowerCase().includes(search.toLowerCase()));

    const handleCheckboxChange = (value: string) => {
        onSelectedChange(selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]);
    }

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-4">{title}</h3>
            <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="mb-4"
            />
            <RadioGroup value={match} onValueChange={onMatchChange} className="flex space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id={`${title}-any`} />
                    <Label htmlFor={`${title}-any`}>Match Any</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id={`${title}-all`} />
                    <Label htmlFor={`${title}-all`}>Match All</Label>
                </div>
            </RadioGroup>
            <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredOptions.map(opt => (
                     <label key={opt.id} className="flex items-center space-x-2 my-2 cursor-pointer">
                        <Checkbox
                            id={`${title}-${opt.id}`}
                            checked={selected.includes(String(opt.id))}
                            onChange={() => handleCheckboxChange(String(opt.id))}
                        />
                        <Label htmlFor={`${title}-${opt.id}`}>{opt.name}</Label>
                    </label>
                ))}
            </div>
        </div>
    )
} 