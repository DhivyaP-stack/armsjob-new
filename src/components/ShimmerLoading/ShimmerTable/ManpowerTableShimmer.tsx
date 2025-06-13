//import React from 'react';

export const ManpowerTableShimmer = () => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full table-auto text-sm">
                <thead className="bg-main text-left">
                    <tr className="bg-main text-left text-armsWhite whitespace-nowrap">
                        <th className="bg-main px-2 py-3  ">Manpower <br /> Supplier ID</th>
                        <th className="bg-main px-2 py-3 ">Company Name</th>
                        <th className="bg-main px-2 py-3 ">Contact Person<br />Name </th>
                        <th className="bg-main px-2 py-3 ">Mobile No</th>
                        <th className="bg-main px-2 py-3 ">WhatsApp No</th>
                        <th className="bg-main px-2 py-3 ">Email ID</th>
                        <th className="bg-main px-2 py-3 ">Office Location</th>
                        <th className="bg-main px-2 py-3 ">Catagorise Available</th>
                        <th className="bg-main px-2 py-3 ">Quantity per
                            <br />
                            Catagory
                        </th>
                        <th className="bg-main px-2 py-3 ">Upload Trade
                            <br />Licence
                        </th>
                        <th className="bg-main px-2 py-3 ">Upload Company<br />Licence (if any)(optional)</th>
                        <th className="bg-main px-2 py-3 ">Previous Experience in <br />Manpower Supply</th>
                        <th className="bg-main px-2 py-3 ">If Worked Earlier <br />With Arms</th>
                        <th className="bg-main px-2 py-3 ">Comments</th>
                        <th className="bg-main px-2 py-3 ">Status</th>
                        <th className="bg-main px-2 py-3 ">Created Date&Time</th>
                        <th className="bg-main px-2 py-3 sticky right-0 z-10">Actions</th>
                    </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                    {[...Array(5)].map((_, index) => (
                        <tr key={index} className="border-b-2 border-armsgrey">
                            <td className="px-2 py-7">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-2 py-1">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="px-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                            </td>
                            <td className="px-2 py-1 sticky right-0 z-10 bg-armsWhite">
                                <div className="flex items-center space-x-2">
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