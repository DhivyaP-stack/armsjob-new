import React, { useCallback, useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Pagination } from "../../common/Pagination";
import { fetchTestimonialList } from "../../Commonapicall/settingsapicall/Testimonialapicall";
import { TestimonialTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/SettingsShimmer/TestimonialTableShimmer";
import { EditTestimonialPopup } from "../../components/TestimonialPopups/EditTestimonialPopup";
import { DeleteTestimonialPopup } from "../../components/TestimonialPopups/DeleteTestimonialPopup";

interface TestimonialTableProps {
    searchQuery?: string;
    refreshTrigger?: boolean;
}

export interface Testimonial {
    id: number;
    client_name: string;
    website: string;
    testimonial: string;
    status: string;
    created_at: string;
    is_deleted: boolean;
}

export interface TestimonialData {
    status: string;
    message: string;
    data: Testimonial[];
}

export interface TestimonialApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: TestimonialData;
}

export const TestimonialTable: React.FC<TestimonialTableProps> = ({ searchQuery = "", refreshTrigger }) => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [showTestimonialPopup, setShowEditTestimonialPopup] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
    const [showDeleteTestimonialPopup, setShowDeleteTestimonialPopup] = useState(false);
    const [TestimonialToDelete, setTestimonialToDelete] = useState<{ id: number } | null>(null);

    const loadTestimonial = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchTestimonialList(currentPage, searchQuery.trim(), itemsPerPage.toString()) as TestimonialApiResponse// Pass the page size as string);
            if (!response?.results?.data) {
                setTestimonials([]);
                setTotalCount(0);
                return;
            }
            setTestimonials(response?.results?.data);
            setTotalCount(response.count || 0);
        } catch (error) {
            console.error("Error fetching pagination data:", error);
            setTestimonials([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, itemsPerPage]);

    useEffect(() => {
        loadTestimonial();
    }, [currentPage, searchQuery, itemsPerPage, refreshTrigger]);


    const openEditTestimonialPopup = (job: any) => {
        setShowEditTestimonialPopup(true);
        setSelectedTestimonial(job);
    }

    const closeEditTestimonialPopup = () => {
        setShowEditTestimonialPopup(false)
    }

    const openDeleteTestimonialPopup = (testimonial: Testimonial, e: React.MouseEvent) => {
        e.stopPropagation();
        setTestimonialToDelete({ id: testimonial.id });
        setShowDeleteTestimonialPopup(true);
    };

    const closeDeleteTestimonialPopup = () => {
        setShowDeleteTestimonialPopup(false);
        setTestimonialToDelete(null);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1); // Reset to first page when items per page changes
    };
    return (
        <div className="p-4">
            {loading ? (
                <TestimonialTableShimmer />
            ) : (
                <>
                    <table className="w-full table-auto text-sm ">
                        <thead className="bg-main text-left text-armsWhite">
                            <tr className="whitespace-nowrap">
                                <th className="bg-main px-2 py-3">Testimonial ID</th>
                                <th className="bg-main px-2 py-3">Client Name</th>
                                <th className="bg-main px-2 py-3">Website</th>
                                <th className="bg-main px-2 py-3">Testimonial</th>
                                <th className="bg-main px-2 py-3">Status</th>
                                <th className="bg-main px-2 py-3">Created Date & Time</th>
                                <th className="bg-main px-2 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {testimonials.length > 0 ? (
                                testimonials.map((testimonial) => (
                                    <tr key={testimonial.id} className="border-b ">
                                        <td className="px-2 py-5 font-medium content-start">TEST456</td>
                                        <td className="px-2 py-5 font-medium content-start">{testimonial.client_name}</td>
                                        <td className="px-2 py-5 font-medium content-start">{testimonial.website}</td>
                                        <td className="px-3 py-5 w-[400px] font-medium content-start">
                                            {testimonial.testimonial}
                                        </td>
                                        <td className="px-2 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${testimonial.status
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {testimonial.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-5 font-medium content-start">{testimonial.created_at}</td>
                                        <td className="px-2 py-5 font-medium content-start flex gap-2">
                                            {/* Edit */}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditTestimonialPopup(testimonial)
                                                }}
                                                className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200"
                                            >
                                                <MdModeEdit className="text-white group-hover:text-armsjobslightblue text-xl" />
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditTestimonialPopup(testimonial)
                                                    }}
                                                    className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    Edit
                                                </div>
                                            </div>
                                            <div className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200">
                                                <MdDelete
                                                    onClick={(e) => openDeleteTestimonialPopup(testimonial, e)}
                                                    className="text-white group-hover:text-armsjobslightblue text-xl" />
                                                <div
                                                    onClick={(e) => openDeleteTestimonialPopup(testimonial,e)}
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
                                        No testimonials found
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
            {showTestimonialPopup && selectedTestimonial && (
                <EditTestimonialPopup
                    closePopup={closeEditTestimonialPopup}
                    editTestimonial={selectedTestimonial}
                    refreshData={loadTestimonial}
                />)}
            {showDeleteTestimonialPopup && TestimonialToDelete &&
                (<DeleteTestimonialPopup
                    closePopup={closeDeleteTestimonialPopup}
                    TestimonialData={TestimonialToDelete}
                    refreshData={loadTestimonial}
                />)}
        </div >
    );
};

