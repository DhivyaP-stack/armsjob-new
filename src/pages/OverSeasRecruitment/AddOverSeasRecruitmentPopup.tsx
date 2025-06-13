import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../../common/Button";
import { InputField } from "../../common/InputField";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addOverseasRecruitment } from "../../Commonapicall/Overseasapicall/Overseasapis";
import { toast } from "react-toastify";
import { SelectField } from "../../common/SelectField";
import { dropdowngetCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";
import Select from "react-select";

interface OverSeasAddPopupProps {
    closePopup: () => void;
    refreshData?: () => void;
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
    data: Category[];
}

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

// Helper function for file validation
const fileSchema = zod
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "File size must be less than or equal to 500KB",
    })
    .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png, and .pdf formats are supported"
    );

// Combined Schema
const overseasRecruitmentSchema = zod.object({
    company_name: zod.string().optional(),
    country: zod.string().optional(),
    contact_person_name: zod.string().min(1, "Contact person name is required"),
    mobile_no: zod
        .string()
        .min(3, "Mobile number is required")
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    whatsapp_no: zod
        .string()
        .min(3, "WhatsApp number is required")
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email_address: zod
        .string()
        .min(3, "Email ID is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    categories_you_can_provide: zod.string().optional(),
    nationality_of_workers: zod.string().optional(),
    mobilization_time: zod.string().optional(),
    uae_deployment_experience: zod.string().optional(),
    cv: zod.any()
        // .refine((files) => files?.length > 0, "CV is required")
        // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 500KB")
        .refine(
            (files) => !files?.[0] || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png, and .pdf formats are supported"
        ),
    // license: fileSchema.optional(),
    license:zod.any()
        .refine((files) => files?.length > 0, "License Copy is required")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 500KB")
        .refine(
            (files) => !files?.[0] || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png, and .pdf formats are supported"
        ),
    vehicle_license: fileSchema.optional(),
    // experience_certificate: fileSchema.optional(),
    experience_certificate: zod.any()
        // .refine((files) => files?.length > 0, "License Copy is required")
        // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 500KB")
        .refine(
            (files) => !files?.[0] || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png, and .pdf formats are supported"
        ),
    // photo_upload: fileSchema.optional(),
    photo_upload:  zod.any()
        .refine((files) => files?.length > 0, "Profile Photo is required")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 500KB")
        .refine(
            (files) => !files?.[0] || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png, and .pdf formats are supported"
        ),
    comments: zod.string().optional(),
});

type OverseasRecruitmentFormData = zod.infer<typeof overseasRecruitmentSchema>;

export const OverSeasAddPopup: React.FC<OverSeasAddPopupProps> = ({
    closePopup,
    refreshData
}) => {
    const [activeTab, setActiveTab] = useState("Company Details");
    const tabs = ['Company Details', "Recruitment Info", "Documents", "Notes"];
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<OverseasRecruitmentFormData>({
        resolver: zodResolver(overseasRecruitmentSchema),
        defaultValues: {
            uae_deployment_experience: "no",
        },
    });

    const handleCategoryChange = (
        selectedOptions: readonly { value: string; label: string }[] | null
    ) => {
        const newSelected = selectedOptions || [];
        const categoryIds = newSelected.map(opt => opt.value).join(',');
        setValue('categories_you_can_provide', categoryIds);
    };

    const categoryOptions = categories.map(cat => ({
        value: cat.id.toString(),
        label: cat.category
    }));

    const tabFieldMapping: Record<string, string[]> = {
        "Company Details": [
            'company_name',
            'country',
            'contact_person_name',
            'mobile_no',
            'whatsapp_no',
            'email_address'
        ],
        "Recruitment Info": [
            'categories_you_can_provide',
            'nationality_of_workers',
            'mobilization_time',
            'uae_deployment_experience',
        ],
        "Documents": [
            'cv',
            'license',
            'photo_upload',
            'experience_certificate'
        ],
        "Notes": [
            'comments',
        ],
    };

    const [scrollToField, setScrollToField] = useState<string | null>(null);

    const onSubmit = async (data: OverseasRecruitmentFormData) => {
        setError(null);
        try {
            const formData = new FormData();

            // Append all text fields
            formData.append('company_name', data.company_name || '');
            formData.append('country', data.country || '');
            formData.append('contact_person_name', data.contact_person_name);
            formData.append('mobile_no', data.mobile_no);
            formData.append('whatsapp_no', data.whatsapp_no);
            formData.append('email_address', data.email_address);
            formData.append('categories_you_can_provide', data.categories_you_can_provide || '');
            formData.append('nationality_of_workers', data.nationality_of_workers || '');
            formData.append('mobilization_time', data.mobilization_time || '');
            formData.append('uae_deployment_experience', data.uae_deployment_experience === "yes" ? "true" : "false");
            formData.append('comments', data.comments || '');

            // Append files if they exist
            if (data.cv?.[0]) formData.append('cv', data.cv[0]);
            if (data.photo_upload?.[0]) formData.append('photo_upload', data.photo_upload[0]);
            if (data.license?.[0]) formData.append('license', data.license[0]);
            if (data.experience_certificate?.[0]) formData.append('experience_certificate', data.experience_certificate[0]);

            const result = await addOverseasRecruitment(formData);
            console.log("add Overseas result", result);

            reset();
            closePopup();
            if (refreshData) refreshData();
            toast.success("Overseas recruitment added successfully");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to submit form";
            setError(errorMessage);
            toast.error("Failed to submit form");
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
    };

    useEffect(() => {
        if (scrollToField) {
            const tabContent = document.querySelector('.tab-content');
            if (tabContent) {
                tabContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            const timeout = setTimeout(() => {
                const el = document.querySelector(`[name="${scrollToField}"]`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    (el as HTMLElement).focus();
                }
                setScrollToField(null);
            }, 300);

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
            <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] max-xl:!h-[85%] max-lg:!h-[90%] p-6 relative">
                {/* Heading */}
                <div className="relative mb-5">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
                        Add Overseas Recruitment
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

                {/* Error message display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleFormSubmit} className="h-[calc(100%-150px)] overflow-y-auto">
                    {/* Company Details */}
                    {activeTab === "Company Details" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 w-3/4">
                                    <div className="flex flex-col gap-4 flex-1">
                                        <div className="grid max-xl:!grid-cols-3 grid-cols-4 gap-4 ">
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Company Name
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("company_name")}
                                                    name="company_name"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Country
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("country")}
                                                    name="country"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Contact Person Name<span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("contact_person_name")}
                                                    name="contact_person_name"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.contact_person_name && <p className="text-sm text-red-500">{errors.contact_person_name.message}</p>}
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Mobile Number<span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="tel"
                                                    {...register("mobile_no")}
                                                    name="mobile_no"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.mobile_no && <p className="text-sm text-red-500">{errors.mobile_no.message}</p>}
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1 block">
                                                    WhatsApp Number<span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="tel"
                                                    {...register("whatsapp_no")}
                                                    name="whatsapp_no"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label=""
                                                />
                                                {errors.whatsapp_no && <p className="text-sm text-red-500">{errors.whatsapp_no.message}</p>}
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Email ID<span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="email"
                                                    {...register("email_address")}
                                                    name="email_address"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.email_address && <p className="text-sm text-red-500">{errors.email_address.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recruitment Info */}
                    {activeTab === "Recruitment Info" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 w-3/4">
                                    <div className="flex flex-col gap-4 flex-1">
                                        <div className="grid grid-cols-3 max-lg:!grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Categories You Can Provide
                                                </label>
                                                <Select
                                                    isMulti
                                                    name="categories_you_can_provide"
                                                    options={categoryOptions}
                                                    onChange={handleCategoryChange}
                                                    classNamePrefix="select"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Nationality of Workers
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("nationality_of_workers")}
                                                    name="nationality_of_workers"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Note: If multiple Nationalitiy of workers, separate them with commas.
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Mobilization Time
                                                </label>
                                                <SelectField
                                                    label={""}
                                                    {...register("mobilization_time")}
                                                    name="mobilization_time"
                                                    options={[
                                                        { value: "", label: "Select Mobilization Time" },
                                                        { value: "3-5 Days", label: "3-5 Days" },
                                                        { value: "5-10 Days", label: "5-10 Days" },
                                                        { value: "10-15 Days", label: "10-15 Days" },
                                                        { value: "15+ Days", label: "15+ Days" },
                                                    ]}
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    UAE Deployment Experience
                                                </label>
                                                <div className="flex gap-6">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            {...register("uae_deployment_experience")}
                                                            value="yes"
                                                            className="w-5 h-5 cursor-pointer"
                                                        />
                                                        Yes
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            {...register("uae_deployment_experience")}
                                                            value="no"
                                                            className="w-5 h-5 cursor-pointer"
                                                        />
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {activeTab === "Documents" && (
                        <div className="max-w-full mx-auto p-4">
                            <div className="grid grid-cols-4 items-start gap-6 mb-6">
                                <div className="flex flex-col gap-4">
                                    <label className="text-sm font-semibold mb-1">Upload CV<span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                id="cv"
                                                {...register("cv")}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                            />
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Upload your CV"
                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                value={watch("cv")?.[0]?.name || ""}
                                            />
                                        </div>
                                        <label
                                            htmlFor="cv"
                                            className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue cursor-pointer"
                                        >
                                            Upload
                                        </label>
                                    </div>
                                    {errors.cv && <p className="text-sm text-red-500">{errors.cv.message as string}</p>}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <label className="text-sm font-semibold mb-1">License Copy</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
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
                                                placeholder="Upload license copy"
                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                // value={watch("")?.name || ""}
                                                value={watch("license")?.[0]?.name || ""}
                                            />
                                        </div>
                                        <label
                                            htmlFor="license"
                                            className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue cursor-pointer"
                                        >
                                            Upload
                                        </label>
                                    </div>
                                    {errors.license && <p className="text-sm text-red-500">{errors.license.message as string}</p>}
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="text-sm font-semibold mb-1">Profile*</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                id="photo_upload"
                                                {...register("photo_upload")}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                            />
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Upload Profile Photo"
                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                // value={watch("")?.name || ""}
                                                value={watch("photo_upload")?.[0]?.name || ""}
                                            />
                                        </div>
                                        <label
                                            htmlFor="photo_upload"
                                            className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue cursor-pointer"
                                        >
                                            Upload
                                        </label>
                                    </div>
                                    {errors.photo_upload && <p className="text-sm text-red-500">{errors.photo_upload.message as string}</p>}
                                </div>

                                {/* <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm font-semibold mb-1">Profile*</label>
                                        <input
                                            type="file"
                                            id="photo_upload"
                                            {...register("photo_upload")}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                        />
                                        <input
                                            type="text"
                                            readOnly
                                            placeholder="Upload photo_upload"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            // value={watch("")?.[0]?.name || ""}
                                             value={watch("photo_upload")?.[0]?.name || ""}
                                        />
                                    </div>
                                    <label
                                        htmlFor="photo_upload"
                                        className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6 cursor-pointer"
                                    >
                                        Upload
                                    </label>
                                </div> */}

                                <div className="flex flex-col gap-4">
                                    <label className="text-sm font-semibold mb-1">Experience Certificate</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
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
                                                // value={watch("")?.name || ""}
                                                value={watch("experience_certificate")?.[0]?.name || ""}
                                            />
                                        </div>
                                        <label
                                            htmlFor="experience_certificate"
                                            className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue cursor-pointer"
                                        >
                                            Upload
                                        </label>
                                    </div>
                                    {errors.experience_certificate && <p className="text-sm text-red-500">{errors.experience_certificate.message as string}</p>}
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">
                                Note: Please ensure all relevant documents are uploaded in the required format.
                                Each file should not exceed 500 KB in size. Supported formats: JPG, JPEG, PNG, PDF.
                            </p>
                        </div>
                    )}

                    {/* Notes */}
                    {activeTab === "Notes" && (
                        <div className="flex gap-4 px-4 w-1/4">
                            <div className="w-full">
                                <label className="text-sm font-semibold mb-1 block pb-0.5">
                                    Additional Details
                                </label>
                                <textarea
                                    {...register("comments")}
                                    name="comments"
                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                />
                            </div>
                        </div>
                    )}
                </form>

                {/* Buttons */}
                <div className="absolute bottom-0 left-0 right-0 py-4">
                    <div className="flex justify-center gap-4 mt-8">
                        <div>
                            <Button
                                onClick={closePopup}
                                buttonType="button"
                                buttonTitle="Cancel"
                                className="px-7 py-2.5 cursor-pointer text-armsBlack rounded-sm font-semibold hover:bg-gray-200"
                            />
                        </div>
                        <div>
                            <Button
                                onClick={handleFormSubmit}
                                buttonType="submit"
                                buttonTitle="Submit"
                                className="bg-armsjobslightblue text-lg text-armsWhite font-bold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



