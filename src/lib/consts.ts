import { getYearGroupNamesArray } from './year-group-config';

function getSlug(s: string) {
  return s.replace(' ', '-').toLowerCase();
}

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

export const default_from = "Concordpedia Team <noreply@concordpedia.com>";

export const futures_email = "Student Futures Team <futures@concordpedia.com>";

export function deptName(subject: string) {
  return `The ${subject} Department`
}

export function fromDept(subject: string) {
  return `${deptName(subject)} <${getSlug(subject)}@concordpedia.com>`
}

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
