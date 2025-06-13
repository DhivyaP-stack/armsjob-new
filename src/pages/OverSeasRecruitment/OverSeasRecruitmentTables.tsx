import { useState, useEffect, useCallback } from "react";
import { Button } from "../../common/Button";
import { FaUser } from "react-icons/fa6";
import { MdDelete, MdModeEdit, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Pagination } from "../../common/Pagination";
import { IoMdSearch } from "react-icons/io";
import { OverSeasAddPopup } from "./AddOverSeasRecruitmentPopup";
import { EditOverSeasPopup } from "./EditOverSeasRecruitment";
import { useNavigate } from "react-router-dom";
import { fetchOverseasRecruitmentList } from "../../Commonapicall/Overseasapicall/Overseasapis";
import { OverseasRecruitmentTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/OverseasRecruitmentTableShimmer";
import { DeleteOverseasRecruitmentPopup } from "./DeleteOverseasRecruitmentPopup";
import { IoDocumentText } from "react-icons/io5";

// Define a Candidate type
interface OverseasRecruitmentAgency {
  id: number;
  overseas_recruitment_id: string;
  company_name: string;
  country: string;
  contact_person_name: string;
  mobile_no: string;
  whatsapp_no: string | null;
  email_address: string;
  categories_you_can_provide: string;
  categories_you_can_provide_names:string;
  nationality_of_workers: string;
  mobilization_time: string;
  uae_deployment_experience: boolean;
  relevant_docs: string | null;
  comments: string | null;
  status: boolean;
  created_at: string;
}

export const OverSeasRecruitmentTable = () => {
  const [recruitmentAgencies, setRecruitmentAgencies] = useState<OverseasRecruitmentAgency[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showOverSeasPopup, setShowOverSeasPopup] = useState<boolean>(false);
  const [showEditOverSeasPopup, setShowEditOverSeasPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [status, setstatus] = useState("active");
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [recruitmentToDelete, setRecruitmentToDelete] = useState<{ id: number, name: string } | null>(null);
  const [selectedOverseas, setSelectedOverseas] = useState<OverseasRecruitmentAgency | null>(null);

  //Pagination
  const fetchPagination = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchOverseasRecruitmentList(currentPage, search.trim(), filterBy, itemsPerPage.toString(), status );
      if (!response?.results?.data) {
        setRecruitmentAgencies([]);
        setTotalCount(0);
        return;
      }
      setRecruitmentAgencies(response.results.data);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error("Error fetching pagination data:", error);
      setRecruitmentAgencies([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filterBy, itemsPerPage, status]);

  useEffect(() => {
    fetchPagination();
  }, [fetchPagination]);

  const openOverseasPopup = () => {
    setShowOverSeasPopup(true);
  };

  const closeOverseasPopup = () => {
    setShowOverSeasPopup(false);
  };

  const openEditOverseasPopup = (agency: OverseasRecruitmentAgency) => {
    setShowEditOverSeasPopup(true);
    setSelectedOverseas(agency);
  };

  const closeEditOverseasPopup = () => {
    setShowEditOverSeasPopup(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const openDeletePopup = (agency: OverseasRecruitmentAgency, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecruitmentToDelete({ id: agency.id, name: agency.contact_person_name });
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setRecruitmentToDelete(null);
  };

  return (
    <div className="p-6">
      <div className="bg-white px-5 py-1 rounded-lg shadow-sm ">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between pb-2 py-2 gap-y-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold">Overseas Recruitment</span>
            <span className="mx-2 pt-2 text-xl"><MdOutlineKeyboardArrowRight /></span>
            <span className="text-gray-500 pt-2 text-sm font-medium underline">Dashboard</span>
            <span className="mx-2 pt-2 text-sm">{"/"}</span>
            <span className="text-gray-500 pt-2 text-sm font-medium">Overseas Recruitment</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={openOverseasPopup}
              buttonType="button"
              buttonTitle="Overseas Recruitment"
              icon={
                <div className="flex items-center gap-1">
                  <div className="relative w-4 h-4">
                    <FaUser className="w-4 h-4 text-current" />
                    <span className="absolute -top-1.5 -left-2 text-current text-[15px] font-bold">+</span>
                  </div>
                </div>
              }
              className="flex items-center gap-2 bg-armsjobslightblue text-armsWhite border border-armsjobslightblue rounded px-4 py-2 font-bold  hover:text-armsjobslightblue hover:bg-armsWhite transition-colors duration-200 cursor-pointer"
            />

            {/* Search Input */}
            <div className="relative w-[300px] max-sm:!w-auto">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="w-full rounded-[5px] border-[1px] border-armsgrey pl-2 pr-2 py-1.5 focus-within:outline-none"
              />
              <IoMdSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-armsgrey text-[18px]" />
            </div>

            {/* Select Dropdown */}
            <select
              className="w-[170px] max-sm:!w-[197px] rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none cursor-pointer"
              value={filterBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBy(e.target.value)}
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last 7 days">Last 7 days</option>
              <option value="last 30 days">Last 30 days</option>
              <option value="this month">This Month</option>
              <option value="last year">Last Year</option>
            </select>
            <select
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setstatus(e.target.value)}
              className="w-[170px] max-sm:!w-[197px] rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none cursor-pointer">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        {/* Table rendering */}
        <div className="w-full overflow-x-auto">
          {loading ? (
            <OverseasRecruitmentTableShimmer />
          ) : (
            <table className="w-full table-auto text-sm">
              <thead className="bg-main text-left">
                <tr className="bg-main text-left text-armsWhite whitespace-nowrap">
                  <th className="bg-main px-2 py-3">Overseas<br /> Recruitment ID</th>
                  <th className="bg-main px-2 py-3">Company Name</th>
                  <th className="bg-main px-2 py-3">Country</th>
                  <th className="bg-main px-2 py-3">Contact Person<br />Name</th>
                  <th className="bg-main px-2 py-3">Mobile No</th>
                  <th className="bg-main px-2 py-3">WhatsApp No</th>
                  <th className="bg-main px-2 py-3">Email ID</th>
                  <th className="bg-main px-2 py-3">Categories you<br /> can Provide</th>
                  <th className="bg-main px-2 py-3">Nationality of <br />Workers</th>
                  <th className="bg-main px-2 py-3">Mobilization<br />Time</th>
                  <th className="bg-main px-2 py-3">UAE Deployment<br />Experience</th>
                  <th className="bg-main px-2 py-3">Relevant Documents</th>
                  <th className="bg-main px-2 py-3">Comments</th>
                  <th className="bg-main px-2 py-3">Status</th>
                  <th className="bg-main px-2 py-3">Created Date&Time</th>
                  <th className="bg-main px-2 py-3 sticky right-0 z-10 max-sm:!static">Actions</th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap">
                {recruitmentAgencies.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="text-center py-8">
                      <p className="text-center py-4">No Overseas recruitment found</p>
                    </td>
                  </tr>
                ) : (
                  recruitmentAgencies.map((agency) => (
                    <tr key={agency.id}
                      onClick={() => navigate(`/OverSeasRecruitment/${agency.id}`)}
                      className="border-b-2 border-armsgrey hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="px-2 py-7">{agency.overseas_recruitment_id}</td>
                      <td className="px-2 py-7">{agency.company_name || 'N/A'}</td>
                      <td className="px-2 py-7">{agency.country || 'N/A'}</td>
                      <td className="px-2 py-7">{agency.contact_person_name || 'N/A'}</td>
                      <td className="px-2 py-7">{agency.mobile_no || 'N/A'}</td>
                      <td className="px-2 py-7">{agency.whatsapp_no || 'N/A'}</td>
                      <td className="px-2 py-7">{agency.email_address || 'N/A'}</td>
                      <td className="px-2 py-7">{agency.categories_you_can_provide_names || 'N/A'}</td>
                      <td className="px-2 py-7">{agency.nationality_of_workers || 'N/A'}</td>
                      <td className="px-2 py-7">{agency.mobilization_time || 'N/A'}</td>
                      <td className="px-2 py-7">{agency.uae_deployment_experience ? 'Yes' : 'No'}</td>
                      <td className="px-2 py-7">
                        {agency.relevant_docs ? (
                          <a href={agency.relevant_docs} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                           <IoDocumentText />
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td className="px-2 py-7">{agency.comments || 'N/A'}</td>
                      <td className="px-2 py-7">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${agency.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {agency.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-2 py-7">{new Date(agency.created_at).toLocaleString()}</td>
                      <td className="px-2 py-3 sticky right-0 z-10 max-sm:!static bg-armsWhite border-b-2 border-armsgrey">
                        <div className="flex items-center space-x-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditOverseasPopup(agency);

                            }}
                            className="relative flex items-center justify-center border-[1px] border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white hover:border-armsjobslightblue transition-all duration-200"
                          >
                            <MdModeEdit className="text-white group-hover:text-armsjobslightblue text-xl" />
                            <div className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                              Edit
                            </div>
                          </div>

                          <div className="relative flex items-center justify-center border-[1px] border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white hover:border-armsjobslightblue transition-all duration-200">
                            <MdDelete
                              onClick={(e) => openDeletePopup(agency, e)}
                              className="text-white group-hover:text-armsjobslightblue text-xl"
                            />
                            <div className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                              Delete
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
      
      {showOverSeasPopup && 
      <OverSeasAddPopup 
      closePopup={closeOverseasPopup} 
      refreshData={fetchPagination} />}

      {showEditOverSeasPopup && selectedOverseas && 
      <EditOverSeasPopup 
      closePopup={closeEditOverseasPopup} 
      refreshData={fetchPagination} 
      editOverseas={selectedOverseas}
      />}

      {showDeletePopup && recruitmentToDelete && (
        <DeleteOverseasRecruitmentPopup
          closePopup={closeDeletePopup}
          recruitmentData={recruitmentToDelete}
          refreshData={fetchPagination}
        />
      )}
    </div>
  );
};
