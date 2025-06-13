import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Profileimg from "../../assets/images/profileimg.jpg"
import { Button } from "../../common/Button";
//import { AgentOrSupply } from "../../types/AgentSupplyList";
import { FaArrowLeft } from "react-icons/fa6";
import { EditAgentsSupplierPopup } from "./EditAgentSupplierPopup";
import { AgentSupplierViewShimmer } from "../../components/ShimmerLoading/ShimmerViewpage/CommonViewShimmer";
import { addAgentRemark, fetchAgents, fetchAgentsList, fetchAgentsListById } from "../../Commonapicall/AgentsSupplierapicall/Agentsapis";
import { AgentSupplier, ApiResponse } from "./AgentsSupplierTable";
import { toast } from "react-toastify";
import { z } from "zod";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";
import { StatusAgentsPopup } from "./AgentsStatusPopup";

export interface Agent {
    id: number;
    name: string;
}
export interface AgentSearchResponse {
    status: string;
    message: string;
    data: Agent[];
    count: number;
    next: string | null;
    previous: string | null;
}

const remarkSchema = z.object({
    remark: z.string().min(1, "Remark is required").max(500, "Remark must be less than 500 characters")
});


export const AgentSupplyView = () => {
    const { id } = useParams<{ id: string }>();
    const [newRemark, setNewRemark] = useState("");
    const [agentSupplier, setAgentSupplier] = useState<AgentSupplier[]>([]);
    const [searchQuer, setSearchQuer] = useState("");
    const [showEditAgentsSupplierPopup, setShowEditAgentsSupplierPopup] = useState(false);
    const [showAgentsStatusPopup, setShowAgentsStatusPopup] = useState(false);
    const [agent, setAgent] = useState<AgentSupplier | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(false);
    const [agentId, setAgentId] = useState<number | null>(null);
    const [remarkError, setRemarkError] = useState<string | null>(null);
    const [AgentsStatus, setAgentsstatus] = useState<{ id: number, name: string, currentStatus: boolean } | null>(null);

    const navigate = useNavigate();

    const openEditAgentsSupplierPopup = () => {
        setShowEditAgentsSupplierPopup(true);
    }
    const closeEditAgentsSupplierPopup = () => {
        setShowEditAgentsSupplierPopup(false)
    }

    // const openAgentsStatusPopup = () => {
    //     setShowAgentsStatusPopup(true);
    // }

    const openAgentsStatusPopup = (agent: AgentSupplier) => {
        setAgentsstatus({
            id: agent.id,
            name: agent.name,
            currentStatus: agent.status // assuming status is a boolean
        });
        setShowAgentsStatusPopup(true);
    }

    const closeAgentsStatusPopup = () => {
        setShowAgentsStatusPopup(false)
    }

    const handleSearch = async (query: string) => {
        try {
            const result = await fetchAgents(query);
            setAgents(result);
        } catch (err) {
            console.error("Search error", err);
        }
        // finally {
        //     setLoading(false);
        // }
    };

    useEffect(() => {
        if (searchQuer.trim().length > 0) {
            handleSearch(searchQuer);
        } else {
            setAgents([]); // Clear results if search is empty
        }
    }, [searchQuer]);

    const handleAddRemark = async () => {
        try {
            // Validate the remark
            const validationResult = remarkSchema.safeParse({ remark: newRemark });
            if (!validationResult.success) {
                const errorMessage = validationResult.error.errors[0]?.message || "Invalid remark";
                setRemarkError(errorMessage);
                toast.error(errorMessage);
                return;
            }
            if (!agent?.id) {
                toast.error("Agent ID is required");
                return;
            }
            setRemarkError(null);

            // Call the API to add the remark
            const response = await addAgentRemark(agent.id, newRemark);

            if (response) {
                // Create a new remark object with all required fields
                const newRemarkObj = {
                    id: Date.now(), // Use ID from response if available
                    remark: newRemark,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    agent_supplier_name: agent.name,
                    // Add any other required fields from your AgentRemark interface
                };
                // Update the local state with the new remark
                setAgent(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        agent_remarks: [...prev.agent_remarks, newRemarkObj]
                    };
                });
                // Clear the remark input
                setNewRemark("");
                toast.success("Remark added successfully");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to add remark";
            toast.error(errorMessage);
            console.error("Error adding remark:", error);
        }
    };

    const filteredCandidates = searchQuer.trim() ? agents : agentSupplier;

    useEffect(() => {
        const fetchAgent = async () => {
            setLoading(true);
            try {
                const response = await fetchAgentsList() as ApiResponse;
                console.log("response?.data?.data", response?.results?.data)
                setAgentSupplier(response?.results?.data);
                //setTotalItems(response.count);
            } catch (err) {
                console.error("Error fetching candidates:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAgent();
    }, []);

    useEffect(() => {
        if (id) {
            fetchAgentsListById(Number(id))
                .then(setAgent)
                .catch(err => console.error(err.message));
        }
    }, [id]);


    // Define fetchSingleAgent outside useEffect so it can be reused
    const fetchSingleAgent = async () => {
        try {
            if (id) {
                const response = await fetchAgentsListById(Number(id));
                setAgent(response);
                setAgentId(response.id);
            }
        } catch (err) {
            console.error("Error fetching agent by ID:", err);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchSingleAgent();
    }, [id]);

    // Handler for when agent is updated
    const handleAgentAdded = () => {
        fetchSingleAgent(); // Now this works correctly
    };

    const fetchStatus = () => {
        console.log("fetchStatus")
        navigate('/AgentsSupplier');
    }

    if (loading) {
        return <AgentSupplierViewShimmer />;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-white px-5 py-1 rounded-lg shadow-sm ">
                {/* Header */}
                <div className="flex justify-between items-center p-1">
                    <div className="flex items- p-3">
                        <span className="text-2xl font-bold">Agents/Supplier</span>
                        <span className="mx-2 pt-2 text-xl"><MdOutlineKeyboardArrowRight /></span>
                        <span className="text-gray-500 pt-2 text-sm font-medium underline">Dashboard</span>
                        <span className="mx-2 pt-2 text-sm">{"/"}</span>
                        <span className="text-gray-500 pt-2 text-sm font-medium ">Agents/Supplier</span>
                    </div>
                    <div className="flex items-center space-x-4 p-3">
                        <Button
                            buttonType="button"
                            buttonTitle="Back"
                            onClick={() => navigate(-1)}
                            icon={
                                <FaArrowLeft />
                            }
                            className="px-4 py-2 bg-armsWhite text-sm font-bold text-armsjobslightblue border-[1px] rounded-md cursor-pointer hover:bg-armsjobslightblue hover:text-armsWhite hover:border-armsWhite"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Left Column - Candidate Names */}
                    <div className="w-1/4 border-armsBlack border-1 rounded ">
                        <div className="bg-white rounded shadow-sm">
                            <div className="bg-main text-armsWhite p-4 ">
                                <h2 className="text-base font-semibold">Agents/Supplier Names ({filteredCandidates.length})</h2>
                            </div>
                            <div className="p-4">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuer}
                                    onChange={(e) => setSearchQuer(e.target.value)}
                                    className="w-full rounded-[5px] border-[1px] border-armsgrey pl-2 pr-2 py-1.5 focus-within:outline-none"
                                />
                                <div className="space-y-0 max-h-100% overflow-y-auto">
                                    {filteredCandidates.map((c) => (
                                        <Link
                                            key={c.id}
                                            // to={`/Candidate/${id}/${c.id}`}
                                            to={`/AgentSupplyView/${c.id}`}
                                            className={`block p-3 border-b ${c.id === Number(id)} hover:bg-gray-100
                                                    `}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex-grow">
                                                    <div className="text-sm font-medium">{c.name}</div>
                                                    {/* <div className="text-xs text-gray-500 mt-1">ID: {c.candidateId}</div> */}
                                                </div>
                                                {/* <div className={`w-2 h-2 rounded-full ${c.isActive ? 'bg-green-500' : 'bg-gray-400'}`} /> */}
                                            </div>
                                        </Link>
                                    ))}
                                    {filteredCandidates.length === 0 && (
                                        <div className="text-center py-4 text-gray-500">
                                            No Agents/Suppliers found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full bg-white border border-armsBlack rounded shadow-sm">
                        {/* Middle Column - Candidate Details */}
                        <div className="flex-[3] p-2">
                            <div className="p-0">
                                {/* Visa & Work Eligibility */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1 border-b pb-2">
                                        <h2 className="text-xl font-bold">Company Details</h2>
                                        <div className="flex items-center justify-end space-x-4"> {/* Added container for right-aligned items */}
                                            <div className="flex items-center space-x-2 cursor-pointer"
                                                onClick={() => agent && openAgentsStatusPopup(agent)}>
                                                <div className="flex items-center space-x-2">
                                                    {agent?.status === true ? (
                                                        <>
                                                            <PiToggleRightFill className="text-green-500 text-3xl cursor-pointer" />
                                                            <span className="text-green-600 text-sm cursor-pointer">Active</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PiToggleLeftFill className="text-red-500 text-3xl cursor-pointer" />
                                                            <span className="text-red-600 text-sm cursor-pointer">Inactive</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                onClick={openEditAgentsSupplierPopup}
                                                disabled={!agent?.status}
                                                buttonType="button"
                                                buttonTitle="Edit"
                                                //className="px-4 py-1 bg-armsjobslightblue text-sm text-armsWhite font-bold border-[1px] rounded-sm cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                                                className={`px-4 py-1 text-sm font-bold border-[1px] rounded-sm cursor-pointer ${agent?.status
                                                    ? 'bg-armsjobslightblue text-armsWhite hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue'
                                                    : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="grid grid-cols-3 gap-4 pt-2 w-full">
                                            <div>
                                                <p className="text-xs text-gray-600">Name of Agent/Supplier</p>
                                                <p className="text-sm font-bold mt-1">{agent?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600"> Mobile Number</p>
                                                <p className="text-sm font-bold mt-1">{agent?.mobile_no || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">WhatsApp Number</p>
                                                <p className="text-sm font-bold mt-1">{agent?.whatsapp_no || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Email ID</p>
                                                <p className="text-sm font-bold mt-1">{agent?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Eligibility & History */}
                                <div className="mb-6 ">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Eligibility & History</h2>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Can the agent do recruitment?</p>
                                            <p className="text-sm font-bold mt-1">{agent?.can_recruit || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Have you been associated earlier with ARMSJOBS?</p>
                                            <p className="text-sm font-bold mt-1">{agent?.associated_earlier || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Can the agent do manpower supplying?</p>
                                            <p className="text-sm font-bold mt-1">{agent?.can_supply_manpower || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Manpower info */}
                                <div className="mb-6 ">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Manpower info</h2>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Categories You Can Supply</p>
                                            <p className="text-sm font-bold mt-1">{agent?.supply_category_names || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Number of People You Can Supply</p>
                                            <p className="text-sm font-bold mt-1">{agent?.quantity_estimates || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Areas Covered</p>
                                            <p className="text-sm font-bold mt-1">{agent?.areas_covered || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Additional info */}
                                <div className="mb-6 ">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Additional info</h2>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Additional Notes (Category Rates & Recruitment Rates)</p>
                                            <p className="text-sm font-bold mt-1">{agent?.additional_notes || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Right Column - Remarks */}
                        <div className="flex-[1.5] p-2 ">
                            <div className="bg-gray-100 rounded shadow-sm">
                                <div className="bg-main text-armsWhite p-3 rounded-t flex justify-between items-center">
                                    <h2 className="text-base font-semibold">Remarks</h2>
                                </div>
                                <div className="p-4">
                                    <textarea
                                        value={newRemark}
                                        onChange={(e) => {
                                            setNewRemark(e.target.value);
                                            setRemarkError(null); // Clear error when user types
                                        }}
                                        className={`w-full p-3 border-2 ${remarkError ? 'border-red-500' : 'border-armsgrey'} rounded mb-2 text-sm bg-armsWhite`}
                                        rows={4}
                                        placeholder="Add a remark..."
                                    />
                                    {remarkError && (
                                        <p className="text-red-500 text-xs mb-2">{remarkError}</p>
                                    )}
                                    <Button
                                        onClick={handleAddRemark}
                                        buttonType="button"
                                        buttonTitle="Add"
                                        className="mx-auto px-4 py-1 bg-armsjobslightblue text-sm text-armsWhite font-semibold border-[1px] rounded-sm cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                                    />
                                    <div className="mt-4 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                                        {/*Remarks*/}
                                        {agent?.agent_remarks && agent.agent_remarks.length > 0 ? (
                                            agent.agent_remarks.map((comment, index) => (
                                                <div key={index} className="border-b pb-4">
                                                    <div className="flex max-xl:flex-col items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <img
                                                                    src={Profileimg}
                                                                    alt="profileImg"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium">{agent.name}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">  {new Date(comment.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{comment.remark}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">
                                                No remarks found
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* {showEditAgentsSupplierPopup && <EditAgentsSupplierPopup closePopup={closeEditAgentsSupplierPopup} />} */}
            {showEditAgentsSupplierPopup && agentId !== null &&
                <EditAgentsSupplierPopup
                    closePopup={closeEditAgentsSupplierPopup}
                    agentId={agentId}
                    onAgentAdded={handleAgentAdded}
                    refreshData={fetchAgentsList}
                />}

            {showAgentsStatusPopup && AgentsStatus && (
                <StatusAgentsPopup
                    closePopup={closeAgentsStatusPopup}
                    refreshData={fetchSingleAgent}
                    AgentData={AgentsStatus}
                    InactiveStatus={() => fetchStatus()}
                />
            )}
        </div>
        // </div>
    );
};