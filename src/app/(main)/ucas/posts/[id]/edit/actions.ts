'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const FormSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
})

export async function updatePost(formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    id: parseInt(formData.get('id') as string),
    title: formData.get('title'),
    content: formData.get('content'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Post.',
    }
  }

  const { id, title, content } = validatedFields.data
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const post = await prisma.uCASPost.findUnique({
    where: { id },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  const isAdmin = user.user_metadata.admin as boolean;

  if (post.authorId !== user.id && !isAdmin) {
    throw new Error('Unauthorized to update this post')
  }

  try {
    await prisma.uCASPost.update({
      where: { id },
      data: {
        title,
        content,
      },
    })
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to Update Post.',
    }
  }

  revalidatePath(`/ucas/posts/${id}`)
  redirect(`/ucas/posts/${id}`)
} 