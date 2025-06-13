// AddCandidateModal.tsx
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import DefaultProfile from "../../assets/images/DefaultProfile.jpg"
import { Button } from "../../common/Button"
import { InputField } from "../../common/InputField";
import { SelectField } from "../../common/SelectField";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddCandidateList } from "../../Commonapicall/Candidateapicall/Candidateapis";
import { toast } from "react-toastify";
import { dropdowngetCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";
import Select from "react-select";

interface AddCandidatePopupProps {
    closePopup: () => void;
    refreshData: () => void;
}

interface Category {
    id: number;
    status: boolean;
    category: string;
    is_deleted: boolean;
}

interface CategoryApiResponse {
    status: string;
    message: string;
    data: Category[]
}

// Personal Information Schema
// const personalInfoSchema = zod.object({
//     full_name: zod.string().min(3, "Full name is required"),
//     mobile_number: zod
//         .string()
//         .min(3, "Mobile number is required")
//         .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
//     whatsapp_number: zod
//         .string()
//         .min(3, "WhatsApp number is required")
//         .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
//     email: zod
//         .string()
//         .min(3, "Email ID is required")
//         .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
//     nationality: zod.string().optional(),
//     current_location: zod.string().optional(),
// });
const personalInfoSchema = zod.object({
    full_name: zod.string().min(3, "Full name is required"),
    mobile_number: zod
        .string()
        .min(3, "Mobile number is required")
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    whatsapp_number: zod
        .string()
        .min(3, "WhatsApp number is required")
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email: zod
        .string()
        .min(3, "Email ID is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    nationality: zod
        .string()
        .min(1, "Nationality is required"),
    current_location: zod.string().optional(),
});


// Visa & Work Eligibility Schema
const visaSchema = zod.object({
    visa_type: zod.string().optional(),
    visa_expiry_date: zod.string().optional(),
    availability_to_join: zod.string().optional(),
});

// Job Information Schema
const jobInfoSchema = zod.object({
    position_applying_for: zod.string().optional(),
    category: zod.string().optional(),
    other_category: zod.string().optional(),
    expected_salary: zod.string().optional(),
    preferred_work_location: zod.string().optional(),
    skills_tasks: zod.string().optional(),
    languages_spoken: zod.string().optional(),
    preferred_work_type: zod.string().optional(),
    currently_employed: zod.string().optional(),
    //uae_experience_years: zod.string().optional(),
    uae_experience_years: zod
        .string()
        .optional()
        .refine(
            (val) => !val || (/^\d{1,2}$/.test(val) && Number(val) <= 99),
            { message: "Please enter up to 2 digits only" }
        ),
});

// Documents Schema
const documentsSchema = zod.object({
    upload_cv: zod
        .any()
        .refine((files) => files?.length > 0, "CV is required")
        .refine((files) => files?.[0]?.size <= 5_000_000, "Max file size is 5MB"),
    insurance: zod
        .any()
        .optional()
        .refine((files) => !files?.[0] || files?.[0]?.size <= 5_000_000, "Max file size is 5MB"),
    passport: zod
        .any()
        .refine((files) => files?.length > 0, "Passport is required")
        .refine((files) => files?.[0]?.size <= 5_000_000, "Max file size is 5MB"),
    visa: zod
        .any()
        .refine((files) => files?.length > 0, "Visa is required")
        .refine((files) => files?.[0]?.size <= 5_000_000, "Max file size is 5MB"),
    noc: zod
        .any()
        .optional()
        .refine((files) => !files?.[0] || files?.[0]?.size <= 5_000_000, "Max file size is 5MB"),
    license: zod
        .any()
        .optional()
        .refine((files) => !files?.[0] || files?.[0]?.size <= 5_000_000, "Max file size is 5MB"),
    experience_certificate: zod
        .any()
        .optional()
        .refine((files) => !files?.[0] || files?.[0]?.size <= 5_000_000, "Max file size is 5MB"),
});

// Other Information Schema
const otherInfoSchema = zod.object({
    additional_notes: zod.string().optional(),
    referral_name: zod.string().optional(),
    referral_contact: zod
        .string()
        .optional()
        .refine(
            (val) => !val || /^\d{10}$/.test(val),
            { message: "Contact number must be 10 digits" }
        ),
});

// Combined Schema
const candidateSchema = personalInfoSchema
    .merge(visaSchema)
    .merge(jobInfoSchema)
    .merge(documentsSchema)
    .merge(otherInfoSchema);

type CandidateFormData = zod.infer<typeof candidateSchema>;

export const AddCandidatePopup: React.FC<AddCandidatePopupProps> = ({
    closePopup,
    refreshData
}) => {
    const [activeTab, setActiveTab] = useState("Personal Information");
    const tabs = ["Personal Information", "Visa & Work Eligibility", "Job Infor/Work Preferences", "Documents Upload", "Other Information"];
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);
    const [, setLoading] = useState(false);
    const [, setError] = useState<string | null>(null);
    const [selection, setSelection] = useState("");
    const [ownVisa, setOwnVisa] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CandidateFormData>({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            currently_employed: "no", // Set default value for radio buttons
        },
    });

    const tabFieldMapping: Record<string, string[]> = {
        "Personal Information": [
            'full_name',
            'mobile_number',
            'whatsapp_number',
            'email',
            'nationality',
            'current_location'
        ],
        "Visa & Work Eligibility": [
            'visa_type',
            'visa_expiry_date',
            'availability_to_join'
        ],
        "Job Infor/Work Preferences": [
            'position_applying_for',
            'category',
            'other_category',
            'expected_salary',
            'preferred_work_location',
            'skills_tasks',
            'languages_spoken',
            'preferred_work_type',
            'currently_employed',
            'uae_experience_years'
        ],
        "Documents Upload": [
            'cv',
            'relevantDocuments'
        ],
        "Other Information": [
            'additional_notes',
            'referral_name',
            'referral_contact'
        ]
    };

    const handleCategoryChange = (
        selectedOptions: readonly { value: string; label: string }[] | null
    ) => {
        const newSelected = selectedOptions || [];
        //setSelectedCategories([...newSelected]);

        // Extract only the IDs and join with commas
        const categoryIds = newSelected.map(opt => opt.value).join(',');
        setValue('category', categoryIds); // Pass to form
    };

    const categoryOptions = categories.map(cat => ({
        value: cat.id.toString(),      // use ID as value
        label: cat.category            // show category name
    }));

    const [scrollToField, setScrollToField] = useState<string | null>(null);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Combine form validation and submission in one step
        handleSubmit(async (data) => {
            try {
                const cvFile = data.upload_cv?.[0];
                const insuranceFile = data.insurance?.[0];
                const passportFile = data.passport?.[0];
                const visaFile = data.visa?.[0];
                const nocFile = data.noc?.[0];
                const licenseFile = data.license?.[0];
                const experienceCertificateFile = data.experience_certificate?.[0];
                await AddCandidateList(
                    data.full_name || '',
                    data.mobile_number || '',
                    data.whatsapp_number || '',
                    data.email || '',
                    data.nationality || '',
                    data.current_location || '',
                    data.visa_type || '',
                    data.availability_to_join || '',
                    data.position_applying_for || '',
                    data.category || '',
                    data.uae_experience_years || '',
                    data.skills_tasks || '',
                    data.preferred_work_location || '',
                    data.expected_salary || '',
                    data.visa_expiry_date || '',
                    data.other_category || '',
                    data.languages_spoken || '',
                    data.preferred_work_type || '',
                    data.currently_employed || 'no',
                    data.additional_notes || '',
                    data.referral_name || '',
                    data.referral_contact || '',
                    cvFile,
                    insuranceFile,
                    passportFile,
                    visaFile,
                    nocFile,
                    licenseFile,
                    experienceCertificateFile
                );
                reset();
                closePopup();
                refreshData();
                toast.success("Candidate added successfully");
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Failed to submit form";
                setError(errorMessage);
                toast.error("Failed to submit form");
            } finally {
                setLoading(false);
            }
        }, (errors) => {
            // Handle validation errors
            const errorFields = Object.keys(errors);
            if (errorFields.length > 0) {
                // Find which tab contains the first error
                for (const [tabName, fields] of Object.entries(tabFieldMapping)) {
                    const hasErrorInTab = errorFields.some(errorField => fields.includes(errorField));
                    if (hasErrorInTab) {
                        // Set active tab to the one containing the first error
                        setActiveTab(tabName);
                        // Set the first error field from this tab to scroll to
                        const firstErrorFieldInTab = errorFields.find(field => fields.includes(field));
                        if (firstErrorFieldInTab) {
                            setScrollToField(firstErrorFieldInTab);
                        }
                        break;
                    }
                }
            }
        })(e);
    };

    useEffect(() => {
        if (scrollToField) {
            // First scroll the tab into view
            const tabContent = document.querySelector('.tab-content');
            if (tabContent) {
                tabContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Then scroll to the specific field
            const timeout = setTimeout(() => {
                const el = document.querySelector(`[name="${scrollToField}"]`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    (el as HTMLElement).focus();
                }
                setScrollToField(null);
            }, 300); // Increased timeout to ensure tab change is complete

            return () => clearTimeout(timeout);
        }
    }, [activeTab, scrollToField]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await dropdowngetCategories() as CategoryApiResponse;
                setCategories(data.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
                toast.error("Failed to load categories");
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="fixed inset-0 bg-armsAsh bg-opacity-70 flex justify-center items-start pt-25 z-50">
            <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] p-6 relative  max-xl:!h-[90%]">
                {/* Heading */}
                <div className="relative mb-5">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
                        Add Candidate
                    </h2>
                </div>
                <div
                    onClick={closePopup}
                    className="absolute top-5 right-5 text-gray-500 cursor-pointer"
                >
                    <IoCloseOutline size={30} />
                </div>
                {/* Tabs */}
                <div className="flex gap-1 border-b-1 border-armsBlack mb-6">
                    {tabs.map((tab) => {
                        const hasError = tabFieldMapping[tab]?.some(field => field in errors);
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 text-sm font-bold cursor-pointer relative ${activeTab === tab
                                    ? "bg-main text-white"
                                    : "text-black"
                                    }`}
                            >
                                {tab}
                                {hasError && (
                                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
                {/* Content */}
                <form onSubmit={handleFormSubmit} className="h-[calc(100%-150px)] overflow-y-auto tab-content">
                    {activeTab === "Personal Information" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                {/* Photo Upload */}
                                <div className="flex gap-6 w-full">
                                    <div className="flex flex-col items-center pt-5">
                                        <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded">
                                            <img
                                                src={DefaultProfile}
                                                alt="Uploaded"
                                                className="w-44 h-44 object-cover mb-2"
                                            />
                                            <div className="absolute text-black text-center text-sm font-semibold">
                                                <span>Photo Upload</span><br /><span>(Optional)</span>
                                            </div>
                                        </div>
                                        <label className="mt-5 px-4 py-2  text-armsjobslightblue rounded cursor-pointer border-2 b-armsjobslightblue ml-1">
                                            Upload
                                            <InputField
                                                type="file"
                                                name="photo"
                                                accept="image/*"
                                                className="hidden  cursor-pointer"
                                                label={""}
                                            />
                                        </label>
                                    </div>
                                    {/* Form Fields */}
                                    <div className="flex flex-col gap-4 flex-1">
                                        <div className="grid grid-cols-4 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 gap-6.5">
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Full Name<span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("full_name")}
                                                    name="full_name"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Mobile Number<span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("mobile_number")}
                                                    name="mobile_number"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.mobile_number && <p className="text-sm text-red-500">{errors.mobile_number.message}</p>}
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    WhatsApp Number <span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("whatsapp_number")}
                                                    name="whatsapp_number"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.whatsapp_number && <p className="text-sm text-red-500">{errors.whatsapp_number.message}</p>}
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Email ID <span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="email"
                                                    {...register("email")}
                                                    name="email"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Nationality <span className="text-red-500">*</span>
                                                    </label>
                                                <InputField
                                                    type="text"
                                                    {...register("nationality")}
                                                    name="nationality"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.nationality && <p className="text-sm text-red-500">{errors.nationality.message}</p>}
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">Current Location</label>
                                                <InputField
                                                    type="text"
                                                    {...register("current_location")}
                                                    name="current_location"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">Select OwnVisa or NewCandidate</label>
                                                <div className="flex space-x-6 pt-2">
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value="Own Visa"
                                                            // {...register("currently_employed")}
                                                            checked={ownVisa === "Own Visa"}
                                                            onChange={(e) => setOwnVisa(e.target.value)}
                                                            className="w-5 h-5 cursor-pointer "
                                                        />
                                                        Own Visa
                                                    </label>
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value="New Candidate"
                                                            // {...register("currently_employed")}
                                                            checked={ownVisa === "New Candidate"}
                                                            onChange={(e) => setOwnVisa(e.target.value)}
                                                            className="w-5 h-5 cursor-pointer"
                                                        />
                                                        New Candidate
                                                    </label>
                                                </div>
                                            </div>
                                            {ownVisa === "Own Visa" && (
                                                <div>
                                                    <label className="text-sm font-semibold mb-1">
                                                        Emirates ID<span className="text-red-500">*</span>
                                                    </label>
                                                    <InputField
                                                        type="text"
                                                        // {...register("current_location")}
                                                        name="emirates"
                                                        className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                        label={""}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "Visa & Work Eligibility" && (
                        <div className="flex flex-wrap gap-4 px-4 ">
                            <div className="flex-1 max-w-[250px]">
                                <label className="text-sm font-semibold mb-1 block">
                                    Visa Type
                                </label>
                                <SelectField
                                    label={""}
                                    {...register("visa_type")}
                                    options={[
                                        { value: "", label: "Select VisaType" },
                                        { value: "UARE Employment", label: "UAE Employment" },
                                        { value: "Visit", label: "Visit" },
                                        { value: "Cancelled", label: "Cancelled" },
                                        { value: "Freelance", label: "Freelance" },
                                        { value: "Dependent", label: "Dependent" },
                                    ]}
                                    className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                />
                            </div>

                            <div className="flex-1 max-w-[250px]">
                                <label className="text-sm font-semibold mb-1 block">
                                    Visa Expiry Date
                                </label>
                                <InputField
                                    type="date"
                                    {...register("visa_expiry_date")}
                                    name="visa_expiry_date"
                                    className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                    label={""}
                                />
                            </div>

                            <div className="flex-1 max-w-[250px]">
                                <label className="text-sm font-semibold mb-1 block">
                                    Availability to join
                                </label>
                                <SelectField
                                    label={""}
                                    {...register("availability_to_join")}
                                    options={[
                                        { value: "", label: "Select Availability to Join" },
                                        { value: "Immediate", label: "Immediate" },
                                        { value: "1 week", label: "1 Week" },
                                        { value: "2 weeks", label: "2 Weeks" },
                                        { value: "1 month", label: "1 Month" },
                                    ]}
                                    className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === "Job Infor/Work Preferences" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 w-full">
                                    {/* Form Fields */}
                                    {/* <div className="flex flex-col gap-5 flex-1"> */}
                                    {/* First Row - 4 fields */}
                                    <div className="grid  max-md:!grid-cols-2 max-lg:!grid-cols-3 max-xl:!grid-cols-4 grid-cols-5 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold mb-1">
                                                Position Applying For
                                            </label>
                                            <InputField
                                                type="text"
                                                {...register("position_applying_for")}
                                                name="position_applying_for"
                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                label={""}
                                            />
                                        </div>
                                        {/* Category */}
                                        <div>
                                            <label className="text-sm font-semibold mb-1">
                                                Category
                                            </label>
                                            <Select
                                                isMulti
                                                options={categoryOptions}
                                                {...register("category")}
                                                name="category"
                                                // value={selectedCategories} // array of { value, label }
                                                onChange={handleCategoryChange}
                                                // className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        {/* Any Other Category */}
                                        <div>
                                            <label className="text-sm font-semibold mb-1">
                                                Any Other Category
                                            </label>
                                            <InputField
                                                type="text"
                                                {...register("other_category")}
                                                name="other_category"
                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                label={""}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold mb-1">
                                                Years of UAE Experience
                                            </label>
                                            <InputField
                                                type="number"
                                                {...register("uae_experience_years")}
                                                name="uae_experience_years"
                                                //inputMode="numeric"
                                                // pattern="\d*"
                                                maxLength={2}
                                                // onInput={(e) => {
                                                //     e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                                                // }}
                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                label={""}
                                            />
                                            {errors.uae_experience_years && (
                                                <p className="text-sm text-red-500">{errors.uae_experience_years.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold mb-1">Expected Salary (AED)</label>
                                            <InputField
                                                type="text"
                                                {...register("expected_salary")}
                                                name="expected_salary"
                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                label={""}
                                            />
                                        </div>


                                        <div>
                                            <label className="text-sm font-semibold mb-1">Preferred Work Location</label>
                                            <SelectField
                                                label={""}
                                                {...register("preferred_work_location")}
                                                options={[
                                                    { value: "", label: "Select work location" },
                                                    { value: "Dubai", label: "Dubai" },
                                                    { value: "Abu Dubai", label: "Abu Dubai" },
                                                    { value: "Open to All UAE ", label: "Coimbatore" },
                                                ]}
                                                className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold mb-1">Skills & Tasks You can Perform</label>
                                            <textarea
                                                {...register("skills_tasks")}
                                                name="skills_tasks"
                                                className="w-full h-9.5 rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold mb-1">Language Spoken</label>
                                            <textarea
                                                // type="text"
                                                {...register("languages_spoken")}
                                                name="languages_spoken"
                                                className="w-full h-9.5 rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                // label={""}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold mb-1">Preferred Work Type</label>
                                            <SelectField
                                                label={""}
                                                {...register("preferred_work_type")}
                                                options={[
                                                    { value: "", label: "Select Work Type" },
                                                    { value: "Full-time", label: "Full-time" },
                                                    { value: "Part-time", label: "Part-time" },
                                                    { value: "Monthly Contract ", label: "Monthly Contract" },
                                                    { value: "Yearly Contract", label: "Yearly Contract" },
                                                    { value: "Remote", label: "Remote" },
                                                ]}
                                                className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold mb-1">Currently Employed</label>
                                            <div className="flex space-x-6 pt-2">
                                                <label className="flex items-center  cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value="yes"
                                                        {...register("currently_employed")}
                                                        className="w-5 h-5 mr-1 cursor-pointer "
                                                    />
                                                    Yes
                                                </label>
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value="no"
                                                        {...register("currently_employed")}
                                                        className="w-5 h-5 mr-1 cursor-pointer"
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                    </div>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "Documents Upload" && (
    <div className="max-w-full mx-auto p-4">
        {/* First Row - 4 documents */}
        <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Resume */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold mb-1">Resume*</label>
                    <input 
                        type="file"
                        id="upload_cv"
                        {...register("upload_cv")}
                        accept=".pdf,.doc,.docx"
                        className="hidden" 
                    />
                    <input
                        type="text"
                        readOnly
                        placeholder="Upload your resume"
                        className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                        value={watch("upload_cv")?.[0]?.name || ""}
                    />
                </div>
                <label 
                    htmlFor="upload_cv"
                    className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6 cursor-pointer"
                >
                    Upload
                </label>
            </div>

            {/* Insurance */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold mb-1">Insurance</label>
                    <input 
                        type="file"
                        id="insurance"
                        {...register("insurance")}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden" 
                    />
                    <input
                        type="text"
                        readOnly
                        placeholder="Upload insurance document"
                        className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                        value={watch("insurance")?.[0]?.name || ""}
                    />
                </div>
                <label 
                    htmlFor="insurance"
                    className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6 cursor-pointer"
                >
                    Upload
                </label>
            </div>

            {/* Passport */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold mb-1">Passport*</label>
                    <input 
                        type="file"
                        id="passport"
                        {...register("passport")}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden" 
                    />
                    <input
                        type="text"
                        readOnly
                        placeholder="Upload passport"
                        className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                        value={watch("passport")?.[0]?.name || ""}
                    />
                </div>
                <label 
                    htmlFor="passport"
                    className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6 cursor-pointer"
                >
                    Upload
                </label>
            </div>

            {/* Visa */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold mb-1">Visa*</label>
                    <input 
                        type="file"
                        id="visa"
                        {...register("visa")}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden" 
                    />
                    <input
                        type="text"
                        readOnly
                        placeholder="Upload visa"
                        className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                        value={watch("visa")?.[0]?.name || ""}
                    />
                </div>
                <label 
                    htmlFor="visa"
                    className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6 cursor-pointer"
                >
                    Upload
                </label>
            </div>
        </div>

        {/* Second Row - 3 documents */}
        <div className="grid grid-cols-4 gap-6 mb-6">
            {/* NOC */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold mb-1">NOC</label>
                    <input 
                        type="file"
                        id="noc"
                        {...register("noc")}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden" 
                    />
                    <input
                        type="text"
                        readOnly
                        placeholder="Upload NOC"
                        className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                        value={watch("noc")?.[0]?.name || ""}
                    />
                </div>
                <label 
                    htmlFor="noc"
                    className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6 cursor-pointer"
                >
                    Upload
                </label>
            </div>

            {/* License */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold mb-1">Vehicle License</label>
                    <input 
                        type="file"
                        id="license"
                        {...register("license")}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden" 
                    />
                    <input
                        type="text"
                        readOnly
                        placeholder="Upload license"
                        className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                        value={watch("license")?.[0]?.name || ""}
                    />
                </div>
                <label 
                    htmlFor="license"
                    className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6 cursor-pointer"
                >
                    Upload
                </label>
            </div>

            {/* Experience Certificate */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="text-sm font-semibold mb-1">Experience Certificate</label>
                    <input 
                        type="file"
                        id="experience_certificate"
                        {...register("experience_certificate")}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden" 
                    />
                    <input
                        type="text"
                        readOnly
                        placeholder="Upload experience certificate"
                        className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                        value={watch("experience_certificate")?.[0]?.name || ""}
                    />
                </div>
                <label 
                    htmlFor="experience_certificate"
                    className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6 cursor-pointer"
                >
                    Upload
                </label>
            </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Note: Please ensure all relevant documents are uploaded in the required format. Each file should not exceed 500 KB in size. Larger files may not be accepted by the system. Kindly compress your documents if necessary before uploading.</p>
    </div>
)}
                    {activeTab === "Other Information" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-col gap-1 items-start">
                                {/* Photo Upload */}
                                <div className="flex gap-6 w-full">
                                    {/* Form Fields */}
                                    <div className="flex flex-col gap-4 flex-1">
                                        {/* First Row*/}
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex flex-col flex-1 min-w-[150px]">
                                                <label className="text-sm font-semibold pb-3">
                                                    Additional Notes or Information
                                                </label>
                                                <textarea
                                                    {...register("additional_notes")}
                                                    className="w-full h-24 rounded-[5px] border-1 border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Referral Contact Details */}
                                        <div className="flex flex-row gap-4 flex-wrap">
                                            <div className="w-3/4 max-w-full">
                                                <label className="text-sm font-semibold ">
                                                    Referral Contact Details
                                                </label>
                                                <div className="flex flex-row gap-4 max-w-full">
                                                    {/* Name Field */}
                                                    <div className="flex flex-col flex-1 min-w-[150px]">
                                                        <label className="text-sm font-semibold mb-1">
                                                            Name
                                                        </label>
                                                        <InputField
                                                            type="text"
                                                            {...register("referral_name")}
                                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                            label={""}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col flex-1 min-w-[150px]">
                                                        <label className="text-sm font-semibold mb-1">
                                                            Contact
                                                        </label>
                                                        <InputField
                                                            type="text"
                                                            maxLength={10}
                                                            {...register("referral_contact")}
                                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                            label={""}
                                                        />
                                                        {errors.referral_contact && (
                                                            <p className="text-sm text-red-500">{errors.referral_contact.message}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col flex-1 min-w-[150px]">
                                                        <label className="text-sm font-semibold mb-1">
                                                            Choose Company or Individual
                                                        </label>
                                                        <SelectField
                                                            label={""}
                                                            // {...register("preferred_work_location")}
                                                            value={selection}
                                                            onChange={(e) => setSelection(e.target.value)}
                                                            options={[
                                                                { value: "", label: "Select Company or Individual" },
                                                                { value: "Company", label: "Company" },
                                                                { value: "Individual", label: "Individual" },
                                                            ]}
                                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                        />
                                                    </div>
                                                    {selection === "Company" && (
                                                        <div className="flex flex-col flex-1 min-w-[150px]">
                                                            <label className="text-sm font-semibold mb-1">
                                                                Company contact details
                                                            </label>
                                                            <SelectField
                                                                label={""}
                                                                //{...register("preferred_work_location")}
                                                                options={[
                                                                    { value: "", label: "Select Company contact details" },
                                                                    { value: "Company Name", label: "Company Name" },
                                                                    { value: "Company Contact Person", label: "Company Contact Person" },
                                                                ]}
                                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                            />
                                                        </div>
                                                    )}
                                                    {selection === "Individual" && (
                                                        <div className="flex flex-col flex-1 min-w-[150px]">
                                                            <label className="text-sm font-semibold mb-1">
                                                                Individual contact details
                                                            </label>
                                                            <SelectField
                                                                label={""}
                                                                // {...register("preferred_work_location")}
                                                                options={[
                                                                    { value: "", label: "Select Individual contact details" },
                                                                    { value: "Individual Name", label: "Individual Name" },
                                                                    { value: "Individual Contact Person", label: "Individual Contact Person" },
                                                                ]}
                                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>


                {/* Buttons */}
                <div className="absolute bottom-0 left-0 right-0 py-4 ">
                    <div className="flex justify-center gap-4 mt-8 ">
                        <div>
                            <Button
                                onClick={closePopup}
                                buttonType="button"
                                buttonTitle="Cancel"
                                className="px-7 py-2.5 text-armsBlack rounded-sm font-semibold hover:bg-gray-200 cursor-pointer"
                            />
                        </div>
                        <div>
                            <Button
                                onClick={handleFormSubmit}
                                buttonType="button"
                                buttonTitle="Submit"
                                className="bg-armsjobslightblue text-lg text-armsWhite font-bold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
