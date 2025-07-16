import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import { prisma } from '@/lib/prisma'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    const svix_id = req.headers['svix-id'] as string
    const svix_timestamp = req.headers['svix-timestamp'] as string
    const svix_signature = req.headers['svix-signature'] as string

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: 'Error occured -- no svix headers' })
    }

    const payload = (await buffer(req)).toString()
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent

    try {
        evt = wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return res.status(400).json({ 'Error': err })
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === 'user.created') {
        await prisma.user.create({
            data: {
                id: id,
                email: evt.data.email_addresses[0].email_address,
                firstname: evt.data.first_name,
                lastname: evt.data.last_name,
            },
        })
    }
    
    return res.status(200).json({ response: 'Success' })
} 