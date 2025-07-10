import { Merriweather, Lato } from 'next/font/google';

export const headingFont = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
});

export const bodyFont = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});