import { useEffect, useState } from "react";
import { Button } from "../../common/Button";
import { FaUser } from "react-icons/fa6";
import { MdDelete, MdModeEdit, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Pagination } from "../../common/Pagination";
import { IoMdSearch } from "react-icons/io";
import { AddManpowerPopup } from "./AddManpowerSupplyPopup";
import { EditManpowerPopup } from "./EditManpowerSupplyPopup";
import { useNavigate } from "react-router-dom";
import { fetchManpowerList, fetchManPowerSupplyList } from "../../Commonapicall/ManpowerSupplyapicall/Manpowerapis";
import { DeleteManPowerPopup } from "./DeleteManPowerPopup";
import { ManpowerTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/ManpowerTableShimmer";
import { IoDocumentText } from "react-icons/io5";
import React from "react";
interface ManpowerRemark {
  id: number;
  remark: string;
  created_at: string;
  updated_at: string;
}
// Define a Candidate type
export interface ManpowerSupplier {
  id: number;
  supplier_id: string;
  company_name: string;
  contact_person_name: string;
  mobile_no: string;
  whatsapp_no: string;
  email: string;
  office_location: string;
  categories_available: string;
  categories_available_names:string;
  quantity_per_category: string;
  trade_license: string | null;
  company_license: string | null;
  previous_experience: boolean;
  worked_with_arms_before: boolean;
  comments: string | null;
  is_deleted: boolean;
  status: boolean;
  created_at: string;
  manpower_remarks: ManpowerRemark[]; // Adjust if you have a structure for remarks
}

export interface ManpowerSupplierResponse {
  // data: ManpowerSupplierResponse | PromiseLike<ManpowerSupplierResponse>;
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    status: string;
    message: string;
    data: ManpowerSupplier[];
  };
}

export interface SingleManpowerSupplierResponse {
  status: string;
  message: string;
  data: ManpowerSupplier[];
}
export const ManPowerSupplyTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 items per page
  const [showAddManpowerPopup, setShowAddManpowerPopup] = useState(false);
  const [showEditManpowerPopup, setShowEditManpowerPopup] = useState(false);
  const [search, setSearch] = useState<string>("")
  const [count, setCount] = useState<number>(1);
  const [filterBy, setFilterBy] = useState("all")
  const [status, setstatus] = useState("active")
  const [manPowersuppliers, setManPowerSuppliers] = useState<ManpowerSupplier[]>([]);
  const [showDeleteManPoweSupplierPopup, setShowDeleteManPowerPopup] = useState(false);
  const [ManPoweToDelete, setManPowerToDelete] = useState<{ id: number, name: string } | null>(null);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [selectedManpower, setSelectedManpower] = useState<any>(null);

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Show shimmer for 1.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    //dispatch(setCurrentPage(page));
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const openAddManpowerPopup = () => {
    setShowAddManpowerPopup(true);
  }

  const closeAddManpowerPopup = () => {
    setShowAddManpowerPopup(false)
  }

  const openEditManpowerPopup = (manpower: any) => {
    setSelectedManpower(manpower);
    setShowEditManpowerPopup(true);
  }

  const closeEditManpowerPopup = () => {
    setShowEditManpowerPopup(false)
  }

  const openDeleteManPowerPopup = (manPower: ManpowerSupplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setManPowerToDelete({ id: manPower.id, name: manPower.contact_person_name });
    setShowDeleteManPowerPopup(true);
  };

  const closeDeleteManPowerPopup = () => {
    setShowDeleteManPowerPopup(false);
    setManPowerToDelete(null);
  }

  const fetchPagination = async () => {
    try {
      setLoading(true);
      const response = await fetchManPowerSupplyList(currentPage, search.trim(), filterBy, itemsPerPage.toString(), status) as ManpowerSupplierResponse;
      console.log("hhhhhhhhhhhhhh", response)
      setManPowerSuppliers(response?.results?.data || []);
      setCount(response?.count || 1);
    } catch (error) {
      console.error("Error fetching pagination data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagination();
  }, [currentPage, search, filterBy, itemsPerPage, status]);


  const refreshAgentList = async () => {
    try {
      setLoading(true);
      const response = await fetchManpowerList() as ManpowerSupplierResponse;
      setManPowerSuppliers(response?.results?.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white px-5 py-1 rounded-lg shadow-sm ">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between pb-2 py-2 gap-y-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold">Manpower Supply</span>
            <span className="mx-2 pt-2 text-xl"><MdOutlineKeyboardArrowRight /></span>
            <span className="text-gray-500 pt-2 text-sm font-medium underline">Dashboard</span>
            <span className="mx-2 pt-2 text-sm">{"/"}</span>
            <span className="text-gray-500 pt-2 text-sm font-medium">Manpower Supply</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={openAddManpowerPopup}
              buttonType="button"
              buttonTitle="Manpower Supply"
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
            <select className="w-[170px] max-sm:!w-[197px] rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none cursor-pointer"
              value={filterBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBy(e.target.value)}
            >
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
            </select>
          </div>
        </div>
        {/* Table rendering */}
        <div className="w-full overflow-x-auto">
          {loading ? (
            <ManpowerTableShimmer />
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto text-sm ">
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
                    <th className="bg-main px-2 py-3 sticky right-0 z-10 max-sm:!static">Actions</th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {manPowersuppliers.length === 0 ? (
                    <td colSpan={12} className="text-center py-8">
                    <div className="text-center py-4">No Manpower found</div>
                    </td>
                  ) : (
                    manPowersuppliers.map((manpower, index) => (
                      <tr key={index}
                        onClick={() => navigate(`/ManpowerSupply/${manpower.id}`)}
                        className="border-b-2 border-armsgrey hover:bg-gray-100 cursor-pointer">
                        <td className="px-2 py-3">{manpower.supplier_id || "N/A"}</td>
                        <td className="px-2 py-3">{manpower.company_name || 'N/A'}</td>
                        <td className="px-2 py-3">{manpower.contact_person_name || "N/A"}</td>
                        <td className="px-2 py-3">{manpower.mobile_no || "N/A"}</td>
                        <td className="px-2 py-3">{manpower.whatsapp_no || "N/A"}</td>
                        <td className="px-2 py-3">{manpower.email || "N/A"}</td>
                        <td className="px-2 py-3">{manpower.office_location || "N/A"}</td>
                        <td className="px-2 py-3">{manpower.categories_available_names || "N/A"}</td>
                        <td className="px-2 py-3">{manpower.quantity_per_category || "N/A"}</td>
                        <td className="px-2 py-3">
                          <div className="text-armsjobslightblue flex text-lg items-center gap-1">
                            <IoDocumentText /> {manpower.trade_license}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="text-armsjobslightblue flex text-lg items-center gap-1">
                            <IoDocumentText /> {manpower.company_license}
                          </div>
                        </td>
                        <td className="px-2 py-3">{manpower.previous_experience ? 'Yes' : 'No'}</td>
                        <td className="px-2 py-3">{manpower.worked_with_arms_before ? 'Yes' : 'No'}</td>
                        <td className="px-2 py-3">{manpower.comments || "N/A"}</td>
                        <td className="px-2 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${manpower.status
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {manpower.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-2 py-3">{new Date(manpower.created_at).toLocaleString() || "N/A"}</td>

                        {/* Action buttons (like View / Edit) */}
                        <td className="px-2 py-3 sticky right-0 z-10 max-sm:!static bg-armsWhite border-b-2 border-armsgrey">
                          <td className="px-2 py-3">
                            <div className="flex items-center space-x-2">
                              {/* Edit Button */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row navigation
                                  openEditManpowerPopup(manpower); // Open the popup
                                }}
                                className="relative flex items-center justify-center border-[1px] border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white hover:border-armsjobslightblue transition-all duration-200">
                                <MdModeEdit className="text-white group-hover:text-armsjobslightblue text-xl" />
                                {/* Tooltip */}
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row navigation
                                    openEditManpowerPopup(manpower); // Open the popup
                                  }}
                                  className="absolute -top-6.5 bg-armsjobslightblue  text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                  Edit
                                </div>
                              </div>

                              {/* Delete Button */}
                              <div className="relative flex items-center justify-center border-[1px] border-armsjobslightblue 
                        rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white
                         hover:border-armsjobslightblue transition-all duration-200"
                                onClick={(e) => openDeleteManPowerPopup(manpower, e)}
                              >
                                <MdDelete className="text-white group-hover:text-armsjobslightblue text-xl" />
                                {/* Tooltip */}
                                <div
                                  onClick={(e) => openDeleteManPowerPopup(manpower, e)}
                                  className="absolute -top-6.5 bg-armsjobslightblue  text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                  Delete
                                </div>
                              </div>
                            </div>
                          </td>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalItems={count}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>

        {showAddManpowerPopup &&
          <AddManpowerPopup
            closePopup={closeAddManpowerPopup}
            // onAgentAdded={handleAgentAdded} 
            refreshData={refreshAgentList}
          />}

        {showEditManpowerPopup && selectedManpower &&
          <EditManpowerPopup
            closePopup={closeEditManpowerPopup}
            editManpowerSupply={selectedManpower}
            //supplierId={Number(manPowerId)} 
            //onUpdate={fetchPagination} 
            //onAgentAdded={handleAgentAdded} 
            refreshData={refreshAgentList}
          />}

        {showDeleteManPoweSupplierPopup && ManPoweToDelete && (<DeleteManPowerPopup closePopup={closeDeleteManPowerPopup} ManPowerData={ManPoweToDelete} refreshData={refreshAgentList} manpowerName={"ManPower/Supply"} />
        )}
      </div>
    </div>
  );
};





