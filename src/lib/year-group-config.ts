/**
 * Year Group Configuration System
 * 
 * This file manages the visibility and naming of year groups across the application.
 * Each year group can be individually hidden/shown and renamed through these settings.
 */

export interface YearGroupConfig {
  id: number;
  name: string;
  visible: boolean;
  level: number; // Maps to database level (0-4)
  tabId: string; // Used for tab identification
}

/**
 * Default year group configuration
 * Set visible to false to hide a year group from all interfaces
 * Change name to rename the year group display text
 */
export const yearGroupConfig: YearGroupConfig[] = [
  {
    id: 0,
    name: "Form 3",
    visible: false,
    level: 0,
    tabId: "f3"
  },
  {
    id: 1,
    name: "Form 4", 
    visible: true,
    level: 1,
    tabId: "f4"
  },
  {
    id: 2,
    name: "Form 5",
    visible: true,
    level: 2,
    tabId: "f5"
  },
  {
    id: 3,
    name: "6.1",
    visible: true,
    level: 3,
    tabId: "61"
  },
  {
    id: 4,
    name: "6.2",
    visible: true,
    level: 4,
    tabId: "62"
  }
];

/**
 * Get visible year groups only
 */
export function getVisibleYearGroups(): YearGroupConfig[] {
  return yearGroupConfig.filter(group => group.visible);
}

/**
 * Get year group by level
 */
export function getYearGroupByLevel(level: number): YearGroupConfig | undefined {
  return yearGroupConfig.find(group => group.level === level);
}

/**
 * Get year group name by level (backwards compatibility)
 */
export function getYearGroupName(level: number): string {
  const group = getYearGroupByLevel(level);
  return group?.visible ? group.name : '';
}

/**
 * Check if year group is visible by level
 */
export function isYearGroupVisible(level: number): boolean {
  const group = getYearGroupByLevel(level);
  return group?.visible ?? false;
}

/**
 * Get all year group names (for backwards compatibility)
 * Only includes visible year groups
 */
export function getYearGroupNames(): string[] {
  return yearGroupConfig
    .filter(group => group.visible)
    .sort((a, b) => a.level - b.level)
    .map(group => group.name);
}

/**
 * Get year group names indexed by level (for backwards compatibility)
 * Returns array with empty strings for hidden year groups
 */
export function getYearGroupNamesArray(): string[] {
  const names: string[] = [];
  for (let i = 0; i < 5; i++) {
    const group = getYearGroupByLevel(i);
    names[i] = group?.visible ? group.name : '';
  }
  return names;
}

/**
 * Update year group configuration
 * This function allows runtime updates to the configuration
 */
export function updateYearGroupConfig(updates: Partial<YearGroupConfig>[]): void {
  updates.forEach(update => {
    if (update.id !== undefined) {
      const index = yearGroupConfig.findIndex(group => group.id === update.id);
      if (index !== -1) {
        yearGroupConfig[index] = { ...yearGroupConfig[index], ...update };
      }
    }
  });
}

/**
 * Reset year group configuration to defaults
 */
export function resetYearGroupConfig(): void {
  const defaults: YearGroupConfig[] = [
    { id: 0, name: "Form 3", visible: true, level: 0, tabId: "f3" },
    { id: 1, name: "Form 4", visible: true, level: 1, tabId: "f4" },
    { id: 2, name: "Form 5", visible: true, level: 2, tabId: "f5" },
    { id: 3, name: "6.1", visible: true, level: 3, tabId: "61" },
    { id: 4, name: "6.2", visible: true, level: 4, tabId: "62" }
  ];
  
  yearGroupConfig.splice(0, yearGroupConfig.length, ...defaults);
}
