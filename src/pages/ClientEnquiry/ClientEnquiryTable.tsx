import { useCallback, useEffect, useState } from "react";
import { InputField } from "../../common/InputField";
import { Button } from "../../common/Button";
//import profileimg from "../../assets/images/profileimg.jpg"
import { FaUser } from "react-icons/fa6";
//import { FaSearch } from "react-icons/fa";
import { MdDelete, MdModeEdit, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Pagination } from "../../common/Pagination";
import { IoMdSearch } from "react-icons/io";
import { ClientEnquiryAddPopup } from "./AddClientEnquiryPopup";
import { EditClientEnquiryPopup } from "./EditClientEnquiryPopup";
import { useNavigate } from "react-router-dom";
import { filterClientEnquiryList } from "../../Commonapicall/ClientEnquiryapicall/ClientEnquiryapis"
import { ClientEnquiryTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/ClientEnquiryTableShimmer"
import { DeleteClientPopup } from "./DeleteClientEnquiryPopup";
import { NotifyError } from "../../common/Toast/ToastMessage";

interface ClientEnquiryList {
  id: number;
  client_enquiry_id: string;
  company_name: string;
  email: string;
  contact_person_name: string;
  mobile_number: string;
  nature_of_work: string;
  project_location: string;
  project_duration: string;
  categories_required: string;
  categories_required_names:string;
  quantity_required: string;
  project_start_date: string;
  kitchen_facility: boolean;
  transportation_provided: boolean;
  accommodation_provided: boolean;
  remarks: string | null;
  query_type: string;
  status: string;
  is_deleted: boolean;
  created_at: string;
}

export const ClientEnquiryTable = () => {
  const [clientEnquiry, setClientEnquiry] = useState<ClientEnquiryList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddClientEnquiryPopup, setShowAddClientEnquiryPopup] = useState<boolean>(false);
  const [showEditClientEnquiryPopup, setShowEditClientEnquiryPopup] = useState<boolean>(false);
  const [showDeleteClientPopup, setShowDeletedClientPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const indexOfLastClientEnquiry = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClientEnquiry - itemsPerPage;
  const currentClientEnquiry = clientEnquiry.slice(indexOfFirstClient, indexOfLastClientEnquiry);
  const [clientToDelete, setclientToDelete] = useState<{ id: string, name: string } | null>(null);
  const [search, setSearch] = useState("");
  console.log('search', search)
  const [filterBy, setFilterBy] = useState("");
  const [status, setstatus] = useState("active");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedClientEnquiry, setSelectedClientEnquiry] = useState<any>(null);



  //Get ClientEnquirylist, Pagination, search , All
  const fetchPagination = useCallback(async () => {
    setLoading(true);
    try {
      const response = await filterClientEnquiryList(currentPage, search.trim(), filterBy, itemsPerPage.toString(), status);
      if (!response?.results?.data) {
        setClientEnquiry([]);
        setTotalCount(0);
        return;
      }
      setClientEnquiry(response?.results?.data);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error("Error fetching pagination data:", error);
      setClientEnquiry([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filterBy, itemsPerPage, status]);

  useEffect(() => {
    fetchPagination();
  }, [fetchPagination]);

  // Debug log for current state
  useEffect(() => {
    console.log("Current clientEnquiry state:", clientEnquiry);
    console.log("Current page items:", currentClientEnquiry);
  }, [clientEnquiry, currentClientEnquiry]);

  //refreshClientList
  const refreshClientList = async () => {
    try {
      setLoading(true);
      const response = await filterClientEnquiryList(currentPage, search.trim(), filterBy, itemsPerPage.toString(), status);
      setClientEnquiry(response?.results?.data);
    } catch (err) {
      NotifyError(err instanceof Error ? err.message : "Failed to fetch clientEnquiry");
    } finally {
      setLoading(false);
    }
  };

  const openAddClientEnquiryPopup = () => {
    setShowAddClientEnquiryPopup(true)
  }

  const closeAddClientEnquiryPopup = () => {
    setShowAddClientEnquiryPopup(false)
  }

  const openEditClientEnquiryPopup = (clientEnquiry: any) => {
    setShowEditClientEnquiryPopup(true)
    setSelectedClientEnquiry(clientEnquiry);
  }

  const closeEditClientEnquiryPopup = () => {
    setShowEditClientEnquiryPopup(false)
  }

  const openDeleteClientPopup = (client: ClientEnquiryList, e: React.MouseEvent) => {
    e.stopPropagation();
    setclientToDelete({ id: client.id.toString(), name: client.contact_person_name });
    setShowDeletedClientPopup(true);
  };

  const closeDeleteAgentsPopup = () => {
    setShowDeletedClientPopup(false);
    setclientToDelete(null);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    //dispatch(setCurrentPage(page));
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  return (
    <div className="p-6">
      <div className="bg-white px-5 py-1 rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between pb-2 py-2 gap-y-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold">Client Enquiry</span>
            <span className="mx-2 pt-2 text-xl"><MdOutlineKeyboardArrowRight /></span>
            <span className="text-gray-500 pt-2 text-sm font-medium underline">Dashboard</span>
            <span className="mx-2 pt-2 text-sm">{"/"}</span>
            <span className="text-gray-500 pt-2 text-sm font-medium">Client Enquiry</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={openAddClientEnquiryPopup}
              buttonType="button"
              buttonTitle="Client Enquiry"
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
              <InputField
                type="text"
                placeholder="Search" value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="w-full rounded-[5px] border-[1px] border-armsgrey pl-2 pr-2 py-1.5 focus-within:outline-none"
                label=""
              />
              <IoMdSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-armsgrey text-[18px]" />
            </div>

            {/* Select Dropdown */}
            <select
              value={filterBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBy(e.target.value)}
              className="w-[170px] max-sm:!w-[197px] rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none cursor-pointer">
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="thismonth">This Month</option>
              <option value="lastyear">Last Year</option>
            </select>
            <select
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setstatus(e.target.value)}
              className="w-[170px] max-sm:!w-[197px] rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none cursor-pointer">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="Onhold">Onhold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        {/* Table rendering */}
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto text-sm">
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={15} className="text-center py-4">
                    <ClientEnquiryTableShimmer />
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                <thead className="bg-main text-left">
                  <tr className="bg-main text-left text-armsWhite whitespace-nowrap">
                    <th className="bg-main px-2 py-3  ">Company Name</th>
                    <th className="bg-main px-2 py-3 ">Contact <br /> Person name</th>
                    <th className="bg-main px-2 py-3 ">Mobile No</th>
                    <th className="bg-main px-2 py-3 ">Email ID</th>
                    <th className="bg-main px-2 py-3 ">Nature of work</th>
                    <th className="bg-main px-2 py-3 ">Project
                      <br />duration</th>
                    <th className="bg-main px-2 py-3 ">Project
                      <br />
                      location</th>
                    <th className="bg-main px-2 py-3 ">Do you provide
                      <br />
                      Kitchen facilities
                    </th>
                    <th className="bg-main px-2 py-3 ">Do you provide
                      <br />
                      transportation
                    </th>
                    <th className="bg-main px-2 py-3 ">Do you provide
                      <br />
                      Accommodation
                    </th>

                    <th className="bg-main px-2 py-3 ">Catogory of staff</th>
                    <th className="bg-main px-2 py-3 ">Qty required<br /> in each trade</th>
                    <th className="bg-main px-2 py-3 ">Status</th>
                    <th className="bg-main px-2 py-3 ">Created Date&Time</th>
                    <th className="bg-main px-2 py-3 sticky right-0 z-10 max-sm:!static">Actions</th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {currentClientEnquiry.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="text-center py-4">
                        No client enquiries found
                      </td>
                    </tr>
                  ) : (
                    currentClientEnquiry.map((client) => (
                      <tr
                        key={client.id}
                        onClick={() => navigate(`/ClientEnquiry/${client.id}`)}
                        className="border-b-2 border-armsgrey hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="px-2 py-2">{client.company_name || 'N/A'}</td>
                        <td className="px-2 py-2">{client.contact_person_name || 'N/A'}</td>
                        <td className="px-2 py-2">{client.mobile_number || 'N/A'}</td>
                        <td className="px-2 py-2">{client.email || 'N/A'}</td>
                        <td className="px-2 py-2">{client.nature_of_work || 'N/A'}</td>
                        <td className="px-2 py-2">{client.project_duration || 'N/A'}</td>
                        <td className="px-2 py-2">{client.project_location || 'N/A'}</td>
                        <td className="px-2 py-2">
                          {client.kitchen_facility ? 'yes' : 'no'}
                        </td>
                        <td className="px-2 py-2">
                          {client.transportation_provided ? 'yes' : 'no'}
                        </td>
                        <td className="px-2 py-2">
                          {client.accommodation_provided ? 'yes' : 'no'}
                        </td>
                        <td className="px-2 py-2">{client.categories_required_names || 'N/A'}</td>
                        <td className="px-2 py-2">{client.quantity_required || 'N/A'}</td>
                        <td className="px-2 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${client.status
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {client.status ? 'Active' : 'Inactive' }
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          {client.created_at ? new Date(client.created_at).toLocaleString() : '-'}
                        </td>
                        <td className="px-2 py-3 sticky right-0 z-10 max-sm:!static bg-armsWhite border-b-2 border-armsgrey">
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditClientEnquiryPopup(client);
                              }}
                              className="relative flex items-center justify-center border-[1px] border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white hover:border-armsjobslightblue transition-all duration-200"
                            >
                              <MdModeEdit className="text-white group-hover:text-armsjobslightblue text-xl" />
                              <div
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row navigation
                                  openEditClientEnquiryPopup(client); // Open the popup
                                }}
                                className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                Edit
                              </div>
                            </div>

                            <div className="relative flex items-center justify-center border-[1px] border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white hover:border-armsjobslightblue transition-all duration-200">
                              <MdDelete
                                onClick={(e) => openDeleteClientPopup(client, e)}
                                className="text-white group-hover:text-armsjobslightblue text-xl" />
                              <div
                                onClick={(e) => openDeleteClientPopup(client, e)}
                                className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                Delete
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </>
            )}
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
      {showAddClientEnquiryPopup &&
        (<ClientEnquiryAddPopup
          closePopup={closeAddClientEnquiryPopup}
          refreshData={refreshClientList}
        />)}

      {showEditClientEnquiryPopup && selectedClientEnquiry &&
        (<EditClientEnquiryPopup
          closePopup={closeEditClientEnquiryPopup}
          editClientEnquiry={selectedClientEnquiry}
          refreshData={refreshClientList}
        />)}

      {showDeleteClientPopup && clientToDelete &&
        (<DeleteClientPopup
          closePopup={closeDeleteAgentsPopup}
          ClientData={clientToDelete}
          refreshData={refreshClientList}
        />)}
    </div>
  );
};
