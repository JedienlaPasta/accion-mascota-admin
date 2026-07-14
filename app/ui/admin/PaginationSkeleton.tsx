export default function PaginationSkeleton({}) {
  return (
    <nav
      className="flex items-center justify-end border-t border-gray-200/70 bg-white px-4 sm:px-0"
      aria-label="Pagination"
    >
      <ul className="flex gap-2 p-2">
        {/* First Page */}
        <li>
          <div className="size-7 animate-pulse rounded-md bg-gray-200"></div>
        </li>
        {/* Arrow Left */}
        <li>
          <div className="size-7 animate-pulse rounded-md bg-gray-200"></div>
        </li>
        {/* Visible Pages */}

        <li>
          <div className="size-7 animate-pulse rounded-md bg-gray-200"></div>
        </li>
        <li>
          <div className="size-7 animate-pulse rounded-md bg-gray-200"></div>
        </li>
        <li>
          <div className="size-7 animate-pulse rounded-md bg-gray-200"></div>
        </li>

        {/* Arrow Right */}
        <li>
          <div className="size-7 animate-pulse rounded-md bg-gray-200"></div>
        </li>
        {/* Last Page */}
        <li>
          <div className="size-7 animate-pulse rounded-md bg-gray-200"></div>
        </li>
      </ul>
    </nav>
  );
}
