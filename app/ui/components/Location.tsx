import { MapPin } from 'lucide-react';

export default function Location() {
  return (
    <div className="mb-10 overflow-hidden border-gray-100 bg-white">
      <div className="border-b border-gray-100 bg-gray-50/50 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">Encuentranos en</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Av. Peñablanca 250, Edificio Central de Acción Mascota
        </p>
      </div>
      <div className="h-[300px] w-full bg-gray-100">
        <iframe
          src="https://maps.google.com/maps?q=Av.+Peñablanca+250&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de Ubicación"
        />
      </div>
    </div>
  );
}
