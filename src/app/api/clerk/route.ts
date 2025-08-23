import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json()
  if (payload.type == 'user.created') {
    const email = payload.data.email_addresses[0].email_address;
    const student = (
      email.startsWith('0') || email.startsWith('1') || email.startsWith('2') || email.startsWith('3') || email.startsWith('4') ||
      email.startsWith('5') || email.startsWith('6') || email.startsWith('7') || email.startsWith('8') || email.startsWith('9')
    );
    await prisma.user.create({
      data: {
        id: payload.data.id,
        email: email,
        firstname: payload.data.first_name,
        lastname: payload.data.last_name,
        teacher: !student,
        admin: !student,
        upload_permission: !student,
        year: -1,
      }
    });
  }
  return Response.json({ message: 'Successful' })
}
