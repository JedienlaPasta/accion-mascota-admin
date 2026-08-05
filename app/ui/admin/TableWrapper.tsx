import { Suspense } from 'react';
import { SecondaryButton } from '../components/Button';
import { ListFilter } from 'lucide-react';
import { SearchBar, SearchBarSkeleton } from '../components/SearchBar';

export default function TableWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md lg:col-span-3">
      <div className="flex items-center justify-between px-8 pt-8">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-4">
          <SecondaryButton className="gap-2 px-3! text-sm">
            <ListFilter className="h-4 w-4" />
            Filtros
          </SecondaryButton>
          <Suspense fallback={<SearchBarSkeleton />}>
            <SearchBar placeholder="Buscar" />
          </Suspense>
        </div>
      </div>
      {children}
    </div>
  );
}
