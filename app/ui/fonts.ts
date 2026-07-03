import { Inter, Outfit, Geist } from 'next/font/google';

export const inter = Inter({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const outfit = Outfit({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});
