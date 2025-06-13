import React, { useCallback, useEffect, useState } from "react"
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Pagination } from "../../common/Pagination";
import { EditBlogPopup } from "../../components/BlogPopups/EditBlogPopup";
import { BlogTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/SettingsShimmer/BlogTableShimmer";
import { fetchBlogsList } from "../../Commonapicall/settingsapicall/BlogTableaplicall";
import { DeleteBlogPopup } from "../../components/BlogPopups/DeleteBlogPopup";




interface BlogTableProps {
    searchQuery?: string;
    refreshTrigger?: boolean;
}

export interface BlogTable {
    id: number;
    date: string;
    title: string;
    blog_description: string;
    posted_by: string;
    status: string;
    created_at: string;
    is_deleted: boolean;
}



export interface BlogTableData {
    status: string;
    message: string;
    data: BlogTable[];
}

export interface JobPostingsApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: BlogTableData;
}

export const BlogTable: React.FC<BlogTableProps> = ({ searchQuery = "", refreshTrigger }) => {
    const [BlogTable, setBlogTable] = useState<BlogTable[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [showEditBlogPopup, setShowEditBlogPopup] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<any>(null);
    const [showDeleteBlogPopup, setShowDeleteBlogPopup] = useState(false);
    const [BlogToDelete, setBlogToDelete] = useState<{ id: number } | null>(null);


    const loadBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchBlogsList(currentPage, searchQuery.trim(), itemsPerPage.toString()) as JobPostingsApiResponse// Pass the page size as string);
            if (!response?.results?.data) {
                setBlogTable([]);
                setTotalCount(0);
                return;
            }
            setBlogTable(response?.results?.data);
            setTotalCount(response.count || 0);
        } catch (error) {
            console.error("Error fetching pagination data:", error);
            setBlogTable([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, itemsPerPage]);

    useEffect(() => {
        loadBlogs();
    }, [currentPage, searchQuery, itemsPerPage, refreshTrigger]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1); // Reset to first page when items per page changes
    };


    const openEditBlogPopup = (Blog: any) => {
        setShowEditBlogPopup(true);
        setSelectedBlog(Blog);
    }

    const closeEditBlogPopup = () => {
        setShowEditBlogPopup(false)
    }

    const openDeleteBlogPopup = (job: BlogTable, e: React.MouseEvent) => {
        e.stopPropagation();
        setBlogToDelete({ id: job.id });
        setShowDeleteBlogPopup(true);
    };

    const closeDeleteCandidatePopup = () => {
        setShowDeleteBlogPopup(false);
        setBlogToDelete(null);
    }


    return (
        <div>
            {loading ? (
                <BlogTableShimmer />
            ) : (
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
                            {BlogTable.length > 0 ? (
                                BlogTable.map((Blog) => (
                                    <tr key={Blog.id} className="border-b ">
                                        <td className="px-2 py-5 font-medium content-start">{Blog.id}</td>
                                        <td className="px-2 py-5 font-medium content-start">{Blog.date}</td>
                                        <td className="px-2 py-5 font-medium content-start">{Blog.title}</td>
                                        <td className="px-2 py-5 font-medium content-start">{Blog.blog_description}</td>
                                        <td className="px-2 py-5 font-medium content-start">{Blog.posted_by}</td>
                                        <td className="px-2 py-5 font-medium content-start">{Blog.status}</td>
                                        <td className="px-2 py-5 font-medium content-start">{Blog.created_at}</td>

                                        <td className="px-2 py-5 font-medium content-start flex gap-2">
                                            {/* Edit */}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row navigation
                                                    openEditBlogPopup(Blog); // Open the popup
                                                }}
                                                className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200"
                                            >
                                                <MdModeEdit className="text-white group-hover:text-armsjobslightblue text-xl" />
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row navigation
                                                        openEditBlogPopup(Blog); // Open the popup
                                                    }}
                                                    className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    Edit
                                                </div>
                                            </div>
                                            <div className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200">
                                                <MdDelete
                                                    onClick={(e) => openDeleteBlogPopup(Blog, e)}
                                                    className="text-white group-hover:text-armsjobslightblue text-xl" />
                                                <div
                                                    onClick={(e) => openDeleteBlogPopup(Blog, e)}
                                                    className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    Delete
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="px-2 py-5 text-center">
                                        No Blog Data found
                                    </td>
                                </tr>
                            )}
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
            )}
            {showEditBlogPopup && selectedBlog && (
                <EditBlogPopup
                    closePopup={closeEditBlogPopup}
                    editBlogTable={selectedBlog}
                    refreshData={loadBlogs}
                />)}
            {showDeleteBlogPopup && BlogToDelete &&
                (<DeleteBlogPopup
                    closePopup={closeDeleteCandidatePopup}
                    DeleteBlogData={BlogToDelete}
                    refreshData={loadBlogs}
                />)}
        </div >
    )
}


