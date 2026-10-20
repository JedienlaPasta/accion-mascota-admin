import { getAppointmentById } from '@/app/_lib/data/citas';
import AppointmentDetailsModalNew, {
  ContentRenderer,
  LoadingContent,
} from './AppointmentDetailsModalNew';
import { Suspense } from 'react';
import { Appointment } from '@/app/_lib/data-types/citas';

export default function AppointmentDetails({ id }: { id: string }) {
  return (
    <AppointmentDetailsModalNew>
      <Suspense fallback={<LoadingContent />}>
        <AsyncDetails id={id} />
      </Suspense>
    </AppointmentDetailsModalNew>
  );
}

async function AsyncDetails({ id }: { id: string }) {
  const appointment: Appointment | null = await getAppointmentById(id);
  console.log(appointment);
  return <ContentRenderer appointment={appointment} />;
}
