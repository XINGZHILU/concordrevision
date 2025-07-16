import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json()
  console.log(payload)
  if (payload.type == 'user.created') {
    await prisma.user.create({
      data: {
        id: payload.data.id,
        email: payload.data.email_addresses[0].email_address,
        firstname: payload.data.first_name,
        lastname: payload.data.last_name,
        teacher: false,
        admin: false,
        upload_permission: false,
        year: -1,
      }
    });
  }
}

export async function GET() {
  return Response.json({ message: 'Hello World!' })
}