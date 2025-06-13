export const CandidateBenchTableShimmer = () => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="text-left">
          <tr className="text-black whitespace-nowrap">
            <th className="border-b py-4 px-4"><div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div></th>
            <th className="border-b py-4 px-4 font-bold"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></th>
            <th className="border-b py-4 px-4 font-bold"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></th>
            <th className="border-b py-4 px-4 font-bold"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></th>
            <th className="border-b py-4 px-4 font-bold"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></th>
            <th className="border-b py-4 px-4 font-bold"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-t border-b hover:bg-gray-50">
              <td className="border-b py-4 px-4"><div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div></td>
              <td className="border-b py-4 px-4"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></td>
              <td className="border-b py-4 px-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
              <td className="border-b py-4 px-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
              <td className="border-b py-4 px-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
              <td className="border-b py-4 px-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};