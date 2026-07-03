import Link from 'next/link';
import { Bird, Rabbit, Squirrel, Turtle } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-emerald-900 font-sans text-white/80">
      <div className="h-10 w-full bg-emerald-950"></div>
      <div className="mx-auto max-w-7xl px-6 py-18">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo y Descripción */}
          <div className="space-y-4">
            <div className="flex w-fit rounded-xl bg-emerald-950">
              <Image
                src="/logo.png"
                alt="cuidapet logo"
                width={120}
                height={40}
                className="h-22 w-40 object-cover p-3 brightness-0 invert"
              />
            </div>
            <p className="max-w-[240px] text-[15px] leading-relaxed">
              Servicio de atención veterinaria para toda la comunidad. Cuidamos
              la salud de tus mascotas.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
              Enlaces
            </h3>
            <ul className="space-y-4 text-[15px]">
              <li>
                <Link
                  href="/servicios"
                  className="transition-colors hover:text-white"
                >
                  Nuestros Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/campanas"
                  className="transition-colors hover:text-white"
                >
                  Campañas Vigentes
                </Link>
              </li>
              <li>
                <Link
                  href="/informacion"
                  className="transition-colors hover:text-white"
                >
                  Tenencia Responsable
                </Link>
              </li>
              <li>
                <Link
                  href="/emergencias"
                  className="transition-colors hover:text-white"
                >
                  Emergencias
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
              ¿Necesitas ayuda?
            </h3>
            <div className="space-y-4 text-[15px]">
              <div>
                <p className="text-xs opacity-60">WhatsApp / Teléfono</p>
                <a
                  href="tel:+56971357976"
                  className="text-white hover:underline"
                >
                  +56 9 7135 7976
                </a>
              </div>
              <div>
                <p className="text-xs opacity-60">Correo electrónico</p>
                <a
                  href="mailto:accionmascota@municipalidadalgarrobo.cl"
                  className="block truncate text-white hover:underline"
                >
                  accionmascota@municipalidad...
                </a>
              </div>
              <div className="pt-2">
                <p className="text-xs opacity-60">Dirección</p>
                <p className="text-white">Algarrobo, Chile</p>
                <p className="text-[13px] opacity-60">(Atención presencial)</p>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
              Horarios
            </h3>
            <div className="space-y-3 text-[15px]">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Lunes - Jueves</span>
                <span className="text-white">08:30 - 17:00</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Viernes</span>
                <span className="text-white">08:30 - 16:00</span>
              </div>
              <p className="pt-1 text-[13px] italic opacity-60">
                Colación: 14:00 a 15:00 hrs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="relative bg-emerald-950 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
            <Image
              src="/escudo_white.png"
              alt="cuidapet logo"
              width={200}
              height={40}
              className="w-32 object-cover opacity-80"
            />
            <span className="hidden h-10 w-px bg-emerald-800 md:block"></span>
            <div>
              <p className="text-sm opacity-60">
                2026 © Ilustre Municipalidad de Algarrobo
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="#" className="hover:text-white">
                  Privacidad
                </Link>
                <Link href="#" className="hover:text-white">
                  Términos
                </Link>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="flex items-center gap-4">
            <Bird className="hover:text-teal-500" />
            <Rabbit className="hover:text-slate-400" />
            <Squirrel className="hover:text-orange-600" />
            <Turtle className="hover:text-emerald-400" />
            <span className="group flex gap-3">
              <p className="cursor-pointer text-sm opacity-60 transition-colors group-hover:text-white group-hover:underline group-hover:opacity-100">
                Síguenos
              </p>
              <svg
                role="img"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 cursor-pointer text-white transition-colors group-hover:text-blue-600"
              >
                <title>Facebook</title>
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
