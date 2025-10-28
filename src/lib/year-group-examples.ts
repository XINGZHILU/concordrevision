/**
 * Year Group Configuration Examples
 * 
 * This file contains examples of how to configure year groups for different scenarios.
 * Copy and modify these examples in your year-group-config.ts file as needed.
 */

import type { YearGroupConfig } from '@/lib/year-group-config';

// Example 1: Hide Form 3 and 6.2 year groups
export const hideForm3And62: YearGroupConfig[] = [
  {
    id: 0,
    name: "Form 3",
    visible: false, // Hidden
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
    visible: false, // Hidden
    level: 4,
    tabId: "62"
  }
];

// Example 2: Rename year groups to use different naming convention
export const customNaming: YearGroupConfig[] = [
  {
    id: 0,
    name: "Year 9", // Renamed from Form 3
    visible: true,
    level: 0,
    tabId: "f3"
  },
  {
    id: 1,
    name: "Year 10", // Renamed from Form 4
    visible: true,
    level: 1,
    tabId: "f4"
  },
  {
    id: 2,
    name: "Year 11", // Renamed from Form 5
    visible: true,
    level: 2,
    tabId: "f5"
  },
  {
    id: 3,
    name: "AS Level", // Renamed from 6.1
    visible: true,
    level: 3,
    tabId: "61"
  },
  {
    id: 4,
    name: "A Level", // Renamed from 6.2
    visible: true,
    level: 4,
    tabId: "62"
  }
];

// Example 3: Only show A-Level years (6.1 and 6.2)
export const aLevelOnly: YearGroupConfig[] = [
  {
    id: 0,
    name: "Form 3",
    visible: false, // Hidden
    level: 0,
    tabId: "f3"
  },
  {
    id: 1,
    name: "Form 4", 
    visible: false, // Hidden
    level: 1,
    tabId: "f4"
  },
  {
    id: 2,
    name: "Form 5",
    visible: false, // Hidden
    level: 2,
    tabId: "f5"
  },
  {
    id: 3,
    name: "AS Level",
    visible: true,
    level: 3,
    tabId: "61"
  },
  {
    id: 4,
    name: "A Level",
    visible: true,
    level: 4,
    tabId: "62"
  }
];

// Example 4: Custom school naming with some years hidden
export const customSchoolConfig: YearGroupConfig[] = [
  {
    id: 0,
    name: "Junior Year",
    visible: false, // Hidden for this school
    level: 0,
    tabId: "f3"
  },
  {
    id: 1,
    name: "Sophomore", 
    visible: true,
    level: 1,
    tabId: "f4"
  },
  {
    id: 2,
    name: "Pre-IB",
    visible: true,
    level: 2,
    tabId: "f5"
  },
  {
    id: 3,
    name: "IB Year 1",
    visible: true,
    level: 3,
    tabId: "61"
  },
  {
    id: 4,
    name: "IB Year 2",
    visible: true,
    level: 4,
    tabId: "62"
  }
];

/**
 * How to apply these configurations:
 * 
 * 1. Choose one of the example configurations above
 * 2. Copy the configuration array
 * 3. In year-group-config.ts, replace the yearGroupConfig array with your chosen configuration
 * 4. Or use the admin interface at /admin/year-groups to make changes through the UI
 * 
 * Example:
 * ```typescript
 * // In year-group-config.ts
 * export const yearGroupConfig: YearGroupConfig[] = customNaming; // Use custom naming
 * ```
 */
