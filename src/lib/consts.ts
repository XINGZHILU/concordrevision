import { getYearGroupNamesArray } from '@/lib/year-group-config';

// Dynamic year group names that respect visibility settings
export const year_group_names = getYearGroupNamesArray();

export const olympiad_subjects = [
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Computer Science',
  'Humanities',
]

export const default_from = "Concordpedia Team <noreply@concordpedia.com>";

export const default_to_stuents = "Students <students@concordpedia.com>";

export const futures_email = "Student Futures Team <noreply@concordpedia.com>";

export function deptName(subject: string) {
  if (subject.indexOf('Math') != -1){
    return 'The Maths Department'
  }
  return `The ${subject} Department`
}

export function fromDept(subject: string) {
  return `${deptName(subject)} <noreply@concordpedia.com>`
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
