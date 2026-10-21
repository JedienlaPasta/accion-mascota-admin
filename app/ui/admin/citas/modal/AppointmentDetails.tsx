import { getAppointmentById } from '@/app/_lib/data/citas';
import AppointmentDetailsModal, {
  ContentRenderer,
  LoadingContent,
} from './AppointmentDetailsModal';
import { Suspense } from 'react';
import { Appointment } from '@/app/_lib/data-types/citas';

export default function AppointmentDetails({ id }: { id: string }) {
  return (
    <AppointmentDetailsModal>
      <Suspense fallback={<LoadingContent />}>
        <AsyncDetails id={id} />
      </Suspense>
    </AppointmentDetailsModal>
  );
}

async function AsyncDetails({ id }: { id: string }) {
  const appointment: Appointment | null = await getAppointmentById(id);
  return <ContentRenderer appointment={appointment} />;
}
