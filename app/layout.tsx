import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { outfit } from './ui/fonts';

export const metadata: Metadata = {
  title: 'Acción Mascota - Municipalidad de Algarrobo',
  description:
    'Servicio de atención de mascotas. Agenda citas, registra tus mascotas y accede a información sobre tenencia responsable, vacunaciones y servicios gratuitos para la comunidad.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="es">
      <body className={`${outfit.className} font-sans antialiased`}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
