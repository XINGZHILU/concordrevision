'use client';

import { useState, useEffect, useMemo } from 'react';
import { UCASPost, Tag, University, Course } from '@prisma/client';
import { Input } from '@/lib/components/ui/input';
import { UCASPostList } from '@/lib/customui/UCAS/UCASPostList';
import { Pagination } from '@/lib/customui/UCAS/pagination';
import { Checkbox } from '@/lib/components/ui/checkbox';
import { Label } from '@/lib/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/lib/components/ui/radio-group';

type PostWithAuthor = UCASPost & { author: { firstname: string | null, lastname: string | null } };

export function PostList({ posts, tags, universities, courses }: { 
  posts: PostWithAuthor[], 
  tags: Tag[], 
  universities: University[], 
  courses: Course[] 
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

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [courseMatch, setCourseMatch] = useState<'any' | 'all'>('any');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const searchMatch = post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase());
      
      const tagFilter = selectedTags.length === 0 || (tagMatch === 'any'
        ? selectedTags.some(t => post.tags.includes(t))
        : selectedTags.every(t => post.tags.includes(t)));

      const uniFilter = selectedUniversities.length === 0 || (uniMatch === 'any'
        ? selectedUniversities.some(u => post.universities.includes(u))
        : selectedUniversities.every(u => post.universities.includes(u)));
        
      const courseFilter = selectedCourses.length === 0 || (courseMatch === 'any'
        ? selectedCourses.some(c => post.courses.includes(c))
        : selectedCourses.every(c => post.courses.includes(c)));

      return searchMatch && tagFilter && uniFilter && courseFilter;
    });
  }, [posts, search, selectedTags, tagMatch, selectedUniversities, uniMatch, selectedCourses, courseMatch]);

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
                title="Courses"
                options={courses.map(c => ({ id: c.id, name: c.name }))}
                search={courseSearch}
                onSearchChange={setCourseSearch}
                selected={selectedCourses}
                onSelectedChange={setSelectedCourses}
                match={courseMatch}
                onMatchChange={setCourseMatch}
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
                            checked={selected.includes(opt.name)}
                            onChange={() => handleCheckboxChange(opt.name)}
                        />
                        <Label htmlFor={`${title}-${opt.id}`}>{opt.name}</Label>
                    </label>
                ))}
            </div>
        </div>
    )
} 