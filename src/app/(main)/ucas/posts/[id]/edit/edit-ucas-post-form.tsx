'use client'

import { useFormState } from 'react-dom'
import { UCASPost } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import MDEditor from '@uiw/react-md-editor'
import { updatePost } from './actions'
import { useState } from 'react'

export default function EditUCASPostForm({ post }: { post: UCASPost }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updatePost, initialState);
  const [content, setContent] = useState<string | undefined>(post.content);

  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={post.id} />
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            id="title"
            name="title"
            defaultValue={post.title}
            aria-describedby="title-error"
          />
          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div data-color-mode="light">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <MDEditor
            value={content}
            onChange={setContent}
            preview="edit"
            height={400}
          />
          <input type="hidden" name="content" value={content || ''} />
          <div id="content-error" aria-live="polite" aria-atomic="true">
            {state.errors?.content &&
              state.errors.content.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <Button type="submit">Update Post</Button>
        {state.message ? (
          <div aria-live="polite" className="mt-2 text-sm text-red-500">
            {state.message}
          </div>
        ) : null}
      </div>
    </form>
  )
} 