import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Profileimg from "../../assets/images/profileimg.jpg"
import { IoDocumentText } from "react-icons/io5";
import { Button } from "../../common/Button";
import { FaArrowLeft } from "react-icons/fa6";
import { EditOverSeasPopup } from "./EditOverSeasRecruitment";
import { fetchRecruitmentNames, fetchOverseasRecruitmentData, fetchOverseasRecruitmentDataByID, addOverseasRemark } from "../../Commonapicall/Overseasapicall/Overseasapis";
import { AgentSupplierViewShimmer } from "../../components/ShimmerLoading/ShimmerViewpage/CommonViewShimmer";
import { z } from "zod";
import { toast } from "react-toastify";
import { StatusOverseasPopup } from "./OverseasStatusPopup";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";

interface OverseasRecruitment {
    id: number;
    overseas_recruitment_id: string;
    company_name: string;
    country: string;
    contact_person_name: string;
    mobile_no: string;
    whatsapp_no: string;
    email_address: string;
    categories_you_can_provide: string;
    categories_you_can_provide_names:string;
    nationality_of_workers: string;
    mobilization_time: string;
    uae_deployment_experience: boolean;
    comments: string;
    relevant_docs: string | null;
    status: boolean;
    created_at: string;
    recruitment_remarks: {
        id: number;
        remark: string;
        company_name: string;
        created_at: string;
        updated_at: string;
    }[];
}

export interface ApiResponse {
    status: string;
    message: string;
    data: OverseasRecruitment[];
    count: number;
    next: string | null;
    previous: string | null;
}

interface SingleOverseasResponse {
    data: OverseasRecruitment;
}

// Add this before the component
const remarkSchema = z.object({
    remark: z.string().min(1, "Remark is required").max(500, "Remark must be less than 500 characters")
});

export const OverSeasRecruitmentView = () => {
    const { id } = useParams<{ id: string }>();
    const [overSeasDetail, setOverSeasDetail] = useState<OverseasRecruitment[]>([]);
    const [newRemark, setNewRemark] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showEditOverSeasPopup, setShowEditOverSeasPopup] = useState<boolean>(false);
    const [showOverseasStatusPopup, setShowOverSeasStatusPopup] = useState<boolean>(false);
    const [overseasStatus, setoverseasStatus] = useState<{ id: number, name: string, currentStatus: boolean } | null>(null);
    const [oversea, setOversea] = useState<OverseasRecruitment | null>(null);
    const [overseaoption, setOverseaoption] = useState<OverseasRecruitment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const navigate = useNavigate();
    const [remarkError, setRemarkError] = useState<string | null>(null);

    // Function to fetch overseas recruitment data
    const fetchOverseasRecruitment = async () => {
        setIsLoading(true); // Show loading state
        try {
            const response = await fetchOverseasRecruitmentData() as ApiResponse;
            if (response && response.data) {
                setOverSeasDetail(response.data);
            }
        } catch (error) {
            console.error('Error fetching overseas recruitment:', error);
        } finally {
            setIsLoading(false); // Hide loading state
        }
    }

    // Fetch data for a specific recruitment by ID
    const fetchOverseasRecruitmentID = async (recruitmentId: number) => {
        if (!recruitmentId) return;

        try {
            const response = await fetchOverseasRecruitmentDataByID(recruitmentId) as SingleOverseasResponse;
            if (response && response.data) {
                setOversea(response.data);
            }
        } catch (error) {
            console.error('Error fetching overseas recruitment:', error);
        }
    }

    // Initial load of the selected ID
    useEffect(() => {
        if (id && initialLoad) {
            setIsLoading(true);
            fetchOverseasRecruitmentID(Number(id)).finally(() => {
                setIsLoading(false);
                setInitialLoad(false);
            });
        }
    }, [id, initialLoad]);

    useEffect(() => {
        fetchOverseasRecruitment();
    }, []);

    const filteredOverseas = searchQuery.trim() ? overseaoption : overSeasDetail;

    // Add missing handleSearch function
    const handleSearch = async (query: string) => {
        // Implement search functionality here
        try {
            const result = await fetchRecruitmentNames(query) as ApiResponse;
            if (result && result.data) {
                setOverseaoption(result.data);
            }
        } catch (error) {
            console.error('Error fetching overseas recruitment:', error);
        }
    };

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            handleSearch(searchQuery);
        } else {
            setOverseaoption([]); // Clear results if search is empty
        }
    }, [searchQuery]);

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
            if (!oversea?.id) {
                toast.error("Overseas recruitment ID is required");
                return;
            }
            setRemarkError(null);
            // Call the API to add the remark
            const response = await addOverseasRemark(oversea.id, newRemark);
            console.log(response);
            if (response) {
                // Clear the remark input
                setNewRemark("");
                // Refresh the data to show the new remark
                await fetchOverseasRecruitmentID(oversea.id);
                toast.success("Remark added successfully");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to add remark";
            toast.error(errorMessage);
            console.error("Error adding remark:", error);
        }
    };

    const openEditOverseasPopup = () => {
        setShowEditOverSeasPopup(true)
    }

    const closeEditOverseasPopup = () => {
        setShowEditOverSeasPopup(false);
        setIsLoading(true); // Show loading state
        fetchOverseasRecruitmentID(Number(id)).finally(() => {
            setIsLoading(false);
        });
    }

    const openOverseasStatusPopup = (oversea: OverseasRecruitment) => {
        setoverseasStatus({
            id: oversea.id,
            name: oversea.contact_person_name,
            currentStatus: oversea.status // assuming status is a boolean
        });
        setShowOverSeasStatusPopup(true);
    }

    const closeoverseasStatusPopup = () => {
        setShowOverSeasStatusPopup(false)
    }

    // Direct navigation and data loading handler for contact click
    const handleContactClick = async (recruitmentId: number, e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`/OverSeasRecruitment/${recruitmentId}`);
        setIsLoading(true);
        await fetchOverseasRecruitmentID(recruitmentId);
        setIsLoading(false);
    };

    const fetchStatus = () => {
        console.log("fetchStatus")
        navigate('/OverseasRecruitment');
    }

    if (isLoading && initialLoad) {
        return <AgentSupplierViewShimmer />;
    }

    if (!oversea) {
        return <AgentSupplierViewShimmer />;
    }

    return (
        // <div className="min-h-screen bg-gray-100">
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-white px-5 py-1 rounded-lg shadow-sm ">
                {/* Header */}
                <div className="flex justify-between items-center p-1">
                    <div className="flex items- p-3">
                        <span className="text-2xl font-bold">OverSeas Recruitment</span>
                        <span className="mx-2 pt-2 text-xl"><MdOutlineKeyboardArrowRight /></span>
                        <span className="text-gray-500 pt-2 text-sm font-medium underline">Dashboard</span>
                        <span className="mx-2 pt-2 text-sm">{"/"}</span>
                        <span className="text-gray-500 pt-2 text-sm font-medium ">OverSeas Recruitment</span>
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
                                <h2 className="text-base font-semibold">Contact Person Names ({filteredOverseas.length})</h2>
                            </div>
                            <div className="p-4">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-[5px] border-[1px] border-armsgrey pl-2 pr-2 py-1.5 focus-within:outline-none"
                                />
                                <div className="space-y-0 max-h-100% overflow-y-auto">
                                    {filteredOverseas.length > 0 ? filteredOverseas.map((c) => (
                                        <div
                                            key={c.id}
                                            onClick={(e) => handleContactClick(c.id, e)}
                                            className={`block p-3 border-b ${c.id === Number(id) ? 'bg-gray-100' : ''} hover:bg-gray-100 cursor-pointer`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex-grow">
                                                    <div className="text-sm font-medium">{c.contact_person_name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-4 text-gray-500">
                                            No Contacts found
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
                                <div className="mb-6 ">
                                    <div className="flex items-center justify-between mb-1 border-b pb-2">
                                        <h2 className="text-xl font-bold">Company Details</h2>
                                        <div className="flex items-center justify-end space-x-4"> {/* Added container for right-aligned items */}
                                            <div className="flex items-center space-x-4 ml-4"
                                                onClick={() => oversea && openOverseasStatusPopup(oversea)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    {oversea?.status === true ? (
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
                                                onClick={openEditOverseasPopup}
                                                disabled={!oversea?.status}
                                                buttonType="button"
                                                buttonTitle="Edit"
                                                //className="px-4 py-1 bg-armsjobslightblue text-sm text-armsWhite font-semibold border-[1px] rounded-sm cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                                                className={`px-4 py-1 text-sm font-bold border-[1px] rounded-sm cursor-pointer ${oversea?.status
                                                    ? 'bg-armsjobslightblue text-armsWhite hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue'
                                                    : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-start  ">
                                        <div className="grid grid-cols-3 gap-4 pt-2 w-full">
                                            <div>
                                                <p className="text-xs text-gray-600">Company Name</p>
                                                <p className="text-sm font-bold mt-1">{oversea?.company_name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Country</p>
                                                <p className="text-sm font-bold mt-1">{oversea?.country || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Contact Person Name</p>
                                                <p className="text-sm font-bold mt-1">{oversea?.contact_person_name || 'N/A'}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-600">Mobile Number</p>
                                                <p className="text-sm font-bold mt-1">{oversea?.mobile_no || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">WhatsApp Number</p>
                                                <p className="text-sm font-bold mt-1">{oversea?.whatsapp_no || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Email ID</p>
                                                <p className="text-sm font-bold mt-1">{oversea?.email_address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Information */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Recruitment Info</h2>
                                    </div>
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Categories You Can Provide</p>
                                            <p className="text-sm font-bold mt-1">{oversea?.categories_you_can_provide_names || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Nationality of Workers</p>
                                            <p className="text-sm font-bold mt-1">{oversea?.nationality_of_workers || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Mobilization Time
                                            </p>
                                            <p className="text-sm font-bold mt-1">{oversea?.mobilization_time || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">UAE Deployment Experience</p>
                                            <p className="text-sm font-bold mt-1">{oversea?.uae_deployment_experience ? "Yes" : "No"}</p>
                                        </div>

                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Documents</h2>
                                    </div>
                                    <div className="flex grid-cols-4 gap-4 pt-2">
                                        {/* Upload CV Section */}
                                        <div>
                                            <h3 className="text-xs text-gray-600 mb-2">Upload CV</h3>
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl text-armsjobslightblue"><IoDocumentText /></span>
                                                <div>
                                                    <p className="text-sm font-bold">Babu.doc</p>
                                                    <p className="text-xs text-gray-400">470 KB</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Additional Details</p>
                                            <p className="text-sm font-bold mt-1">{oversea?.comments}</p>
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
                                        {oversea?.recruitment_remarks?.map((remark) => (
                                            <div key={remark.id} className="border-b pb-4">
                                                <div className="flex max-xl:flex-col items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <img
                                                                src={Profileimg}
                                                                alt="profileImg"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium">{remark.company_name}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(remark.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{remark.remark}</p>
                                            </div>
                                        ))}
                                        {(!oversea?.recruitment_remarks || oversea.recruitment_remarks.length === 0) && (
                                            <div className="text-center py-4 text-gray-500">
                                                No remarks found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showEditOverSeasPopup &&
                <EditOverSeasPopup
                    closePopup={closeEditOverseasPopup}
                    refreshData={fetchOverseasRecruitment}
                    editOverseas={oversea}
                />
            }

            {showOverseasStatusPopup && overseasStatus && (
                <StatusOverseasPopup
                    closePopup={closeoverseasStatusPopup}
                    OverseasData={overseasStatus}
                    refreshData={() => fetchOverseasRecruitmentID(overseasStatus.id)}
                    InactiveStatus={() => fetchStatus()}
                />
            )}
        </div>
        //</div>
    );
};
