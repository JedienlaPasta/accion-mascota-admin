import { s3Client } from '@/app/_lib/s3';
import { formatFileSize } from '@/app/_lib/utils/format';
import PetProfilePic from '@/app/ui/portal/mascotas/[id]/PetProfilePic';
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async function ListadoDeImagenesDeMascotas() {
  let validImages: { key: string; url: string; name: string; size: number }[] =
    [];

  try {
    // Obtener lista de todos los objetos en el bucket 'mascotas'
    const listCommand = new ListObjectsV2Command({ Bucket: 'mascotas' });
    const { Contents } = await s3Client.send(listCommand);
    console.log('length:', Contents?.length);

    // Si hay archivos, generar las URLs pre-firmadas
    if (Contents && Contents.length > 0) {
      const imagePromises = Contents.map(async (item) => {
        if (!item.Key) return null;

        const name = item.Key.split('-').pop() || item.Key;
        const size = item.Size || 0;

        const url = await getSignedUrl(
          s3Client,
          new GetObjectCommand({ Bucket: 'mascotas', Key: item.Key }),
          { expiresIn: 60 * 5 }
        );

        return { key: item.Key, url, name, size };
      });

      // Resolver todas las promesas en paralelo y filtrar posibles nulos
      const resolvedImages = await Promise.all(imagePromises);
      validImages = resolvedImages.filter(
        (
          img
        ): img is { key: string; url: string; name: string; size: number } =>
          img !== null
      );
    }
  } catch (error) {
    console.error('Error obteniendo imágenes de SeaweedFS:', error);
    return (
      <div>Error al cargar la galería de imágenes. Verifica la consola.</div>
    );
  }

  return (
    <div className="p-8">
      <PetProfilePic />
      <h2 className="mt-8">Listado De Imágenes De Mascotas</h2>

      {validImages.length === 0 ? (
        <p>No hay imágenes subidas aún.</p>
      ) : (
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {validImages.map((img) => (
            <div
              key={img.key}
              className="border-border rounded-lg border bg-gray-50 p-2"
            >
              {/* img normal por ser un link temporal, Next/Image requeriría configurar remotePatterns */}
              <img
                src={img.url}
                alt={img.key}
                className="aspect-square w-full rounded-md object-cover"
              />
              <span className="flex items-baseline justify-between px-2 py-1">
                <p className="text-muted-foreground mt-2 text-xs">{img.name}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  {formatFileSize(img.size)}
                </p>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
