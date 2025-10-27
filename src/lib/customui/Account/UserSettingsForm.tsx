'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  LuUser, 
  LuMail, 
  LuGraduationCap, 
  LuSave, 
  LuRefreshCw,
  LuCheck,
  LuX
} from 'react-icons/lu';
import { getYearGroupName, getVisibleYearGroups } from '@/lib/year-group-config';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  year: number;
}

interface UserSettingsFormProps {
  user: User;
}

/**
 * Form component for editing user profile settings
 */
const UserSettingsForm: React.FC<UserSettingsFormProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    year: user.year,
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const visibleYearGroups = getVisibleYearGroups();

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Check if there are changes
    const hasChanges = 
      newFormData.firstname !== user.firstname ||
      newFormData.lastname !== user.lastname ||
      newFormData.year !== user.year;
    
    setHasChanges(hasChanges);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      toast({
        title: 'No Changes',
        description: 'No changes were made to save.',
      });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      
      setHasChanges(false);
      
      // Refresh the page to reflect changes
      window.location.reload();
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      year: user.year,
    });
    setHasChanges(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Account Settings</h2>
        <p className="text-muted-foreground">
          Update your profile information and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* Personal Information Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <LuUser className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          </div>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-foreground mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                value={formData.firstname}
                onChange={(e) => handleInputChange('firstname', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Enter your first name"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-foreground mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                value={formData.lastname}
                onChange={(e) => handleInputChange('lastname', e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Enter your last name"
                required
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border border-input bg-muted rounded-lg text-sm text-muted-foreground cursor-not-allowed"
                />
                <LuMail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed here. Please contact support if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <LuGraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Academic Information</h3>
          </div>

          <div className="space-y-4">
            {/* Year Group */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-foreground mb-2">
                Year Group
              </label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value={-1}>Select Year Group</option>
                {visibleYearGroups.map((group) => (
                  <option key={group.level} value={group.level}>
                    {group.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Your year group helps us show relevant content and subjects.
              </p>
            </div>

            {/* Current Year Group Display */}
            {formData.year >= 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <LuCheck className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">
                    Selected: {getYearGroupName(formData.year)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-border">
          <Button
            type="submit"
            disabled={!hasChanges || saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <LuRefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <LuSave className="h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>

          {hasChanges && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <LuX className="h-4 w-4" />
              Reset
            </Button>
          )}

          {!hasChanges && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuCheck className="h-4 w-4 text-success" />
              All changes saved
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserSettingsForm;
