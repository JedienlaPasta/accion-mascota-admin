export default function PaginationSkeleton({}) {
  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200/70 bg-white p-4"
      aria-label="Pagination"
    >
      <div className="h-3 w-40 animate-pulse rounded bg-gray-200/80"></div>
      <ul className="flex gap-2">
        {/* << */}
        <li>
          <div className="size-9 animate-pulse rounded-md bg-gray-100"></div>
        </li>
        {/* < */}
        <li>
          <div className="size-9 animate-pulse rounded-md bg-gray-100"></div>
        </li>

        {/* page */}
        <li>
          <div className="size-9 animate-pulse rounded-md bg-gray-200"></div>
        </li>
        {/* page */}
        <li>
          <div className="size-9 animate-pulse rounded-md bg-gray-100"></div>
        </li>
        {/* page */}
        <li>
          <div className="size-9 animate-pulse rounded-md bg-gray-100"></div>
        </li>
        {/* page */}
        <li>
          <div className="size-9 animate-pulse rounded-md bg-gray-200"></div>
        </li>

        {/* > */}
        <li>
          <div className="size-9 animate-pulse rounded-md bg-gray-200"></div>
        </li>
        {/* >> */}
        <li>
          <div className="size-9 animate-pulse rounded-md bg-gray-100"></div>
        </li>
      </ul>
    </nav>
  );
}
