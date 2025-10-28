import { prisma } from "@/lib/prisma";
import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from "next";
import { NewTestEmailTemplate } from '@/lib/email/email-templates';
import { default_to_stuents, fromDept } from "@/lib/consts";
import { getYearGroupName } from "@/lib/year-group-config";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * API endpoint for creating tests and notifying subscribers
 * POST - Create a new test and send email notifications
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract data from request body
  const title = req.body.title as string;
  const desc = req.body.desc as string;
  const subjectId = req.body.subject as number;
  const type = req.body.type as string;
  const date = req.body.date as string;

  // Fetch subject with subscribers
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

  // Create the test
  const test = await prisma.test.create({
    data: {
      title: title,
      subjectId: subjectId,
      desc: desc,
      type: +type,
      date: test_date
    }
  })

  // Collect email recipients who have test notifications enabled
  const recipients = [] as string[];
  for (const link of subject.subscribers) {
    if (link.test_notification === true) {
      recipients.push(link.user.email);
    }
  }

  // Send notification emails if there are recipients
  if (recipients.length > 0) {
    await resend.emails.send({
      from: fromDept(subject.title),
      to: default_to_stuents,
      bcc: recipients,
      subject: `New ${getYearGroupName(subject.level)} ${subject.title} Test Scheduled: ${test.title}`,
      react: await NewTestEmailTemplate({
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

