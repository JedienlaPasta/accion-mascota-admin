import { validateRutDv } from '@/app/_lib/utils/check-values';
import Dropdown from '@/app/ui/components/Dropdown';
import Input, { SafeNumberInput } from '@/app/ui/components/Input';
import { FileText, FingerprintPattern, HeartPulse } from 'lucide-react';

type NewPetFormProps = {
  petData: PetData;
  isValid: (cond: boolean, value: string) => React.ReactNode | null;
  handleChange: (key: keyof PetData, value: PetData[keyof PetData]) => void;
};

type PetData = {
  rut: string;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  sexo: string;
  color: string;
  peso: string;
  chip: string;
  esterilizado: string;
};

export default function NewPetForm({
  petData,
  isValid,
  handleChange,
}: NewPetFormProps) {
  const pesoClean = (raw: number | string): number => {
    const num = Number(String(raw || '').replace(',', '.'));
    return Number.isFinite(num) ? num : NaN;
  };

  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Identificacion */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <FingerprintPattern className="size-4.5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Identificación
              </h2>
              <p className="text-xs text-gray-500">
                Registros oficiales de la mascota y su vínculo con el
                propietario.
              </p>
            </div>
          </div>
          <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-500 ring-1 ring-gray-200">
            Campos opcionales
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* N° Microchip (opcional: mascotas sin chip) */}
          <div>
            <Input
              label="N° Microchip"
              nombre="chip"
              placeHolder="15 dígitos del chip"
              maxLength={15}
              value={petData.chip}
              setData={(val) => handleChange('chip', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {petData.chip.length === 0
                  ? 'Sin microchip — puedes dejarlo vacío.'
                  : petData.chip.length < 15
                    ? `${petData.chip.length}/15 dígitos`
                    : 'Formato microchip válido.'}
              </span>
              {isValid(petData.chip.length === 15, petData.chip)}
            </div>
          </div>

          {/* RUT Propietario (opcional: mascotas rescatadas) */}
          <div>
            <Input
              label="RUT Propietario"
              nombre="rut"
              placeHolder="Ej: 12.345.678-9"
              maxLength={12}
              value={petData.rut}
              setData={(val) => handleChange('rut', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {petData.rut
                  ? 'Se aplicará formato automático al escribir.'
                  : '¿Mascota rescatada? — puedes dejarlo vacío.'}
              </span>
              {isValid(
                petData.rut.replace(/[^0-9kK]/g, '').length >= 8 &&
                  validateRutDv(petData.rut).valid === true,
                petData.rut
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Informacion Basica */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <FileText className="size-4.5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Información Básica
            </h2>
            <p className="text-xs text-gray-500">
              Datos de identidad básicos de la mascota.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Nombre */}
          <div>
            <Input
              label="Nombre"
              nombre="nombre"
              placeHolder="Ej: Copito"
              value={petData.nombre}
              setData={(val) => handleChange('nombre', val)}
              required
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {petData.nombre.length === 0
                  ? 'Nombre o apodo de la mascota.'
                  : petData.nombre.length < 3
                    ? 'Mínimo 3 caracteres.'
                    : petData.nombre.length > 30
                      ? 'Máximo 30 caracteres.'
                      : 'Nombre completado.'}
              </span>
              {isValid(
                petData.nombre.length >= 3 && petData.nombre.length <= 30,
                petData.nombre
              )}
            </div>
          </div>

          {/* Especie */}
          <div>
            <Dropdown
              label="Especie"
              readOnly={true}
              value={petData.especie}
              onChange={(val) => handleChange('especie', val)}
              options={[
                { value: 'perro', label: 'Perro' },
                { value: 'gato', label: 'Gato' },
              ]}
              required
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {petData.especie
                  ? 'Especie seleccionada.'
                  : 'Selecciona Perro / Gato.'}
              </span>
              {isValid(Boolean(petData.especie), petData.especie)}
            </div>
          </div>

          {/* Raza */}
          <div>
            <Input
              label="Raza"
              nombre="raza"
              placeHolder="Ej: Mestizo"
              value={petData.raza}
              setData={(val) => handleChange('raza', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {petData.raza.length === 0
                  ? 'Si no sabes puedes dejarlo vacío.'
                  : petData.raza.length < 3
                    ? 'Mínimo 3 caracteres.'
                    : petData.raza.length > 30
                      ? 'Máximo 30 caracteres.'
                      : 'Raza ingresada.'}
              </span>
              {isValid(
                petData.raza.length >= 3 && petData.raza.length <= 30,
                petData.raza
              )}
            </div>
          </div>

          {/* Fecha Nacimiento */}
          <div>
            <Input
              label="Fecha de Nacimiento"
              nombre="fechaNacimiento"
              type="date"
              value={petData.fechaNacimiento}
              setData={(val) => handleChange('fechaNacimiento', val)}
              required
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {petData.fechaNacimiento
                  ? `${petData.fechaNacimiento} — fecha elegida.`
                  : 'Usa fecha estimada si no la sabes.'}
              </span>
              {isValid(
                Boolean(petData.fechaNacimiento),
                petData.fechaNacimiento
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detalles Fisicos */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
              <HeartPulse className="size-4.5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Detalles Físicos y Salud
              </h2>
              <p className="text-xs text-gray-500">
                Indica los detalles físicos de la mascota y su estado de salud.
              </p>
            </div>
          </div>
          <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-500 ring-1 ring-gray-200">
            Campos opcionales
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Sexo */}
          <div>
            <Dropdown
              label="Sexo"
              readOnly={true}
              value={petData.sexo}
              onChange={(val) => handleChange('sexo', val)}
              options={[
                { value: 'macho', label: 'Macho' },
                { value: 'hembra', label: 'Hembra' },
              ]}
              required
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {petData.sexo
                  ? 'Sexo biológico seleccionado.'
                  : 'Selecciona Macho / Hembra.'}
              </span>
              {isValid(Boolean(petData.sexo), petData.sexo)}
            </div>
          </div>

          {/* Color */}
          <div>
            <Input
              label="Color / Pelaje"
              nombre="color"
              placeHolder="Ej: Negro con manchas blancas"
              value={petData.color}
              setData={(val) => handleChange('color', val)}
              required
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {petData.color.length === 0
                  ? 'Describe el color y patrón.'
                  : petData.color.length < 5
                    ? 'Describe un poco más.'
                    : 'Descripción de pelaje completada.'}
              </span>
              {isValid(petData.color.length >= 5, petData.color)}
            </div>
          </div>

          {/* Peso */}
          <div>
            <SafeNumberInput
              label="Peso (kg)"
              nombre="peso"
              placeHolder="Ej: 12,5"
              value={petData.peso}
              setData={(val) => handleChange('peso', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {!petData.peso
                  ? 'Usa coma o punto para decimales.'
                  : pesoClean(petData.peso) > 99.99 ||
                      isNaN(pesoClean(petData.peso))
                    ? 'Rango válido: 0.1 → 99.99 kg.'
                    : `${pesoClean(petData.peso).toFixed(2)} kg ingresados.`}
              </span>
              {isValid(
                Boolean(petData.peso) &&
                  !isNaN(pesoClean(petData.peso)) &&
                  pesoClean(petData.peso) > 0 &&
                  pesoClean(petData.peso) <= 99.99,
                petData.peso
              )}
            </div>
          </div>

          {/* Esterilizado */}
          <div>
            <Dropdown
              label="Esterilizado"
              value={petData.esterilizado}
              onChange={(val) => handleChange('esterilizado', val)}
              options={[
                { value: 'true', label: 'Sí' },
                { value: 'false', label: 'No' },
              ]}
              required
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {petData.esterilizado
                  ? 'Estatus de castración elegido.'
                  : 'Marca la opción correcta.'}
              </span>
              {isValid(Boolean(petData.esterilizado), petData.esterilizado)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
