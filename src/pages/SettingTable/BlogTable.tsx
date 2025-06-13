import React, { useState } from "react"
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Pagination } from "../../common/Pagination";

export const BlogTable: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    function openEditCategoryPopup(): void {
        throw new Error("Function not implemented.");
    }
    function openDeleteCategoryPopup(): void {
        throw new Error("Function not implemented.");
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1); // Reset to first page when items per page changes
    };

    return (
        <div>
            <>
                <table className="w-full table-auto text-sm">
                    <thead className="bg-main text-left">
                        <tr className="text-armsWhite whitespace-nowrap">
                            <th className="bg-main px-2 py-3">Blog Id</th>
                            <th className="bg-main px-2 py-3">Date</th>
                            <th className="bg-main px-2 py-3">Title</th>
                            <th className="bg-main px-2 py-3">Blog Description</th>
                            <th className="bg-main px-2 py-3">Posted By</th>
                            <th className="bg-main px-2 py-3">Status</th>
                            <th className="bg-main px-2 py-3">Created Date & Time</th>
                            <th className="bg-main px-2 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        <tr className="border-b ">
                            <td className="px-2 py-5 font-medium content-start">B050525</td>
                            <td className="px-2 py-5 font-medium content-start">09 April 2025</td>
                            <td className="px-2 py-5 font-medium content-start">The Pros and Cons of Permanent Recruitment: A Complete Guide</td>
                            <td className="px-3 py-5 w-[350px] font-medium content-start">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut faucibus, mauris et viverra
                                ultrices, mi augue molestie orci, eu imperdiet lacus ipsum at lacus. Nunc non facilisis
                                arcu. Maecenas non lobortis massa. Nam vehicula malesuada lacus, vitae tristique eros
                                rutrum in. Nunc quis ante vel metus ullamcorper interdum sit amet viverra mi.
                            </td>
                            <td className="px-2 py-5 font-medium content-start">Amjad</td>
                            <td className="px-2 py-5 font-medium content-start">Active</td>
                            <td className="px-2 py-5 font-medium content-start">14-02-2025 10:25:12</td>
                            <td className="px-2 py-5 font-medium content-start flex gap-2">
                                {/* Edit */}
                                <div
                                    onClick={() => openEditCategoryPopup()}
                                    className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200"
                                >
                                    <MdModeEdit className="text-white group-hover:text-armsjobslightblue text-xl" />
                                    <div
                                        onClick={() => openEditCategoryPopup()}
                                        className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                        Edit
                                    </div>
                                </div>
                                <div className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200">
                                    <MdDelete
                                        onClick={() => openDeleteCategoryPopup()}
                                        className="text-white group-hover:text-armsjobslightblue text-xl" />
                                    <div
                                        onClick={() => openDeleteCategoryPopup()}
                                        className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                        Delete
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            </>
        </div >
    )
}
