import { getYearGroupNamesArray } from './year-group-config';

// Dynamic year group names that respect visibility settings
export const year_group_names = getYearGroupNamesArray();

export const olympiad_subjects = [
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Computer Science',
  'Economics',
]

export const email_from = "Concordpedia Team <noreply@concordpedia.com>";

export const key_pages = [
  {
    name: 'Home',
    link: '/'
  },
  {
    name: 'Revision',
    link: '/revision'
  },
  {
    name: 'Olympiads',
    link: '/olympiads'
  },
  {
    name: 'UCAS',
    link: '/ucas'
  },
]
