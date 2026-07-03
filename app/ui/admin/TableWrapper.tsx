import { Suspense } from 'react';
import { SecondaryButton } from '../components/Button';
import { ListFilter } from 'lucide-react';
import SearchBar from './dashboard/SearchBar';

export default function TableWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-3">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-4">
          <SecondaryButton className="gap-2 px-3! text-sm">
            <ListFilter className="h-4 w-4" />
            Filtros
          </SecondaryButton>
          <Suspense
            fallback={
              <div className="flex h-10 min-w-52 flex-1 items-center rounded-lg border border-slate-200 bg-white px-4 shadow-sm" />
            }
          >
            <SearchBar placeholder="Buscar" />
          </Suspense>
        </div>
      </header>
      {children}
    </div>
  );
}
