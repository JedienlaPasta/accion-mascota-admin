import { Button } from '@/app/ui/components/Button';
import { SERVICES } from './AppointmentForm';

export default function ServiceSelection({
  selectedService,
  setSelectedService,
  onBack,
  onNext,
}: {
  selectedService: string | null;
  setSelectedService: (serviceId: string) => void;
  onBack?: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Selecciona un Servicio
        </h1>
      </div>
      <div className="grid gap-4">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            className={`group flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-all hover:shadow-md ${
              selectedService === service.id
                ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
                : 'border-gray-200 bg-white hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex size-6 items-center justify-center rounded-full border-2 transition-colors ${
                  selectedService === service.id
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-gray-300/80 bg-white text-white'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    selectedService === service.id
                      ? 'text-emerald-900'
                      : 'text-gray-900'
                  }`}
                >
                  {service.name}
                </h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-emerald-600">
              {service.price}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Volver
          </button>
        ) : (
          <span />
        )}
        <Button
          disabled={!selectedService}
          onClick={onNext}
          className="h-11 rounded-full px-8 disabled:opacity-50"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
