import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { outfit } from './ui/fonts';

export const metadata: Metadata = {
  title: 'Acción Mascota - Municipalidad de Algarrobo',
  description:
    'Servicio de atención de mascotas. Agenda citas, registra tus mascotas y accede a información sobre tenencia responsable, vacunaciones y servicios gratuitos para la comunidad.',
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
