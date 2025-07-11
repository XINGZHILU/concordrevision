import { prisma } from "@/lib/prisma";
import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from "next";
import { NewTestEmailTemplate } from "@/email/email-templates";
import { email_from } from "@/lib/consts";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const title = req.body.title as string;
  const desc = req.body.desc as string;
  const subjectId = req.body.subject as number;
  const type = req.body.type as string;
  const date = req.body.date as string;

  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId
    },
    include: {
      subscribers: {
        include: {
          user: true
        }
      }
    }
  });

  if (!subject) {
    res.status(401).json({});
    return;
  }

  const test_date = new Date(date);

  const test = await prisma.test.create({
    data: {
      title: title,
      subjectId: subjectId,
      desc: desc,
      type: +type,
      date: test_date
    }
  })

  const recipients = [] as string[];
  for (const link of subject.subscribers) {
    if (link.test_notification === true) {
      recipients.push(link.user.email);
    }
  }

  // console.log(recipients);

  if (recipients.length > 0) {
    await resend.emails.send({
      from: email_from,
      to: email_from,
      bcc: recipients,
      subject: `${subject.title} - ${test.title}`,
      react: NewTestEmailTemplate({
        test: test,
        subject: subject,
      }),
    });
  }

  res.status(200).json({});

}

export const config = {
  api: {
    bodyParser: true,
  },
};