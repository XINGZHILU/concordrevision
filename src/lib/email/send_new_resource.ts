import { NewResourceEmailTemplate } from '@/lib/email/email-templates';
import { fromDept } from "@/lib/consts";
import { Resend } from 'resend';
import { default_to_stuents } from '@/lib/consts';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendNewResource(note: {
  id: number;
  title: string;
  subject: {
    title: string;
    id: number;
    subscribers: {
      resource_notification: boolean;
      user: {
        email: string
      }
    }[]
  };
}) {
  if (!note) {
    return;
  }

  const recipients = [] as string[];
  for (const link of note.subject.subscribers) {
    if (link.resource_notification === true) {
      recipients.push(link.user.email);
    }
  }

  if (recipients.length > 0) {
    await resend.emails.send({
      from: fromDept(note.subject.title),
      to: default_to_stuents,
      bcc: recipients,
      subject: `New ${note.subject.title} resource added`,
      react: await NewResourceEmailTemplate({
        note: note
      }),
    });
  }
}