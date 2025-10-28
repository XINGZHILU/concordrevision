'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/lib/components/ui/button';
import { useToast } from '@/lib/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover';
import { LuBell, LuBellOff, LuCheck } from 'react-icons/lu';

interface Subscription {
    id: number;
    userId: string;
    subjectId: number;
    test_notification: boolean;
    resource_notification: boolean;
}

interface SubscriptionManagerProps {
    subjectId: number;
    userId?: string;
}

export default function SubscriptionManager({ subjectId, userId }: SubscriptionManagerProps) {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchSubscription = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch(`/api/subscriptions/${subjectId}`);
            if (response.ok) {
                const data = await response.json();
                setSubscription(data);
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
        } finally {
            setIsLoading(false);
        }
    }, [subjectId, userId]);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    const handleSubscribe = async () => {
        try {
            const response = await fetch(`/api/subscriptions/${subjectId}`, { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                setSubscription(data);
                toast({ title: 'Subscribed!', description: 'You will now receive notifications for this subject.' });
            }
        } catch {
            toast({ title: 'Error', description: 'Could not subscribe. Please try again.', variant: 'destructive' });
        }
    };

    const handleUnsubscribe = async () => {
        try {
            await fetch(`/api/subscriptions/${subjectId}`, { method: 'DELETE' });
            setSubscription(null);
            toast({ title: 'Unsubscribed', description: 'You will no longer receive notifications.' });
        } catch {
            toast({ title: 'Error', description: 'Could not unsubscribe. Please try again.', variant: 'destructive' });
        }
    };

    const handleNotificationChange = async (type: 'test' | 'resource', checked: boolean) => {
        if (!subscription) return;

        const newSettings = {
            test_notification: type === 'test' ? checked : subscription.test_notification,
            resource_notification: type === 'resource' ? checked : subscription.resource_notification,
        };

        try {
            const response = await fetch(`/api/subscriptions/${subjectId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings),
            });

            if (response.ok) {
                const data = await response.json();
                setSubscription(data);
                toast({ title: 'Preferences updated' });
            }
        } catch {
            toast({ title: 'Error', description: 'Could not update preferences.', variant: 'destructive' });
        }
    };
    
    if (!userId) {
        return null;
    }

    if (isLoading) {
        return <div className="h-9 w-28 bg-muted rounded-md animate-pulse" />;
    }

    if (subscription) {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                        <LuCheck className="mr-2 h-4 w-4" />
                        Subscribed
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                   <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                                Set your notification preferences.
                            </p>
                        </div>
                        <div className="grid gap-2">
                             <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Upcoming Tests</span>
                                <Button
                                    variant={subscription.test_notification ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleNotificationChange('test', !subscription.test_notification)}
                                    className="w-24"
                                >
                                    {subscription.test_notification ? <LuBell className="mr-2 h-4 w-4" /> : <LuBellOff className="mr-2 h-4 w-4" />}
                                    {subscription.test_notification ? 'On' : 'Off'}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                 <span className="text-sm font-medium">New Resources</span>
                                <Button
                                    variant={subscription.resource_notification ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleNotificationChange('resource', !subscription.resource_notification)}
                                    className="w-24"
                                >
                                    {subscription.resource_notification ? <LuBell className="mr-2 h-4 w-4" /> : <LuBellOff className="mr-2 h-4 w-4" />}
                                    {subscription.resource_notification ? 'On' : 'Off'}
                                </Button>
                            </div>
                        </div>
                         <Button variant="outline" size="sm" onClick={handleUnsubscribe}>Unsubscribe</Button>
                   </div>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Button onClick={handleSubscribe} size="sm">
            <LuBell className="mr-2 h-4 w-4" /> Subscribe
        </Button>
    );
} 