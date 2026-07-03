export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { Globe, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="grid min-h-screen flex-1 bg-linear-to-br from-gray-900 via-slate-800 to-gray-900 p-4 lg:grid-cols-2">
        {/* Izquierda */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md space-y-10 text-center">
            {/* Logo y título */}
            <div className="space-y-4">
              <div className="mb-6 flex justify-center">
                {/* Sugerencia: Usar un contenedor sin fondo gris si el logo es transparente */}
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm">
                  <Image
                    src="/mascota_icon.png"
                    alt="Logo Acción Mascota"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                Portal Administrativo
              </h1>
              <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-transparent via-emerald-400 to-transparent" />
              <p className="mx-auto text-base text-slate-300">
                Área exclusiva para personal autorizado de la Municipalidad de
                Algarrobo
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-4">
              {/* Botón Login Admin */}
              <Link
                href="/admin"
                className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-linear-to-r from-gray-100 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex items-center gap-3">
                  {/* <Lock className="h-5 w-5 text-gray-700" /> */}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  <span>Ingresar al Portal</span>
                </div>
              </Link>

              {/* Botón Portal Público */}
              <Link
                href="/"
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                <Globe className="h-5 w-5 text-slate-300" />
                <span>Ir al Portal Público</span>
              </Link>
            </div>

            {/* Información adicional */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-emerald-200/80">
                  Autenticación segura via Keycloak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Derecha */}
        <div className="relative hidden overflow-hidden rounded-4xl lg:block">
          {/* Overlay */}
          <div className="absolute inset-0 z-10 bg-linear-to-b from-gray-900/5 via-slate-800/10 to-gray-900/30" />
          <Image
            src="/dog_05.jpg"
            alt="Perro de fondo Acción Mascota"
            fill
            className="object-cover"
            priority
            sizes="70vw"
          />

          <div className="absolute right-8 bottom-5 z-20">
            <Image
              src="/escudo_white.png"
              alt="HeroLogo"
              width={200}
              height={200}
              priority
              className="h-12 w-auto shrink-0"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
