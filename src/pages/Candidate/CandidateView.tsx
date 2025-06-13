import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import DefaultProfile from "../../assets/images/DefaultProfile.jpg"
import Profileimg from "../../assets/images/profileimg.jpg"
import { IoDocumentText } from "react-icons/io5";
import { Button } from "../../common/Button";
import { FaArrowLeft } from "react-icons/fa6";
import { createRemark, fetchCandidateNames, ViewCandidateName } from "../../Commonapicall/Candidateapicall/Candidateapis";
import { AgentSupplierViewShimmer } from "../../components/ShimmerLoading/ShimmerViewpage/CommonViewShimmer";
import { EditCandidatePopup } from "./EditCandidatePopup";
import { toast } from "react-toastify";
import { StatusCandidatePopup } from "./CandidateStatusPopup";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";

// Define API response interfaces
interface ApiResponse {
    status: string;
    message: string;
    data: CandidateApiResponse[];
    count: number;
    next: string | null;
    previous: string | null;
}

interface SingleCandidateResponse {
    data: CandidateApiResponse;
}
// API Response Data Interface
interface CandidateApiResponse {
    id: number;
    candidate_id: number;
    photo_upload?: string | null;
    full_name: string;
    mobile_number: string;
    whatsapp_number: string;
    email: string;
    nationality: string;
    current_location: string;
    visa_type: string;
    visa_expiry_date: string | null;
    availability_to_join: string;
    position_applying_for: string;
    category: string;
    category_names:string;
    other_category: string | null;
    uae_experience_years: string;
    skills_tasks: string;
    preferred_work_location: string;
    expected_salary: string;
    upload_cv: string;
    relevant_docs1: string | null;
    relevant_docs2: string | null;
    relevant_docs3: string | null;
    status: boolean;
    remarks: {
        id: number;
        remark: string;
        candidate_full_name: string;
        created_at: string;
        updated_at: string;
    }[];
    created_at: string;
    is_deleted: boolean;
    languages_spoken: string;
    preferred_work_type: string;
    currently_employed: boolean;
    additional_notes: string;
    referral_name: string;
    referral_contact: string;
}

export const CandidateView = () => {
    const { id } = useParams<{ id: string }>();
    const [candidates, setCandidates] = useState<CandidateApiResponse[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateApiResponse | null>(null);
    const [newRemark, setNewRemark] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [showcandidateEditPopup, setShowcandidatePopup] = useState<boolean>(false);
    const [showcandidateStatusPopup, setShowcandidateStatusPopup] = useState<boolean>(false);
    const [candidateStatus, setcandidatestatus] = useState<{ id: number, name: string, currentStatus: boolean } | null>(null);
    // const [previousStatus, setPreviousStatus] = useState<boolean | null>(null);
    const [candidate, setcandidate] = useState<CandidateApiResponse>({
        id: 0,
        candidate_id: 0,
        photo_upload: null,
        full_name: '',
        mobile_number: '',
        whatsapp_number: '',
        email: '',
        nationality: '',
        current_location: '',
        visa_type: '',
        visa_expiry_date: null,
        availability_to_join: '',
        position_applying_for: '',
        category: '',
        category_names:'',
        other_category: null,
        uae_experience_years: '',
        skills_tasks: '',
        preferred_work_location: '',
        expected_salary: '',
        upload_cv: '',
        relevant_docs1: null,
        relevant_docs2: null,
        relevant_docs3: null,
        status: false,
        remarks: [], // Add this empty array
        created_at: '',
        is_deleted: false,
        languages_spoken: '',
        preferred_work_type: '',
        currently_employed: false,
        additional_notes: '',
        referral_name: '',
        referral_contact: ''
    });
    const navigate = useNavigate();

    // Function to fetch all candidates
    const fetchCandidates = async () => {
        setIsLoading(true);
        try {
            const response = await fetchCandidateNames() as ApiResponse;
            if (response && response.data) {
                setCandidates(response.data);
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch details for a specific candidate
    const fetchCandidateDetails = async (candidateId: number) => {
        if (!candidateId) return;
        try {
            const response = await ViewCandidateName(candidateId) as SingleCandidateResponse;
            if (response && response.data) {
                setcandidate(response.data);
                setSelectedCandidate(response.data);
            }
        } catch (error) {
            console.error('Error fetching candidate details:', error);
        }
    };

    // Initial load of the selected ID
    useEffect(() => {
        if (id && initialLoad) {
            setIsLoading(true);
            fetchCandidateDetails(Number(id)).finally(() => {
                setIsLoading(false);
                setInitialLoad(false);
            });
        }
    }, [id, initialLoad]);

    useEffect(() => {
        fetchCandidates();
    }, []);

    // Handle search
    const handleSearch = async (query: string) => {
        try {
            const result = await fetchCandidateNames(query) as ApiResponse;
            if (result && result.data) {
                setCandidates(result.data);
            }
        } catch (error) {
            console.error('Error searching candidates:', error);
        }
    };

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            handleSearch(searchQuery);
        } else {
            fetchCandidates();
        }
    }, [searchQuery]);

    const fetchStatus = () => {
        console.log("fetchStatus")
        navigate('/Candidate');
    }

    // Direct navigation and data loading handler for candidate click
    const handleCandidateClick = async (candidateId: number, e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`/Candidate/${candidateId}`);
        setIsLoading(true);
        await fetchCandidateDetails(candidateId);
        setIsLoading(false);
    };

    const openEditCandidatePopup = () => {
        setShowcandidatePopup(true)
    }

    const closeEditCandidatePopup = () => {
        setShowcandidatePopup(false);
        setIsLoading(true); // Show loading state
        fetchCandidateDetails(Number(id)).finally(() => {
            setIsLoading(false);
        });
    }

    const openStatusCandidatePopup = (selectedCandidate: CandidateApiResponse) => {
        setcandidatestatus({
            id: selectedCandidate.id,
            name: selectedCandidate.full_name,
            currentStatus: selectedCandidate.status // assuming status is a boolean
        });
        setShowcandidateStatusPopup(true);
    }

    const closeStatusCandidatePopup = () => {
        setShowcandidateStatusPopup(false)
    }

    const handleAddRemark = async () => {
        if (!newRemark.trim() || !id) return;
        try {
            await createRemark(Number(id), newRemark);
            toast.success("Remark added successfully")
            console.log("Remark added successfully")
            setNewRemark("");
            // Refresh remarks after adding new one
            await fetchCandidateDetails(Number(id));
        } catch (error) {
            console.error('Error adding remark:', error);
            toast.error('Error adding remark');
        }
    };

    if (isLoading && initialLoad) {
        return <AgentSupplierViewShimmer />;
    }

    if (!selectedCandidate) {
        return <AgentSupplierViewShimmer />;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-white px-5 py-1 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-center p-1">
                    <div className="flex items-center p-3">
                        <span className="text-2xl font-bold">Candidate</span>
                        <span className="mx-2 pt-2 text-xl"><MdOutlineKeyboardArrowRight /></span>
                        <span className="text-gray-500 pt-2 text-sm font-medium underline">Dashboard</span>
                        <span className="mx-2 pt-2 text-sm">{"/"}</span>
                        <span className="text-gray-500 pt-2 text-sm font-medium">Candidate</span>
                    </div>
                    <div className="flex items-center space-x-4 p-3">
                        <Button
                            buttonType="button"
                            buttonTitle="Back"
                            onClick={() => navigate(-1)}
                            icon={<FaArrowLeft />}
                            className="px-4 py-2 bg-armsWhite text-sm font-bold text-armsjobslightblue border-[1px] rounded-md cursor-pointer hover:bg-armsjobslightblue hover:text-armsWhite hover:border-armsWhite"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Left Column - Candidate Names */}
                    <div className="w-1/4 border-armsBlack border-1 rounded">
                        <div className="bg-white rounded shadow-sm">
                            <div className="bg-main text-armsWhite p-4">
                                <h2 className="text-base font-semibold">Candidate Names ({candidates.length})</h2>
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
                                    {candidates.length > 0 ? candidates.map((candidate) => (
                                        <div
                                            key={candidate.id}
                                            onClick={(e) => handleCandidateClick(candidate.id, e)}
                                            className={`block p-3 border-b ${candidate.id === Number(id) ? 'bg-gray-100' : ''} hover:bg-gray-100 cursor-pointer`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex-grow">
                                                    <div className="text-sm font-medium">{candidate.full_name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-4 text-gray-500">
                                            No candidates found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full bg-white border border-armsBlack rounded shadow-sm">
                        {/* Middle Column - Candidate Details */}
                        <div className="flex-[3] p-2">
                            <div className="flex  justify-between items-center p-4">
                                <div className="flex items-center gap-1 max-xl:flex-col max-md:flex-col">
                                    <div className="relative -top-2 -left-2">
                                        <div className="max-w-45 max-h-45  bg-gray-200 rounded-lg flex items-center justify-center">
                                            <img
                                                src={DefaultProfile}
                                                alt="Candidate"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="pb-3.5">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-2xl font-bold">{selectedCandidate?.full_name || 'N/A'}</h2>
                                            <div className="scale-70">
                                                <div className="flex items-center space-x-4 ml-4"
                                                    onClick={() => selectedCandidate && openStatusCandidatePopup(selectedCandidate)}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        {selectedCandidate?.status === true ? (
                                                            <>
                                                                <PiToggleRightFill className="text-green-500 text-5xl cursor-pointer" />
                                                                <span className="text-green-600 text-lg cursor-pointer">Active</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PiToggleLeftFill className="text-red-500 text-5xl cursor-pointer" />
                                                                <span className="text-red-600 text-lg cursor-pointer">Inactive</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <p className="text-xs text-gray-600">Mobile Number</p>
                                                <p className="font-bold">{selectedCandidate?.mobile_number || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Whatsapp Number</p>
                                                <p className="font-bold">{selectedCandidate?.whatsapp_number || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Email ID</p>
                                                <p className="font-bold">{selectedCandidate?.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Nationality</p>
                                                <p className="font-bold">{selectedCandidate?.nationality || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Current Location</p>
                                                <p className="font-bold">{selectedCandidate?.current_location || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Emirates ID</p>
                                                <p className="font-bold">{'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={openEditCandidatePopup}
                                    disabled={!selectedCandidate?.status}
                                    buttonType="button"
                                    buttonTitle="Edit"
                                    //className="mb-30 px-4 py-1 bg-armsjobslightblue text-armsWhite font-semibold border-[1px] rounded-sm cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue text-sm"
                                    className={`mb-30 px-4 py-1 font-semibold border-[1px] rounded-sm text-sm ${selectedCandidate?.status
                                        ? 'bg-armsjobslightblue text-armsWhite cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue'
                                        : 'bg-gray-300 text-armshrgrey cursor-not-allowed border-gray-300'
                                        }`}
                                />
                            </div>

                            <div className="p-0">
                                {/* Visa & Work Eligibility */}
                                <div className="mb-6 ">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Visa & Work Eligibility</h2>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Visa Type</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.visa_type || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Visa Expiry Date</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.visa_expiry_date || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Availability to join</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.availability_to_join || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Information */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Job Information</h2>
                                    </div>
                                    <div className="grid grid-cols-4 gap-x-8 gap-y-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Position Applying For</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.position_applying_for || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Category</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.category_names || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Any Other Category</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.other_category || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Years of UAE Experience</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.uae_experience_years || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Skills & Tasks You Can Perform</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.skills_tasks || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Preferred Work Location</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.preferred_work_location || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Expected Salary (AED)</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.expected_salary || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Language Spoken</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.languages_spoken || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Preferred Work Type</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.preferred_work_type || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Currently Employed?</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.currently_employed ? 'Yes' : 'No'}</p>
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
                                        {/* Upload Relevant Docs Section */}
                                        <div>
                                            <h3 className="text-xs text-gray-600 mb-2">Upload Relevant Docs</h3>
                                            <div className="flex gap-6">
                                                {/* Each document */}
                                                <div className="flex items-start gap-2">
                                                    <span className="text-3xl text-armsjobslightblue"><IoDocumentText /></span>
                                                    <div>
                                                        <p className="text-sm font-bold">passport</p>
                                                        <p className="text-xs text-gray-400">350 KB</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-3xl text-armsjobslightblue"><IoDocumentText /></span>
                                                    <div>
                                                        <p className="text-sm font-bold">Insurance</p>
                                                        <p className="text-xs text-gray-400">145 KB</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-3xl text-armsjobslightblue"><IoDocumentText /></span>
                                                    <div>
                                                        <p className="text-sm font-bold">Visa</p>
                                                        <p className="text-xs text-gray-400">421 KB</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Other Information */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-1 border-b">
                                        <h2 className="text-xl font-bold">Other Information</h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-x-8 gap-y-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Additional Notes or Information</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.additional_notes || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Referral Contact Details</p>
                                            <p className="text-xs text-gray-600">Name</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.referral_name || 'N/A'}</p>
                                        </div>
                                        <div className="pt-4">
                                            <p className="text-xs text-gray-600">Contact</p>
                                            <p className="text-sm font-bold mt-1">{selectedCandidate?.referral_contact || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Job History */}
                                <div className="w-full border border-main rounded-t-lg p-0 min-h-[300px] bg-white">
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
                                            {/* Add job history rows here */}
                                        </tbody>
                                    </table>
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
                                        onChange={(e) => setNewRemark(e.target.value)}
                                        className="w-full p-3 border-2 border-armsgrey rounded mb-2 text-sm bg-armsWhite"
                                        rows={4}
                                    // placeholder="Add a remark..."
                                    />
                                    <Button
                                        onClick={handleAddRemark}
                                        buttonType="button"
                                        buttonTitle="Add"
                                        className="mx-auto px-4 py-1 bg-armsjobslightblue text-sm text-armsWhite font-semibold border-[1px] rounded-sm cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                                    />
                                    <div className="mt-4 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                                        {/* Static remarks data */}
                                        {selectedCandidate?.remarks?.length > 0 ? (
                                            selectedCandidate.remarks.map((remark) => (
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
                                                            <span className="text-sm font-medium">
                                                                {remark.candidate_full_name || "Unknown"}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(remark.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{remark.remark}</p>
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
            {showcandidateEditPopup && (
                <EditCandidatePopup
                    closePopup={closeEditCandidatePopup}
                    refreshData={fetchCandidateNames}
                    editCandidate={candidate}
                />
            )}

            {showcandidateStatusPopup && candidateStatus && (
                <StatusCandidatePopup
                    closePopup={closeStatusCandidatePopup}
                    refreshData={() => fetchCandidateDetails(candidateStatus.id)}
                    CandidateStatus={candidateStatus}
                    InactiveStatus={() => fetchStatus()}
                />
            )}
        </div>
    );
};
