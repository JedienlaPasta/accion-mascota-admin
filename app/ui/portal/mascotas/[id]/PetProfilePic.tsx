'use client';

import { uploadPetProfileImage } from '@/app/_lib/actions/s3-uploads';
import { UploadSecondaryButton } from '@/app/ui/components/Button';
import { Camera, Panda, PawPrint } from 'lucide-react';
import { useState } from 'react';

export default function PetProfilePic() {
  const PetIcon = PawPrint;

  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.set('profile-img', file);
      const url = await uploadPetProfileImage(formData);
      setImageUrl(url);
    } catch (error) {
      console.error('Error subiendo:', error);
      alert('Hubo un error subiendo la imagen');
    } finally {
      setLoading(false);
      e.currentTarget.value = '';
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Foto de Perfil</h2>
      <p className="text-muted-foreground mb-4 text-xs">
        Sube una foto clara de tu mascota (max. 2MB).
      </p>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-100 shadow-sm ring-4 ring-white">
          <Panda className="h-10 w-10 text-gray-400" />
        </div>
        <label aria-label="Cambiar foto">
          <UploadSecondaryButton className="gap-2 border-gray-200 bg-white px-3 text-xs hover:bg-gray-50">
            <Camera className="h-4 w-4" />
            Subir foto
          </UploadSecondaryButton>
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
