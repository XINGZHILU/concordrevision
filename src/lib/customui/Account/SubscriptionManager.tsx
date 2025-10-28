'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { Switch } from '@/lib/components/ui/switch';
import { useToast } from '@/lib/components/ui/use-toast';
import { 
  LuBookOpen, 
  LuBookPlus, 
  LuBookUp, 
  LuBookKey, 
  LuBookMarked,
  LuBell,
  LuBellOff,
  LuUsers,
  LuRefreshCw,
  LuCheck,
  LuX
} from 'react-icons/lu';
import { getVisibleYearGroups, isYearGroupVisible, getYearGroupName } from '@/lib/year-group-config';

interface Subject {
  id: number;
  title: string;
  desc: string;
  level: number;
}

interface Subscription {
  id: number;
  subjectId: number;
  test_notification: boolean;
  resource_notification: boolean;
}

interface SubscriptionManagerProps {
  userId: string;
}

/**
 * Component for managing user subscriptions to all subjects
 */
const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ userId }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch subjects and subscriptions in parallel
      const [subjectsResponse, subscriptionsResponse] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/account/subscriptions')
      ]);

      if (!subjectsResponse.ok || !subscriptionsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const subjectsData = await subjectsResponse.json();
      const subscriptionsData = await subscriptionsResponse.json();

      setSubjects(subjectsData);
      setSubscriptions(subscriptionsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionToggle = async (subjectId: number, isSubscribed: boolean) => {
    setUpdating(prev => new Set(prev).add(subjectId));

    try {
      const method = isSubscribed ? 'DELETE' : 'POST';
      const response = await fetch(`/api/subscriptions/${subjectId}`, { method });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      if (isSubscribed) {
        // Remove subscription
        setSubscriptions(prev => prev.filter(sub => sub.subjectId !== subjectId));
        toast({
          title: 'Unsubscribed',
          description: 'You will no longer receive notifications for this subject.',
        });
      } else {
        // Add subscription
        const newSubscription = await response.json();
        setSubscriptions(prev => [...prev, newSubscription]);
        toast({
          title: 'Subscribed',
          description: 'You will now receive notifications for this subject.',
        });
      }
    } catch (err) {
      console.error('Error updating subscription:', err);
      toast({
        title: 'Error',
        description: 'Failed to update subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(subjectId);
        return newSet;
      });
    }
  };

  const handleNotificationToggle = async (
    subjectId: number, 
    type: 'test_notification' | 'resource_notification', 
    enabled: boolean
  ) => {
    setUpdating(prev => new Set(prev).add(subjectId));

    try {
      const response = await fetch(`/api/subscriptions/${subjectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [type]: enabled,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      const updatedSubscription = await response.json();
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.subjectId === subjectId ? updatedSubscription : sub
        )
      );

      toast({
        title: 'Settings Updated',
        description: `${type === 'test_notification' ? 'Test' : 'Resource'} notifications ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (err) {
      console.error('Error updating notification settings:', err);
      toast({
        title: 'Error',
        description: 'Failed to update notification settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(subjectId);
        return newSet;
      });
    }
  };

  const getSubscription = (subjectId: number): Subscription | undefined => {
    return subscriptions.find(sub => sub.subjectId === subjectId);
  };

  const isSubscribed = (subjectId: number): boolean => {
    return subscriptions.some(sub => sub.subjectId === subjectId);
  };

  const getYearGroupIcon = (level: number) => {
    switch (level) {
      case 0: return <LuBookOpen className="w-4 h-4 mr-2" />;
      case 1: return <LuBookPlus className="w-4 h-4 mr-2" />;
      case 2: return <LuBookUp className="w-4 h-4 mr-2" />;
      case 3: return <LuBookKey className="w-4 h-4 mr-2" />;
      case 4: return <LuBookMarked className="w-4 h-4 mr-2" />;
      default: return <LuBookOpen className="w-4 h-4 mr-2" />;
    }
  };

  // Filter subjects to only include those from visible year groups
  const visibleSubjects = subjects.filter((subject) => isYearGroupVisible(subject.level));
  
  // Group subjects by level
  const subjectsByLevel = {
    0: visibleSubjects.filter(s => s.level === 0),
    1: visibleSubjects.filter(s => s.level === 1),
    2: visibleSubjects.filter(s => s.level === 2),
    3: visibleSubjects.filter(s => s.level === 3),
    4: visibleSubjects.filter(s => s.level === 4),
  };

  const visibleYearGroups = getVisibleYearGroups();
  const subscribedCount = subscriptions.length;
  const totalSubjects = visibleSubjects.length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <LuRefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            <LuRefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Manage Subscriptions</h2>
        <p className="text-muted-foreground">
          Subscribe to subjects to receive notifications about new tests and resources
        </p>
      </div>

      {/* Summary */}
      <div className="mb-8 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LuUsers className="h-5 w-5 text-primary" />
              <span className="font-medium">Subscriptions:</span>
              <Badge variant="default">{subscribedCount}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              out of {totalSubjects} subjects
            </div>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm">
            <LuRefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Year Group Tabs */}
      {visibleYearGroups.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg border border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
            <LuBookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No year groups available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No year groups are currently enabled. Please contact an administrator.
          </p>
        </div>
      ) : (
        <Tabs defaultValue={visibleYearGroups[0]?.tabId || 'f3'}>
          <div className="border-b border-border mb-8">
            <div className="flex justify-center">
              <TabsList>
                {visibleYearGroups.map(group => {
                  const groupSubjects = subjectsByLevel[group.level as keyof typeof subjectsByLevel] || [];
                  const groupSubscribed = groupSubjects.filter(s => isSubscribed(s.id)).length;
                  
                  return (
                    <TabsTrigger 
                      key={group.tabId} 
                      value={group.tabId} 
                      className="flex items-center px-3 py-2 text-sm font-medium"
                    >
                      {getYearGroupIcon(group.level)}
                      {group.name}
                      <Badge variant="secondary" className="ml-2">
                        {groupSubscribed}/{groupSubjects.length}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {visibleYearGroups.map(group => {
            const groupSubjects = subjectsByLevel[group.level as keyof typeof subjectsByLevel] || [];
            
            return (
              <TabsContent key={group.tabId} value={group.tabId}>
                <SubjectSubscriptionList
                  subjects={groupSubjects}
                  subscriptions={subscriptions}
                  updating={updating}
                  onSubscriptionToggle={handleSubscriptionToggle}
                  onNotificationToggle={handleNotificationToggle}
                  yearGroupName={group.name}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};

// Component for displaying subjects in a year group
function SubjectSubscriptionList({
  subjects,
  subscriptions,
  updating,
  onSubscriptionToggle,
  onNotificationToggle,
  yearGroupName,
}: {
  subjects: Subject[];
  subscriptions: Subscription[];
  updating: Set<number>;
  onSubscriptionToggle: (subjectId: number, isSubscribed: boolean) => void;
  onNotificationToggle: (subjectId: number, type: 'test_notification' | 'resource_notification', enabled: boolean) => void;
  yearGroupName: string;
}) {
  const getSubscription = (subjectId: number): Subscription | undefined => {
    return subscriptions.find(sub => sub.subjectId === subjectId);
  };

  const isSubscribed = (subjectId: number): boolean => {
    return subscriptions.some(sub => sub.subjectId === subjectId);
  };

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12 bg-muted rounded-lg border border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
          <LuBookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No subjects available</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          There are currently no subjects available for {yearGroupName}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subjects.map((subject) => {
        const subscription = getSubscription(subject.id);
        const subscribed = isSubscribed(subject.id);
        const isUpdating = updating.has(subject.id);

        return (
          <div
            key={subject.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {subject.title}
                  </h3>
                  <Badge variant="outline">
                    {getYearGroupName(subject.level)}
                  </Badge>
                  {subscribed && (
                    <Badge variant="default" className="text-xs">
                      <LuCheck className="h-3 w-3 mr-1" />
                      Subscribed
                    </Badge>
                  )}
                </div>
                
                {subject.desc && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {subject.desc}
                  </p>
                )}

                {/* Notification Settings (only show if subscribed) */}
                {subscribed && subscription && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground">Notification Settings</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LuBell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Test notifications</span>
                      </div>
                      <Switch
                        checked={subscription.test_notification}
                        onCheckedChange={(checked) => 
                          onNotificationToggle(subject.id, 'test_notification', checked)
                        }
                        disabled={isUpdating}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LuBellOff className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Resource notifications</span>
                      </div>
                      <Switch
                        checked={subscription.resource_notification}
                        onCheckedChange={(checked) => 
                          onNotificationToggle(subject.id, 'resource_notification', checked)
                        }
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subscription Toggle */}
              <div className="ml-4">
                <Button
                  variant={subscribed ? "destructive" : "default"}
                  size="sm"
                  onClick={() => onSubscriptionToggle(subject.id, subscribed)}
                  disabled={isUpdating}
                  className="min-w-[100px]"
                >
                  {isUpdating ? (
                    <LuRefreshCw className="h-4 w-4 animate-spin" />
                  ) : subscribed ? (
                    <>
                      <LuX className="h-4 w-4 mr-1" />
                      Unsubscribe
                    </>
                  ) : (
                    <>
                      <LuCheck className="h-4 w-4 mr-1" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SubscriptionManager;
