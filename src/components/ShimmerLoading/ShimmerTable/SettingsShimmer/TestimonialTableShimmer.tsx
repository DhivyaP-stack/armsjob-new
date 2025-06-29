export const TestimonialTableShimmer = () => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full table-auto text-sm">
                <thead className="bg-main text-left">
                    <tr className="text-armsWhite whitespace-nowrap">
                        <th className="bg-main px-2 py-3">Testimonial ID</th>
                        <th className="bg-main px-2 py-3">Client Name</th>
                        <th className="bg-main px-2 py-3">Website</th>
                        <th className="bg-main px-2 py-3">Testimonial</th>
                        <th className="bg-main px-2 py-3">Status</th>
                        <th className="bg-main px-2 py-3">Created Date & Time</th>
                        <th className="bg-main px-2 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                    {[...Array(5)].map((_, index) => (
                        <tr key={index} className="border-b-2 border-armsgrey">
                            <td className="px-2 py-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-2 py-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-2 py-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-3 py-5 w-[400px]">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-2 py-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-2 py-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-2 py-3 bg-armsWhite">
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};