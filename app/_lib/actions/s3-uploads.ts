'use server';

import { s3Client } from '../s3';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function uploadPetProfileImage(
  formData: FormData
): Promise<string> {
  const file = formData.get('profile-img');
  if (!file) {
    throw new Error('No se seleccionó ninguna imagen');
  }

  if (!(file instanceof File)) {
    throw new Error('Archivo inválido');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: 'mascotas',
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: 'mascotas', Key: fileName }),
    { expiresIn: 60 * 5 }
  );

  return url;
}
