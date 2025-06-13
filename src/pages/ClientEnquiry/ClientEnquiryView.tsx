import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { CandidateRemark } from "../../types/CandidateList";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
//import Profileimg from "../../assets/images/profileimg.jpg"
import { Button } from "../../common/Button";
import { FaArrowLeft } from "react-icons/fa6";
import { EditClientEnquiryPopup } from "./EditClientEnquiryPopup";
import { ViewClientNameById, fetchClientEnquiryNames } from "../../Commonapicall/ClientEnquiryapicall/ClientEnquiryapis";
import { AgentSupplierViewShimmer } from "../../components/ShimmerLoading/ShimmerViewpage/CommonViewShimmer";
import { StatusClientEnquiryPopup } from "./ClientEnquiryStatusPopup";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";
// import { CandidateViewShimmer } from "../../components/ShimmerLoading";

interface ApiResponse {
    status: string;
    message: string;
    data: ClientEnquiryResponse[];
    count: number;
    next: string | null;
    previous: string | null;
}

interface SingleClientEnquiryResponse {
    data: ClientEnquiryResponse;
}
// API Response Data Interface
interface ClientEnquiryResponse {
    id: number;
    client_enquiry_id: string;
    company_name: string;
    email: string;
    contact_person_name: string;
    mobile_number: string;
    nature_of_work: string;
    project_location: string; project_duration
    : string;
    categories_required: string;
    categories_required_names:string;
    quantity_required: string;
    project_start_date: string; // ISO date string
    kitchen_facility: boolean;
    transportation_provided: boolean;
    accommodation_provided: boolean;
    remarks: string;
    query_type: string;
    status: boolean;
    is_deleted: boolean;
    created_at: string; // ISO datetime string
}


export const ClientEnquiryView = () => {
    const { id } = useParams<{ id: string }>();
    const [ClientEnquiry, setClientEnquiry] = useState<ClientEnquiryResponse[]>([]);
    const [selectedClientEnquiry, setSelectedClientEnquiry] = useState<ClientEnquiryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    // const [remarks, setRemarks] = useState<CandidateRemark[]>([]);
    // const [newRemark, setNewRemark] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showEditClientEnquiryPopup, setShowEditClientEnquiryPopup] = useState<boolean>(false);
    const [showStatusClientEnquiryPopup, setShowStatusClientEnquiryPopup] = useState<boolean>(false);
    const [clientenquiryStatus, setclientenquiryStatus] = useState<{ id: number, name: string, currentStatus: boolean } | null>(null);
    const [clientenquiry, setclientenquiry] = useState<ClientEnquiryResponse>({
        id: 0,
        client_enquiry_id: '',
        company_name: '',
        email: '',
        contact_person_name: '',
        mobile_number: '',
        nature_of_work: '',
        project_location: '',
        project_duration: '',
        categories_required: '',
        categories_required_names: '',
        quantity_required: '',
        project_start_date: '',
        kitchen_facility: false,
        transportation_provided: false,
        accommodation_provided: false,
        remarks: '',
        query_type: '',
        status: false,
        is_deleted: false,
        created_at: ''
    });

    const navigate = useNavigate();

    // Function to fetch all candidates
    const fetchClientNames = async () => {
        setIsLoading(true);
        try {
            const response = await fetchClientEnquiryNames() as ApiResponse;
            if (response && response.data) {
                setClientEnquiry(response.data);
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch details for a specific candidate
    const fetchClientDetails = async (clientEnquiryId: number) => {
        if (!clientEnquiryId) return;
        try {
            const response = await ViewClientNameById(clientEnquiryId) as SingleClientEnquiryResponse;
            if (response && response.data) {
                setSelectedClientEnquiry(response.data);
                setclientenquiry(response.data);
            }
        } catch (error) {
            console.error('Error fetching candidate details:', error);
        }
    };

    // Initial load of the selected ID
    useEffect(() => {
        if (id && initialLoad) {
            setIsLoading(true);
            fetchClientDetails(Number(id)).finally(() => {
                setIsLoading(false);
                setInitialLoad(false);
            });
        }
    }, [id, initialLoad]);

    useEffect(() => {
        fetchClientNames();
    }, []);

    // Handle search
    const handleSearch = async (query: string) => {
        try {
            const result = await fetchClientEnquiryNames(query) as ApiResponse;
            if (result && result.data) {
                setClientEnquiry(result.data);
            }
        } catch (error) {
            console.error('Error searching candidates:', error);
        }
    };

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            handleSearch(searchQuery);
        } else {
            fetchClientNames();
        }
    }, [searchQuery]);

    const handleCandidateClick = async (clientEnquiryId: number, e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`/ClientEnquiry/${clientEnquiryId}`);
        setIsLoading(true);
        await fetchClientDetails(clientEnquiryId);
        setIsLoading(false);
    };

    const openEditClientEnquiryPopup = () => {
        setShowEditClientEnquiryPopup(true)
    }

    const closeEditClientEnquiryPopup = () => {
        setShowEditClientEnquiryPopup(false);
        setIsLoading(true); // Show loading state
        fetchClientDetails(Number(id)).finally(() => {
            setIsLoading(false);
        });
    }

    const openOverseasStatusPopup = (selectedClientEnquiry: ClientEnquiryResponse) => {
        setclientenquiryStatus({
            id: selectedClientEnquiry.id,
            name: selectedClientEnquiry.contact_person_name,
            currentStatus: selectedClientEnquiry.status // assuming status is a boolean
        });
        setShowStatusClientEnquiryPopup(true);
    }

    const closeoverseasStatusPopup = () => {
        setShowStatusClientEnquiryPopup(false)
    }

    const fetchStatus = () => {
        console.log("fetchStatus")
        navigate('/ClientEnquiry');
    }

    if (isLoading && initialLoad) {
        return <AgentSupplierViewShimmer />;
    }

    if (!ClientEnquiry) {
        return <div><AgentSupplierViewShimmer /></div>;
    }

    return (
        // <div className="min-h-screen bg-gray-100">
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-white px-5 py-1 rounded-lg shadow-sm ">
                {/* Header */}
                <div className="flex justify-between items-center p-1">
                    <div className="flex items- p-3">
                        <span className="text-2xl font-bold">Client Enquiry</span>
                        <span className="mx-2 pt-2 text-xl"><MdOutlineKeyboardArrowRight /></span>
                        <span className="text-gray-500 pt-2 text-sm font-medium underline">Dashboard</span>
                        <span className="mx-2 pt-2 text-sm">{"/"}</span>
                        <span className="text-gray-500 pt-2 text-sm font-medium ">Client Enquiry</span>
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
                    {/* Left Column - ClientEnquiry Names */}
                    <div className="w-1/4 border-armsBlack border-1 rounded">
                        <div className="bg-white rounded shadow-sm">
                            <div className="bg-main text-armsWhite p-4">
                                <h2 className="text-base font-semibold">Contact Person Names ({ClientEnquiry.length})</h2>
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
                                    {ClientEnquiry.length > 0 ? ClientEnquiry.map((clientenquiry) => (
                                        <div
                                            key={clientenquiry.id}
                                            onClick={(e) => handleCandidateClick(clientenquiry.id, e)}
                                            className={`block p-3 border-b ${clientenquiry.id === Number(id) ? 'bg-gray-100' : ''} hover:bg-gray-100 cursor-pointer`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex-grow">
                                                    <div className="text-sm font-medium">{clientenquiry.contact_person_name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-4 text-gray-500">
                                            No Contact Persons found
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
                                {/* Company Details*/}
                                <div className="mb-6 ">
                                    <div className="flex items-center justify-between border-b pb-2 mb-4">
                                        <h2 className="text-xl font-bold flex-1">Company Details</h2>
                                        <div className="flex items-center gap-4"> {/* Added container for right-aligned items */}
                                            <div className="flex items-center gap-2 cursor-pointer"
                                                onClick={() => selectedClientEnquiry && openOverseasStatusPopup(selectedClientEnquiry)}
                                            >
                                                {selectedClientEnquiry?.status === true ? (
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
                                            <Button
                                                onClick={openEditClientEnquiryPopup}
                                                disabled={!selectedClientEnquiry?.status}
                                                buttonType="button"
                                                buttonTitle="Edit"
                                                //className="px-4 py-1 bg-armsjobslightblue text-sm text-armsWhite font-semibold border-[1px] rounded-sm cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                                                className={`px-4 py-1 text-sm font-bold border-[1px] rounded-sm cursor-pointer ${selectedClientEnquiry?.status
                                                    ? 'bg-armsjobslightblue text-armsWhite hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue'
                                                    : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="grid grid-cols-3 gap-4 pt-2 w-full max-xl:!grid-cols-2">
                                            <div>
                                                <p className="text-xs text-gray-600">Company Name</p>
                                                <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.company_name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Email ID</p>
                                                <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Contact Person Name</p>
                                                <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.contact_person_name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Mobile Number</p>
                                                <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.mobile_number || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6 ">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Personal information</h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Nature of Work</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.nature_of_work || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Project Location</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.project_location || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Project Duration</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.project_duration || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Categories Required</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.categories_required_names || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Quantity Required (per category)</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.quantity_required || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Project Start Date</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.project_start_date || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6 ">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Facility info</h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Kitchen Facilities Provided?</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.kitchen_facility ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Transportation Provided</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.transportation_provided ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Accommodation Provided?</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.accommodation_provided ? 'Yes' : 'No'}</p>
                                        </div>

                                    </div>
                                </div>

                                <div className="mb-6 ">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Remarks / Notes</h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Query Type</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.query_type || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Remarks / Notes</p>
                                            <p className="text-sm font-bold mt-1">{selectedClientEnquiry?.remarks || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Job Information */}
                                {/* <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Recruitment Info</h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-x-8 gap-y-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Categories You Can Provide</p>
                                            <p className="text-sm font-bold mt-1">{overSeasDetail?.CatogoryYouCanProvide}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Nationality of Workers</p>
                                            <p className="text-sm font-bold mt-1">{overSeasDetail?.NationalityOfWorker}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Mobilization Time
                                            </p>
                                            <p className="text-sm font-bold mt-1">{overSeasDetail?.MobilizationTime}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">UAE Deployment Experience</p>
                                            <p className="text-sm font-bold mt-1">{overSeasDetail?.UAEDeploymentExperience}</p>
                                        </div>
                                      
                                    </div>
                                </div>

                             */}


                                {/* Job History */}
                                {/* <div className="w-full border border-main rounded-t-lg p-0 min-h-[300px] bg-white">
                                    <h3 className="text-armsWhite font-bold bg-main py-2 px-4 rounded-t-lg">Job History</h3>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-armsBlack">
                                                <th className="text-left p-3 text-sm font-bold">Job ID</th>
                                                <th className="text-left p-3 text-sm font-bold">Company Name</th>
                                                <th className="text-left p-3 text-sm font-bold">Position</th>
                                                <th className="text-left p-3 text-sm font-bold">Remarks</th>
                                                <th className="text-left p-3 text-sm font-bold">Status</th>
                                                <th className="text-left p-3 text-sm font-bold">Date & Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                           
                                        </tbody>
                                    </table>
                                </div> */}
                            </div>
                        </div>

                        {/* Right Column - Remarks */}
                        {/* <div className="flex-[1.5] p-2 ">
                            <div className="bg-gray-100 rounded shadow-sm">
                                <div className="bg-main text-armsWhite p-3 rounded-t flex justify-between items-center">
                                    <h2 className="text-base font-semibold">Remarks</h2>
                                </div>
                                <div className="p-4">
                                    <textarea
                                        value={newRemark}
                                        onChange={(e) => setNewRemark(e.target.value)}
                                        className="w-full p-3 border-2 border-armsgrey rounded mb-2 text-sm bg-armsWhite"
                                        rows={4}
                                    
                                    />
                                    <Button
                                        onClick={handleAddRemark}
                                        buttonType="button"
                                        buttonTitle="Add"
                                        className="mx-auto px-4 py-1 bg-armsjobslightblue text-sm text-armsWhite font-semibold border-[1px] rounded-sm cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                                    />
                                    <div className="mt-4 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                                      
                                        <div className="border-b pb-4">
                                            <div className="flex  max-xl:flex-col items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <img
                                                            src={Profileimg}
                                                            alt="profileImg"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium">Amjad</span>
                                                </div>
                                                <span className="text-xs text-gray-500">14-02-2025 10:25:12</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                Quisque pharetra tempus lorem non tempus. In pulvinar arcu eget imperdiet finibus.
                                            </p>
                                        </div>

                                        <div className="border-b pb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex   max-xl:flex-col items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <img
                                                            src={Profileimg}
                                                            alt="profileImg"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium">Swetha</span>
                                                </div>
                                                <span className="text-xs text-gray-500">13-02-2025 15:02:40</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                Quisque pharetra tempus lorem non tempus. In pulvinar arcu eget imperdiet finibus.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            {showEditClientEnquiryPopup &&
                (<EditClientEnquiryPopup
                    closePopup={closeEditClientEnquiryPopup}
                    refreshData={fetchClientEnquiryNames}
                    editClientEnquiry={clientenquiry}
                />)}

            {showStatusClientEnquiryPopup && clientenquiryStatus && (
                <StatusClientEnquiryPopup
                    closePopup={closeoverseasStatusPopup}
                    ClientEnquiryData={clientenquiryStatus}
                    refreshData={() => fetchClientDetails(clientenquiryStatus.id)}
                    InactiveStatus={() => fetchStatus()}
                />
            )}
        </div>
        // </div>
    );
};
