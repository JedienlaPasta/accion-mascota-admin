import Input from '@/app/ui/components/Input';
import { AtSign, FileText, Home } from 'lucide-react';

type NewOwnerFormProps = {
  ownerData: OwnerData;
  requirementsHint: (
    len: number,
    min: number,
    max: number,
    labelEmpty: string,
    labelDone: string
  ) => string;
  isValid: (cond: boolean) => React.ReactNode | null;
  handleChange: (
    key: keyof OwnerData,
    value: OwnerData[keyof OwnerData]
  ) => void;
};

type OwnerData = {
  rut: string;
  nombre: string;
  correoPersonal: string;
  correoContacto: string;
  fechaNacimiento: string;
  direccion: string;
  comuna: string;
  region: string;
  telefonoPersonal: string;
  telefonoContacto: string;
  rsh: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewOwnerForm({
  ownerData,
  isValid,
  requirementsHint,
  handleChange,
}: NewOwnerFormProps) {
  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Informacion Personal */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
            <FileText className="size-4.5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Información Personal
            </h2>
            <p className="text-xs text-gray-500">
              Datos de identidad básicos del nuevo propietario.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* RUT */}
          <div>
            <Input
              label="RUT"
              nombre="rut"
              placeHolder="Ej: 12.345.678-9"
              maxLength={12}
              value={ownerData.rut}
              setData={(val) => handleChange('rut', val)}
              required
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {ownerData.rut
                  ? 'Se aplicará formato automático al escribir. Revisa el validador →'
                  : 'RUT sin puntos ni guión también funciona (escribir solo números + DV).'}
              </span>
              {isValid(ownerData.rut.replace(/[^0-9kK]/g, '').length >= 8)}
            </div>
          </div>

          {/* Nombre Completo */}
          <div>
            <Input
              label="Nombre Completo"
              nombre="nombre"
              placeHolder="Ej: María Fernanda Rojas Pérez"
              value={ownerData.nombre}
              setData={(val) => handleChange('nombre', val)}
              required
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {requirementsHint(
                  ownerData.nombre.length,
                  3,
                  120,
                  'Nombre y apellidos completos.',
                  'Nombre ingresado.'
                )}
              </span>
              {isValid(
                ownerData.nombre.length >= 3 && ownerData.nombre.length <= 120
              )}
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <Input
              label="Fecha de Nacimiento"
              nombre="fechaNacimiento"
              type="date"
              value={ownerData.fechaNacimiento}
              setData={(val) => handleChange('fechaNacimiento', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {ownerData.fechaNacimiento
                  ? `${ownerData.fechaNacimiento} — fecha elegida.`
                  : 'Campo opcional, se usa solo si se conoce.'}
              </span>
              {isValid(Boolean(ownerData.fechaNacimiento))}
            </div>
          </div>

          {/* RSH */}
          <div>
            <Input
              label="Tramo RSH"
              nombre="rsh"
              placeHolder="Ej: 40 (solo números)"
              value={ownerData.rsh}
              maxLength={3}
              setData={(val) => handleChange('rsh', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {requirementsHint(
                  ownerData.rsh.length,
                  2,
                  3,
                  'Tramo del Registro Social de Hogares.',
                  'Tramo RSH registrado.'
                )}
              </span>
              {isValid(ownerData.rsh.length >= 2 && ownerData.rsh.length <= 3)}
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
              <AtSign className="size-4.5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Contacto</h2>
              <p className="text-xs text-gray-500">
                Correos para notificaciones y seguimiento.
              </p>
            </div>
          </div>
          <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-500 ring-1 ring-gray-200">
            Campos opcionales
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Correos Personal */}
          <div>
            <Input
              label="Correo Personal"
              nombre="correoPersonal"
              type="email"
              placeHolder="correo.personal@email.cl"
              value={ownerData.correoPersonal}
              setData={(val) => handleChange('correoPersonal', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {ownerData.correoPersonal &&
                !EMAIL_REGEX.test(ownerData.correoPersonal)
                  ? 'Formato email no válido (revisa @ y dominio).'
                  : ownerData.correoPersonal
                    ? 'Correo personal válido.'
                    : 'Principal correo del propietario.'}
              </span>
              {isValid(
                Boolean(
                  ownerData.correoPersonal &&
                  EMAIL_REGEX.test(ownerData.correoPersonal)
                )
              )}
            </div>
          </div>

          {/* Correos Contacto */}
          <div>
            <Input
              label="Correo de Contacto / Tercero"
              nombre="correoContacto"
              type="email"
              placeHolder="otro@email.cl (familiar, encargado)"
              value={ownerData.correoContacto}
              setData={(val) => handleChange('correoContacto', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {ownerData.correoContacto &&
                !EMAIL_REGEX.test(ownerData.correoContacto)
                  ? 'Formato email no válido.'
                  : ownerData.correoContacto
                    ? 'Correo alternativo registrado.'
                    : 'Si vive solo, puedes dejarlo vacío.'}
              </span>
              {isValid(
                Boolean(
                  ownerData.correoContacto &&
                  EMAIL_REGEX.test(ownerData.correoContacto)
                )
              )}
            </div>
          </div>

          {/* Telefono Personal */}
          <div>
            <div>
              <Input
                label="Teléfono / Celular - Personal"
                nombre="telefonoPersonal"
                placeHolder="Ej: 9 1234 5678"
                maxLength={9}
                value={ownerData.telefonoPersonal}
                setData={(val) => handleChange('telefonoPersonal', val)}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {!ownerData.telefonoPersonal
                  ? 'Ingresar un número de 9 dígitos (sin +56).'
                  : `${ownerData.telefonoPersonal}`}
              </span>
              {isValid(
                ownerData.telefonoPersonal.replace(/\D/g, '').length >= 9
              )}
            </div>
          </div>

          {/* Telefono Adicional */}
          <div>
            <div>
              <Input
                label="Teléfono / Celular - Contacto"
                nombre="telefonoContacto"
                placeHolder="Ej: 9 1234 5678"
                maxLength={9}
                value={ownerData.telefonoContacto}
                setData={(val) => handleChange('telefonoContacto', val)}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {!ownerData.telefonoContacto
                  ? 'Ingresar un número de 9 dígitos (sin +56).'
                  : `${ownerData.telefonoContacto}`}
              </span>
              {isValid(
                ownerData.telefonoContacto.replace(/\D/g, '').length >= 9
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Domicilio */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <Home className="size-4.5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Domicilio</h2>
            <p className="text-xs text-gray-500">
              Ubicación de pertenencia geográfica.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
          <div className="md:col-span-6">
            <Input
              label="Dirección Completa"
              nombre="direccion"
              placeHolder="Ej: Av. Peñablanca 404, Depto 404, Piso 4"
              maxLength={100}
              value={ownerData.direccion}
              setData={(val) => handleChange('direccion', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {requirementsHint(
                  ownerData.direccion.length,
                  5,
                  100,
                  'Calle + número + block/depto si corresponde.',
                  'Dirección registrada.'
                )}
              </span>
              {isValid(
                ownerData.direccion.length >= 5 &&
                  ownerData.direccion.length <= 100
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <Input
              label="Comuna"
              nombre="comuna"
              placeHolder="Ej: Algarrobo"
              value={ownerData.comuna}
              setData={(val) => handleChange('comuna', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {requirementsHint(
                  ownerData.comuna.length,
                  3,
                  80,
                  'Comuna de residencia.',
                  'Comuna registrada.'
                )}
              </span>
              {isValid(
                ownerData.comuna.length >= 3 && ownerData.comuna.length <= 80
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <Input
              label="Región"
              nombre="region"
              placeHolder="Ej: Valparaíso"
              value={ownerData.region}
              setData={(val) => handleChange('region', val)}
            />
            <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
              <span className="text-gray-500">
                {requirementsHint(
                  ownerData.region.length,
                  3,
                  80,
                  'Región de residencia.',
                  'Región registrada.'
                )}
              </span>
              {isValid(
                ownerData.region.length >= 3 && ownerData.region.length <= 80
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
