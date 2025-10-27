import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * API endpoint to update user profile information
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { firstname, lastname, year } = req.body;

        // Validate input
        if (!firstname || !lastname) {
            return res.status(400).json({ message: 'First name and last name are required' });
        }

        if (typeof firstname !== 'string' || typeof lastname !== 'string') {
            return res.status(400).json({ message: 'Names must be strings' });
        }

        if (year !== undefined && (typeof year !== 'number' || year < -1 || year > 4)) {
            return res.status(400).json({ message: 'Invalid year group' });
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                ...(year !== undefined && { year }),
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                year: true,
                email: true,
            },
        });

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        
        // Handle specific Prisma errors
        if (error instanceof Error && error.message.includes('Record to update not found')) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(500).json({ message: 'Error updating profile' });
    }
}
