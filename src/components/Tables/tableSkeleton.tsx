import React from "react";

function TableSkeleton() {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          <th className="px-4 py-4 font-medium text-black dark:text-white md:min-w-[220px] xl:pl-11">
            <div className="h-6 animate-pulse rounded bg-gray-300"></div>
          </th>
          <th className="px-4 py-4 font-medium text-black dark:text-white md:min-w-[150px]">
            <div className="h-6 animate-pulse rounded bg-gray-300"></div>
          </th>
          <th className="px-4 py-4 font-medium text-black dark:text-white md:min-w-[120px]">
            <div className="h-6 animate-pulse rounded bg-gray-300"></div>
          </th>
          <th className="px-4 py-4 font-medium text-black dark:text-white">
            <div className="h-6 animate-pulse rounded bg-gray-300"></div>
          </th>
          <th className="px-4 py-4 font-medium text-black dark:text-white">
            <div className="h-6 animate-pulse rounded bg-gray-300"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index}>
            <td className="border-b border-[#eee] px-4 py-5 xl:pl-11">
              <div className="h-6 animate-pulse rounded bg-gray-300"></div>
            </td>
            <td className="border-b border-[#eee] px-4 py-5">
              <div className="h-6 animate-pulse rounded bg-gray-300"></div>
            </td>
            <td className="border-b border-[#eee] px-4 py-5">
              <div className="h-6 animate-pulse rounded bg-gray-300"></div>
            </td>
            <td className="border-b border-[#eee] px-4 py-5">
              <div className="h-6 animate-pulse rounded bg-gray-300"></div>
            </td>
            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
              <div className="h-6 animate-pulse rounded bg-gray-300"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableSkeleton;
