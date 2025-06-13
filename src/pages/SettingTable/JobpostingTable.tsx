import React, { useCallback, useEffect, useState } from "react"
import { MdDelete, MdModeEdit } from "react-icons/md";
import { fetchJobPostingsList } from "../../Commonapicall/settingsapicall/Jobpostingapicall";
import { EditJobPostingPopup } from "../../components/JobPostingpopups/EditJobPostingPopup";
import { DeleteJobPostingPopup } from "../../components/JobPostingpopups/DeleteJobPostingPopup";
import { Pagination } from "../../common/Pagination";
import { JobPostingTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/SettingsShimmer/JobPostingTableShimmer";

interface JobpostingTableProps {
    searchQuery?: string;
    refreshTrigger?: boolean;
}

export interface JobPosting {
    id: number;
    job_type: string;
    job_no: string;
    job_location: string;
    experience: string;
    salary: string;
    job_title: string;
    job_description: string;
    status: string;
    created_at: string;
    is_deleted: boolean;
}

export interface JobPostingsData {
  status: string;
  message: string;
  data: JobPosting[];
}

export interface JobPostingsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobPostingsData;
}
export const JobpostingTable: React.FC<JobpostingTableProps> = ({ searchQuery = "", refreshTrigger }) => {
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(false);
    const [showEditJobPostingPopup, setShowEditJobPostingPopup] = useState(false);
    const [selectedPosting, setSelectedJobPosting] = useState<any>(null);
    const [showDeleteJobPostingPopup, setShowDeleteJobPostingPopup] = useState(false);
    const [JobPostingToDelete, setJobPostingToDelete] = useState<{ id: number } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const loadJobPostings = useCallback(async () => {
        setLoading(true);
        try {
          const response = await fetchJobPostingsList(currentPage, searchQuery.trim(), itemsPerPage.toString()) as JobPostingsApiResponse// Pass the page size as string);
          if (!response?.results?.data) {
            setJobPostings([]);
            setTotalCount(0);
            return;
          }
          setJobPostings(response?.results?.data);
          setTotalCount(response.count || 0);
        } catch (error) {
          console.error("Error fetching pagination data:", error);
          setJobPostings([]);
          setTotalCount(0);
        } finally {
          setLoading(false);
        }
      }, [currentPage, searchQuery, itemsPerPage]);
    

    useEffect(() => {
        loadJobPostings();
    }, [currentPage, searchQuery,itemsPerPage, refreshTrigger]);

    const openEditJobPostingPopup = (job: any) => {
        setShowEditJobPostingPopup(true);
        setSelectedJobPosting(job);
    }

    const closeEditCategoryPopup = () => {
        setShowEditJobPostingPopup(false)
    }

    const openDeleteCategoryPopup = (job: JobPosting, e: React.MouseEvent) => {
        e.stopPropagation();
        setJobPostingToDelete({ id: job.id });
        setShowDeleteJobPostingPopup(true);
    };

    const closeDeleteCandidatePopup = () => {
        setShowDeleteJobPostingPopup(false);
        setJobPostingToDelete(null);
    }

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1); // Reset to first page when items per page changes
    };

    return (
        <div>
            {loading ? (
              <JobPostingTableShimmer/>
            ) : (
                <>
                    <table className="w-full table-auto text-sm">
                        <thead className="bg-main text-left">
                            <tr className="text-armsWhite whitespace-nowrap">
                                <th className="bg-main px-2 py-3">Job Type</th>
                                <th className="bg-main px-2 py-3">Job No</th>
                                <th className="bg-main px-2 py-3">Job Location</th>
                                <th className="bg-main px-2 py-3">Experience</th>
                                <th className="bg-main px-2 py-3">Salary</th>
                                <th className="bg-main px-2 py-3">Job Title</th>
                                <th className="bg-main px-2 py-3">Job description</th>
                                <th className="bg-main px-2 py-3">Status</th>
                                <th className="bg-main px-2 py-3">Created Date & Time</th>
                                <th className="bg-main px-2 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {jobPostings.length > 0 ? (
                                jobPostings.map((job) => (
                                    <tr key={job.id} className="border-b ">
                                        <td className="px-2 py-5 font-medium content-start">{job.job_type}</td>
                                        <td className="px-2 py-5 font-medium content-start">{job.job_no}</td>
                                        <td className="px-2 py-5 font-medium content-start">{job.job_location}</td>
                                        <td className="px-2 py-5 font-medium content-start">{job.experience}</td>
                                        <td className="px-2 py-5 font-medium content-start">{job.salary}</td>
                                        <td className="px-2 py-5 font-medium content-start">{job.job_title}</td>
                                        <td className="px-3 py-5 w-[380px] font-medium content-start">{job.job_description}</td>
                                        <td className="px-2 py-5 font-medium content-start">{job.status}</td>
                                        <td className="px-2 py-5 font-medium content-start">{job.created_at}</td>
                                        <td className="px-2 py-5 font-medium content-start flex gap-2">
                                            {/* Edit */}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row navigation
                                                    openEditJobPostingPopup(job); // Open the popup
                                                }}
                                                className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200"
                                            >
                                                <MdModeEdit className="text-white group-hover:text-armsjobslightblue text-xl" />
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row navigation
                                                        openEditJobPostingPopup(job); // Open the popup
                                                    }}
                                                    className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    Edit
                                                </div>
                                            </div>
                                            <div className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200">
                                                <MdDelete
                                                    onClick={(e) => openDeleteCategoryPopup(job, e)}
                                                    className="text-white group-hover:text-armsjobslightblue text-xl" />
                                                <div
                                                    onClick={(e) => openDeleteCategoryPopup(job, e)}
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
                                        No job postings found
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
            {showEditJobPostingPopup && selectedPosting && (
                <EditJobPostingPopup
                    closePopup={closeEditCategoryPopup}
                    editJobPosting={selectedPosting}
                    refreshData={loadJobPostings}
                />)}
            {showDeleteJobPostingPopup && JobPostingToDelete &&
                (<DeleteJobPostingPopup
                    closePopup={closeDeleteCandidatePopup}
                    JobPostingData={JobPostingToDelete}
                    refreshData={loadJobPostings}
                />)}
        </div>
    )
}
