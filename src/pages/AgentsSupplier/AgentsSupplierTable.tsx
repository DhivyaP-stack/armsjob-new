import { useEffect, useState } from "react";
import { Button } from "../../common/Button";
import { FaUser } from "react-icons/fa6";
import { MdDelete, MdModeEdit, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Pagination } from "../../common/Pagination";
import { IoMdSearch } from "react-icons/io";
import { AddAgentsSupplierPopup } from "./AddAgentsSupplierPopup";
import { EditAgentsSupplierPopup } from "./EditAgentSupplierPopup";
import { useNavigate } from "react-router-dom";
import { AgentSupplierTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/AgentSupplierTableShimmer";
import React from "react";
import { fetchAgentsList, fetchAgentsPageList } from "../../Commonapicall/AgentsSupplierapicall/Agentsapis";
import { DeleteAgentsPopup } from "./DeleteAgentsPopup";

export interface AgentSupplier {
  current_location: any;
  uae_experience_years: any;
  category: any;
  currently_employed: any;
  data: any;
  id: number;
  agent_supplier_id: string;
  name: string;
  mobile_no: string;
  whatsapp_no: string;
  email: string;
  can_recruit: boolean | null;
  associated_earlier: boolean | null;
  can_supply_manpower: boolean | null;
  supply_categories: string | null;
  supply_category_names: string | null;
  quantity_estimates: string | null;
  areas_covered: string | null;
  additional_notes: string | null;
  remarks: string | null;
  is_deleted: boolean;
  status: boolean;
  created_at: string;
  agent_remarks: {
    id: number;
    remark: string;
    agent_supplier_name: string;
    created_at: string;  // ISO date-time string
    updated_at: string;
  }[];
}


export interface ApiResponse {
  status: string;
  data: any;
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    status: string;
    message: string;
    data: AgentSupplier[];
  };
}

export const AgentSupplierTable = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [showAddAgentsSupplierPopup, setShowAddAgentsSupplierPopup] = useState(false);
  const [showEditAgentsSupplierPopup, setShowEditAgentsSupplierPopup] = useState(false);
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const [, setError] = useState<string | null>(null);
  const [showDeleteAgentsSupplierPopup, setShowDeleteAgentsPopup] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<{ id: number, name: string } | null>(null);
  ///const [selectedagents, setSelectedAgents] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [agents, setAgents] = useState<AgentSupplier[]>([]);
  const [count, setCount] = useState<number>(1);
  const [search, setSearch] = useState<string>("")
  const [filterBy, setFilterBy] = useState("all")
  const [status, setstatus] = useState("active")

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show shimmer for 1.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const openAddAgentsSupplierPopup = () => {
    setShowAddAgentsSupplierPopup(true);
  }

  const closeAddAgentsSupplierPopup = () => {
    setShowAddAgentsSupplierPopup(false)
  }

  const openEditAgentsSupplierPopup = (id: number) => {
    setSelectedAgentId(id);
    setShowEditAgentsSupplierPopup(true);
  }

  const closeEditAgentsSupplierPopup = () => {
    setSelectedAgentId(null);
    setShowDeleteAgentsPopup(false)
  }

  const openDeleteAgentsPopup = (agent: AgentSupplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setAgentToDelete({ id: agent.id, name: agent.name });
    setShowDeleteAgentsPopup(true);
  };

  const closeDeleteAgentsPopup = () => {
    setShowDeleteAgentsPopup(false);
    setAgentToDelete(null);
  }

  const fetchPagination = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAgentsPageList(currentPage, search.trim(), filterBy, itemsPerPage.toString(), status) as ApiResponse;
      setAgents(response?.results?.data || []);
      setCount(response?.count || 1);
    } catch (error) {
      console.error("Error fetching pagination data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPagination();
  }, [currentPage, search, filterBy, itemsPerPage, status]);

  const handleAgentAdded = () => {
    fetchPagination(); // Now this works correctly
  };

  // Add a refresh function to update the list after deletion
  const refreshAgentList = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAgentsList() as ApiResponse;
      setAgents(response?.results?.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch agents");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white px-5 py-1 rounded-lg shadow-sm ">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between pb-2 py-2 gap-y-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold">Manpower Supply /Agents </span>
            <span className="mx-2 pt-2 text-xl"><MdOutlineKeyboardArrowRight /></span>
            <span className="text-gray-500 pt-2 text-sm font-medium underline">Dashboard</span>
            <span className="mx-2 pt-2 text-sm">{"/"}</span>
            <span className="text-gray-500 pt-2 text-sm font-medium">Manpower Supply/Agents</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={openAddAgentsSupplierPopup}
              buttonType="button"
              buttonTitle="Manpower Supply/Agents"
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
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                placeholder="Search"
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

        {/* Show shimmer while loading */}
        {isLoading ? (
          <AgentSupplierTableShimmer />
        ) : (
          <>
            {/* Table rendering */}
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto text-sm ">
                <thead className="bg-main text-left">
                  <tr className="bg-main text-left text-armsWhite whitespace-nowrap">
                    <th className="bg-main px-2 py-3  ">Manpower Supply <br />Company/ Agents ID</th>
                    <th className="bg-main px-2 py-3 ">Company <br />Name</th>
                    <th className="bg-main px-2 py-3 ">Contact Person <br />Name</th>
                    <th className="bg-main px-2 py-3 ">Mobile No</th>
                    <th className="bg-main px-2 py-3 ">WhatsApp No</th>
                    <th className="bg-main px-2 py-3 ">Email ID</th>
                    <th className="bg-main px-2 py-3 ">Can the agent do <br />Recruitment?</th>
                    <th className="bg-main px-2 py-3 ">Can the agent do <br /> manpower supplying?</th>
                    <th className="bg-main px-2 py-3 ">Catogory you <br /> can supply </th>
                    <th className="bg-main px-2 py-3 ">Quantity <br />Estimate</th>
                    <th className="bg-main px-2 py-3 ">Area covered<br /> (Emirates)</th>
                    <th className="bg-main px-2 py-3 ">Additional notes(catogory<br />Rates & Recruitment Rates)</th>
                    <th className="bg-main px-2 py-3 ">Office Location</th>
                    <th className="bg-main px-2 py-3 ">Catagorise Available</th>
                    <th className="bg-main px-2 py-3 ">Quantity <br />per Catagory </th>
                    <th className="bg-main px-2 py-3 ">Upload Trade <br /> Licence</th>
                    <th className="bg-main px-2 py-3 ">Upload Company Licence <br />(if any)(optional)</th>
                    <th className="bg-main px-2 py-3 ">Previous Experience in <br /> Manpower Supply</th>
                    <th className="bg-main px-2 py-3 ">If Worked Earlier<br /> With Arms</th>
                    <th className="bg-main px-2 py-3 ">Comments</th>
                    <th className="bg-main px-2 py-3 ">Status</th>
                    <th className="bg-main px-2 py-3 ">Created Date&Time</th>
                    <th className="bg-main px-2 py-3 sticky right-0 z-10 max-sm:!static">Actions</th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap ">
                  {agents.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8">
                        <p className="text-center py-4">No agents/suppliers found</p>
                      </td>
                    </tr>
                  ) : (
                    agents.map((agent) => (
                      <tr key={agent.id}
                        onClick={() => navigate(`/AgentsSupplier/${agent.id}`)}
                        className="border-b-2 border-armsgrey hover:bg-gray-100 cursor-pointer">
                        <td className="px-2 py-5">{agent.agent_supplier_id || "N/A"}</td>
                         <td className="px-2 py-5">{" NULL "}</td>
                        <td className="px-2 py-5">{agent.name || "N/A"}</td>
                        <td className="px-2 py-5">{agent.mobile_no || "N/A"}</td>
                        <td className="px-2 py-5">{agent.whatsapp_no || "N/A"}</td>
                        <td className="px-2 py-5">{agent.email || "N/A"}</td>
                        <td className="px-2 py-5">{agent.can_recruit ? "yes" : "no"}</td>
                        {/* <td className="px-2 py-5">{agent.associated_earlier ? "yes" : "no"}</td> */}
                        <td className="px-2 py-5">{agent.can_supply_manpower ? "yes" : "no"}</td>
                        <td className="px-2 py-5">{agent.supply_category_names || "N/A"}</td>
                        <td className="px-2 py-5">{agent.quantity_estimates || "N/A"}</td>
                        <td className="px-2 py-5">{agent.areas_covered || "N/A"}</td>
                        <td className="px-2 py-5">{agent.additional_notes || "N/A"}</td>
                        <td className="px-2 py-5">{" NULL "}</td>
                        <td className="px-2 py-5">{" NULL "}</td>
                        <td className="px-2 py-5">{" NULL "}</td>
                        <td className="px-2 py-5">{" NULL "}</td>
                        <td className="px-2 py-5">{" NULL "}</td>
                        <td className="px-2 py-5">{" NULL "}</td>
                        <td className="px-2 py-5">{" NULL "}</td>
                        <td className="px-2 py-5">{" NULL "}</td>
                        <td className="px-2 py-5">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${agent.status
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {agent.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-2 py-5">{new Date(agent.created_at).toLocaleString()}</td>
                        <td className="px-2 py-5 sticky right-0 z-10 max-sm:!static bg-armsWhite border-b-2 border-armsgrey">

                          <div className="flex items-center space-x-2">
                            {/* Edit Button */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row navigation
                                openEditAgentsSupplierPopup(agent.id); // Open the popup
                              }}
                              className="relative flex items-center justify-center border-[1px] border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white hover:border-armsjobslightblue transition-all duration-200">
                              <MdModeEdit className="text-white group-hover:text-armsjobslightblue text-xl" />
                              {/* Tooltip */}
                              <div className="absolute -top-6.5 bg-armsjobslightblue  text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                Edit
                              </div>
                            </div>

                            {/* Delete Button */}
                            <div className="relative flex items-center justify-center border-[1px] border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white hover:border-armsjobslightblue transition-all duration-200">
                              <MdDelete className="text-white group-hover:text-armsjobslightblue text-xl"
                                onClick={(e) => openDeleteAgentsPopup(agent, e)}
                              />
                              {/* Tooltip */}
                              <div
                                onClick={(e) => openDeleteAgentsPopup(agent, e)}
                                className="absolute -top-6.5 bg-armsjobslightblue  text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
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
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={count}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </>
        )}
      </div>

      {showAddAgentsSupplierPopup &&
        <AddAgentsSupplierPopup
          closePopup={closeAddAgentsSupplierPopup}
          onAgentAdded={handleAgentAdded} />}

      {showEditAgentsSupplierPopup && selectedAgentId !== null && (
        <EditAgentsSupplierPopup
          closePopup={closeEditAgentsSupplierPopup}
          agentId={selectedAgentId}
          onAgentAdded={handleAgentAdded}
          refreshData={refreshAgentList}
        />
      )}

      {showDeleteAgentsSupplierPopup && agentToDelete &&
        (<DeleteAgentsPopup
          closePopup={closeDeleteAgentsPopup}
          agentData={agentToDelete}
          refreshData={refreshAgentList} />
        )}
    </div>
  );
};
