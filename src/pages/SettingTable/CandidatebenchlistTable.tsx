import React, { useCallback, useEffect, useState } from "react";
import { Pagination } from "../../common/Pagination";
import { fetchCandidateBenchList } from "../../Commonapicall/settingsapicall/CandidateBenchapicall";
import { CandidateBenchTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/SettingsShimmer/CandidateBenchTableShimmer";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { EditCandidateBenchListPopup } from "../../components/CandidateBenchPopups/EditCandidateBenchListPopup";
import { DeleteCandidateBenchPopup } from "../../components/CandidateBenchPopups/DeleteCandidateBenchPopup";

interface CandidateBenchTableProps {
  searchQuery?: string;
  refreshTrigger?: boolean;
}

export interface CandidateBench {
  id: number;
  name: string;
  technology: string;
  experience: string;
  availability: string;
  location: string;
  status: boolean;
  created_at: string;
  is_deleted: boolean;
}

export interface CandidateBenchData {
  status: string;
  message: string;
  data: CandidateBench[];
}

export interface CandidateBenchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CandidateBenchData;
}

export const CanditebenchlistTable: React.FC<CandidateBenchTableProps> = ({ searchQuery = "", refreshTrigger }) => {
  const [candidateData, setcandidateData] = useState<CandidateBench[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("IT");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEditCandidateBenchPopup, setShowEditCandidateBenchPopup] = useState(false);
  const [selectedCandidateBench, setSelectedCandidateBench] = useState<any>(null);
  const [showDeleteCandidateBenchPopup, setShowDeleteCandidateBenchPopup] = useState(false);
  const [CandidateBenchToDelete, setCandidateBenchToDelete] = useState<{ id: number } | null>(null);

  const loadCandidateBench = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCandidateBenchList(currentPage, searchQuery.trim(), itemsPerPage.toString()) as CandidateBenchResponse// Pass the page size as string);
      if (!response?.results?.data) {
        setcandidateData([]);
        setTotalCount(0);
        return;
      }
      setcandidateData(response?.results?.data);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error("Error fetching pagination data:", error);
      setcandidateData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, itemsPerPage, refreshTrigger]);

  useEffect(() => {
    loadCandidateBench();
  }, [currentPage, searchQuery, itemsPerPage, refreshTrigger]);

  const openEditCandidateBenchPopup = (candidatebench: any) => {
    setShowEditCandidateBenchPopup(true);
    setSelectedCandidateBench(candidatebench);
  }

  const closeEditCandidateBenchPopup = () => {
    setShowEditCandidateBenchPopup(false)
  }

  const openDeleteCandidateBenchPopup = (candidatebench: CandidateBench, e: React.MouseEvent) => {
    e.stopPropagation();
    setCandidateBenchToDelete({ id: candidatebench.id });
    setShowDeleteCandidateBenchPopup(true);
  };

  const closeDeleteTestimonialPopup = () => {
    setShowDeleteCandidateBenchPopup(false);
    setCandidateBenchToDelete(null);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  return (
    <div className="p-6 space-y-10">
      {/* Dropdown */}
      <div className="w-[200px]">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-400 rounded px-4 py-2 w-full"
        >
          <option value="IT">IT</option>
          <option value="Engineers&Technicians">Engineers & Technicians</option>
          <option value="Electricians">Electricians</option>
          <option value="Plumbers">Plumbers</option>
          <option value="Welders&Fabricators">Welders & Fabricators</option>
        </select>
      </div>

      {/* Description Text */}
      <p className="text-gray-600">
        Sodales adipiscing semper litora cras ut vulputate eu viverra erat volutpat. Placerat vestibulum luctus neque lacus class aptent tellus lorem phasellus suspendisse urna.
      </p>

      {/* Candidate Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <CandidateBenchTableShimmer />
        ) : (
          <>
            <table className="w-200 text-sm">
              <thead className=" text-left">
                <tr className="text-black">
                  <th className="border-b py-4"><input type="checkbox" /></th>
                  <th className="border-b py-4 font-bold  ">Name</th>
                  <th className="border-b py-4 font-bold ">Technology</th>
                  <th className="border-b py-4 font-bold ">Experience</th>
                  <th className="border-b py-4 font-bold ">Availability</th>
                  <th className="border-b py-4 font-bold ">Location</th>
                  <th className="border-b py-4 font-bold ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidateData.length > 0 ? (
                  candidateData.map((item, index) => (
                    <tr key={index} className="border-t border-b">
                      <td className="border-b py-4 px-4"><input type="checkbox" /></td>
                      <td className="border-b py-4 px-4">{item.name}</td>
                      <td className="border-b py-4 px-4">{item.technology}</td>
                      <td className="border-b py-4 px-4">{item.experience}</td>
                      <td className="border-b py-4 px-4">{item.availability}</td>
                      <td className="border-b py-4 px-4">{item.location}</td>
                      {/* <td className="border-b py-4 px-4">
                        <button className="text-blue-500 hover:underline mr-2">Edit</button>
                        <button className="text-red-500 hover:underline">Delete</button>
                      </td> */}
                      <td className="border-b py-4 px-4">
                        <div className="flex items-center gap-2"> {/* Flex container with spacing */}
                          {/* Edit Button */}
                          <div className="relative flex items-center justify-center border border-armsjobslightblue rounded-full p-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200">
                            <MdModeEdit
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditCandidateBenchPopup(item)
                              }}
                              className="text-white group-hover:text-armsjobslightblue text-xl" />
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditCandidateBenchPopup(item)
                              }}
                              className="absolute -top-7 bg-armsjobslightblue text-white text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                              Edit
                            </div>
                          </div>

                          {/* Delete Button */}
                          <div className="relative flex items-center justify-center border border-armsjobslightblue rounded-full p-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200">
                            <MdDelete 
                            onClick={(e) => openDeleteCandidateBenchPopup(item, e)}
                            className="text-white group-hover:text-armsjobslightblue text-xl" />
                            <div 
                            onClick={(e) => openDeleteCandidateBenchPopup(item, e)}
                            className="absolute -top-7 bg-armsjobslightblue text-white text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                              Delete
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-5 text-center text-gray-500">
                      No Candidate Bench found
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
        {showEditCandidateBenchPopup && selectedCandidateBench && (
          <EditCandidateBenchListPopup
            closePopup={closeEditCandidateBenchPopup}
            editCandidateBench={selectedCandidateBench}
            refreshData={loadCandidateBench}
          />)}
        {showDeleteCandidateBenchPopup && CandidateBenchToDelete &&
          (<DeleteCandidateBenchPopup
            closePopup={closeDeleteTestimonialPopup}
            CandidateBenchData={CandidateBenchToDelete}
            refreshData={loadCandidateBench}
          />)}
      </div>
    </div>
  );
};
