import ImagenMascota from '@/app/ui/public/adopcion/ImagenMascota';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjRGNEY1Ii8+PC9zdmc+';

// Mock data para las solicitudes del usuario actual
const misSolicitudes = [
  {
    id: 'sol-001',
    mascotaId: 'adop-001',
    mascotaNombre: 'Milo',
    fechaSolicitud: '2026-03-10T10:30:00Z',
    estado: 'en_revision', // 'pendiente', 'en_revision', 'aprobada', 'rechazada'
    imagen: '/dog_07.jpg',
    mensajeVeterinaria:
      'Estamos revisando tus antecedentes. Te contactaremos pronto para agendar una breve entrevista telefónica.',
  },
  {
    id: 'sol-002',
    mascotaId: 'adop-004',
    mascotaNombre: 'Mochi',
    fechaSolicitud: '2026-01-15T14:20:00Z',
    estado: 'rechazada',
    imagen: '/cat_04.jpg',
    mensajeVeterinaria:
      'Lamentablemente, Mochi no es compatible con perritos y notamos en tu perfil que tienes un perro adulto. Buscamos el mejor ambiente para ella.',
  },
];

// Helper para renderizar el estado visualmente
const getEstadoUI = (estado: string) => {
  switch (estado) {
    case 'pendiente':
      return {
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: Clock,
        label: 'Recibida',
      };
    case 'en_revision':
      return {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: FileText,
        label: 'En Revisión',
      };
    case 'aprobada':
      return {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
        label: 'Aprobada',
      };
    case 'rechazada':
      return {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: XCircle,
        label: 'No Válida',
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: AlertCircle,
        label: 'Desconocido',
      };
  }
};

export default function MisSolicitudesPage() {
  return (
    <div className="bg-secondary-background h-full pt-8 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900">
            Mis Solicitudes de Adopción
          </h1>
          <p className="text-gray-600">
            Haz seguimiento al estado de tus postulaciones para darle un hogar a
            una mascota.
          </p>
        </div>

        <div className="space-y-6">
          {misSolicitudes.length === 0 ? (
            <div className="rounded-4xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900">
                Aún no tienes solicitudes
              </h3>
              <p className="mt-1 mb-6 text-gray-500">
                Anímate a cambiar la vida de un animalito rescatado.
              </p>
              <Link
                href="/adopcion"
                className="inline-flex rounded-full bg-[#006D4E] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005a40]"
              >
                Ver mascotas en adopción
              </Link>
            </div>
          ) : (
            misSolicitudes.map((solicitud) => {
              const EstadoUI = getEstadoUI(solicitud.estado);
              const Icono = EstadoUI.icon;

              return (
                <div
                  key={solicitud.id}
                  className="flex flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md sm:flex-row"
                >
                  {/* Foto de la mascota */}
                  <div className="relative h-48 shrink-0 bg-gray-100 sm:h-auto sm:w-48">
                    <ImagenMascota
                      src={solicitud.imagen}
                      alt={solicitud.mascotaNombre}
                      sizes="(min-width: 640px) 192px, 100vw"
                      quality={70}
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Solicitud por {solicitud.mascotaNombre}
                        </h3>
                        <span className="text-sm text-gray-500">
                          Enviada el{' '}
                          {new Date(
                            solicitud.fechaSolicitud
                          ).toLocaleDateString('es-CL')}
                        </span>
                      </div>

                      {/* Badge de Estado */}
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${EstadoUI.color}`}
                      >
                        <Icono className="h-4 w-4" />
                        {EstadoUI.label}
                      </div>
                    </div>

                    {/* Mensaje de retroalimentación (Si existe) */}
                    {solicitud.mensajeVeterinaria && (
                      <div className="mt-auto rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm leading-relaxed text-gray-700">
                          <span className="mb-1 block font-semibold">
                            Mensaje de la Veterinaria:
                          </span>
                          {solicitud.mensajeVeterinaria}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
