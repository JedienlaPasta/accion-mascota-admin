import {
  type VisitDetails,
  getVisitDetailById,
} from '@/app/_lib/data/atenciones';
import VisitRecordDetailModal from './VisitRecordDetailModal';

export default async function VisitRecordDetail({ id }: { id: string }) {
  const visit: VisitDetails | null = await getVisitDetailById(id);
  //   console.log(visit);
  // Si no existe -> modal 404
  if (!visit) {
    return <VisitRecordDetailModal visit={null} notFound />;
  }

  return <VisitRecordDetailModal visit={visit} notFound={false} />;
}
