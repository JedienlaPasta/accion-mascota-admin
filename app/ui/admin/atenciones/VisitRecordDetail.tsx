import { Suspense } from 'react';
import {
  type VisitDetails,
  getVisitDetailById,
} from '@/app/_lib/data/atenciones';
import VisitRecordDetailModal, {
  LoadingContent,
  ContentRenderer,
} from './VisitRecordDetailModal';

// No es async, por lo que no hace await bloqueante. El fetch real se hace DENTRO de <Suspense>.
export default function VisitRecordDetail({ id }: { id: string }) {
  return (
    <VisitRecordDetailModal>
      <Suspense fallback={<LoadingContent />}>
        <DetalleAsync id={id} />
      </Suspense>
    </VisitRecordDetailModal>
  );
}

// Server Child ASYNC (vive DENTRO de <Suspense>)
async function DetalleAsync({ id }: { id: string }) {
  const visit: VisitDetails | null = await getVisitDetailById(id);
  return <ContentRenderer visit={visit} />;
}
