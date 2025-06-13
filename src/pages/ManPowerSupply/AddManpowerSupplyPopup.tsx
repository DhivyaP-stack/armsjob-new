import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../../common/Button"
import { InputField } from "../../common/InputField";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AddManpowerSupply } from "../../Commonapicall/ManpowerSupplyapicall/Manpowerapis";
import { dropdowngetCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";
import Select from "react-select";
interface ManpowerAddPopupProps {
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

//Company details schema
const CompanydetailsSchema = zod.object({
    company_name: zod.string().optional(),
    contact_person_name: zod.string().min(3, "Contactperson name is required"),
    mobile_no: zod
        .string()
        .min(3, "WhatsApp number is required")
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    whatsapp_no: zod
        .string()
        .min(3, "WhatsApp number is required")
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email: zod
        .string()
        .min(3, "Email ID is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    office_location: zod.string().optional(),
});

// ManpowerInfo Schema
const manpowerinfoSchema = zod.object({
    categories_available: zod.string().optional(),
    quantity_per_category: zod.string().optional(),
});

// Documents Schema
const documentsSchema = zod.object({
    trade_license: zod.any(), // Adjust based on your file validation needs
    company_license: zod.any(),
});

// Other Information Schema
const expSchema = zod.object({
    previous_experience: zod.string().optional(),
    worked_with_arms_before: zod.string().optional(),
});

const additionalSchema = zod.object({
    comments: zod.string().optional(),
});

// Combined Schema
const ManpowerSchema = CompanydetailsSchema
    .merge(manpowerinfoSchema)
    .merge(documentsSchema)
    .merge(expSchema)
    .merge(additionalSchema)

type ManpowerFormData = zod.infer<typeof ManpowerSchema>;

export const AddManpowerPopup: React.FC<ManpowerAddPopupProps> = ({
    closePopup,
    refreshData,
}) => {
    //   if (!isOpen) return null;
    const [activeTab, setActiveTab] = useState("Company Details");
    const tabs = ['Company Details', "Manpower Information", "Documents", "Experience", "Additional"];
    const [, setLoading] = useState(false);
    const [, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ManpowerFormData>({
        resolver: zodResolver(ManpowerSchema),
        defaultValues: {
            previous_experience: "no", // Set default value for radio buttons
            worked_with_arms_before: "no"
        },
    });


    const handleCategoryChange = (
        selectedOptions: readonly { value: string; label: string }[] | null
    ) => {
        const newSelected = selectedOptions || [];
        // Extract only the IDs and join with commas
        const categoryIds = newSelected.map(opt => opt.value).join(',');
        setValue('categories_available', categoryIds); // Pass to form
    };

    const categoryOptions = categories.map(cat => ({
        value: cat.id.toString(),      // use ID as value
        label: cat.category            // show category name
    }));


    const tabFieldMapping: Record<string, string[]> = {
        "Company Details": [
            'company_name',
            'contact_person_name',
            'mobile_no',
            'whatsapp_no',
            'email',
            'office_location'
        ],
        "Manpower Information": [
            'categories_available',
            'quantity_per_category',
        ],
        "Documents": [
            'trade_license',
            'company_license',
        ],
        "Experience": [
            'previous_experience',
            'worked_with_arms_before'
        ],
        "Additional": [
            'comments'
        ],
    };

    const [scrollToField, setScrollToField] = useState<string | null>(null);
    console.log("scrollToField", scrollToField)

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Combine form validation and submission in one step
        handleSubmit(async (data: ManpowerFormData) => {
            setLoading(true);
            setError(null);
            try {
                // Call the API function with all the form data
                const response = await AddManpowerSupply(
                    data.company_name || '',
                    data.contact_person_name || '',
                    data.mobile_no || '',
                    data.whatsapp_no || '',
                    data.email || '',
                    data.office_location || '',
                    data.categories_available || '',
                    data.quantity_per_category || '',
                    data.previous_experience || '',
                    data.worked_with_arms_before || '',
                    data.comments || ''
                );

                // On success
                reset();
                closePopup();
                refreshData();
                console.log("Manpower Supply added successfully", response);
                toast.success("Manpower Supply added successfully");
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
            <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] max-xl:!h-[85%] max-lg:!h-[90%] max-md:!h-[85%] p-6 relative">
                {/* Heading */}
                <div className="relative mb-5">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
                        Add Manpower Supply
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

                <form onSubmit={handleFormSubmit} className="h-[calc(100%-150px)] overflow-y-auto">
                    {/* Company Details */}
                    {activeTab === "Company Details" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 w-3/4">
                                    {/* Form Fields */}
                                    <div className="flex flex-col gap-4 flex-1">
                                        {/* First Row */}
                                        <div className="grid grid-cols-4 max-xl:!grid-cols-3 w-ful gap-4">
                                            {/* Company Name */}
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
                                            {/* Mobile Number */}
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
                                            {/* Mobile Number */}
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Mobile Number<span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("mobile_no")}
                                                    name="mobile_no"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.mobile_no && <p className="text-sm text-red-500">{errors.mobile_no.message}</p>}
                                            </div>
                                            {/* WhatsApp Number */}
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    WhatsApp Number<span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("whatsapp_no")}
                                                    name="whatsapp_no"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.whatsapp_no && <p className="text-sm text-red-500">{errors.whatsapp_no.message}</p>}
                                            </div>
                                            {/* Email ID */}
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Email ID<span className="text-red-500">*</span>
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

                                            <div >
                                                <label className="text-sm font-semibold mb-1">Office Location</label>
                                                <InputField
                                                    type="text"
                                                    {...register("office_location")}
                                                    name="office_location"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Manpower Information */}
                    {activeTab === "Manpower Information" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 w-1/2">
                                    {/* Form Fields */}
                                    <div className="flex flex-col gap-4 flex-1">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Categories Available
                                                </label>
                                                <Select
                                                    isMulti
                                                    name="categories_available"
                                                    options={categoryOptions}
                                                    // value={selectedCategories} // array of { value, label }
                                                    onChange={handleCategoryChange}
                                                    // className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5"
                                                    classNamePrefix="select"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Quantity per Category
                                                </label>
                                                <InputField
                                                    type="range"
                                                    min={1}
                                                    max={10}
                                                    step={1}
                                                    {...register("quantity_per_category")}
                                                    name="quantity_per_category"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Select a quantity from 1 to 10.
                                                </p>
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
                            {/* First Row - 2 documents */}
                            <div className="grid grid-cols-4 gap-6 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm font-semibold mb-1">Trade License*</label>
                                        <input type="text" className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none" readOnly placeholder="Upload trade license" />
                                    </div>
                                    <Button
                                        buttonType="button"
                                        buttonTitle="Upload"
                                        className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm font-semibold mb-1">Company License*</label>
                                        <input type="text" className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none" readOnly placeholder="Upload company license" />
                                    </div>
                                    <Button
                                        buttonType="button"
                                        buttonTitle="Upload"
                                        className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue mt-6"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Note: Please ensure all relevant documents are uploaded in the required format. Each file should not exceed 500 KB in size. Larger files may not be accepted by the system. Kindly compress your documents if necessary before uploading.</p>
                        </div>
                    )}

                    {activeTab === "Experience" && (
                        <div className="flex  gap-4 px-4 w-1/2 ">
                            <div className="w-full">
                                <label className="text-sm font-semibold mb-1 block">
                                    Previous experience in manpower supplying
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("previous_experience")}
                                            name="previous_experience"
                                            value="yes"
                                            className="w-5 h-5 cursor-pointer "
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("previous_experience")}
                                            name="previous_experience"
                                            value="no"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                            <div className="w-full">
                                <label className="text-sm font-semibold mb-1 block">
                                    If worked earlier with Arms
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("worked_with_arms_before")}
                                            name="worked_with_arms_before"
                                            value="yes"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("worked_with_arms_before")}
                                            name="worked_with_arms_before"
                                            value="no"
                                            className="w-5 h-5 cursor-pointer "
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comments */}
                    {activeTab === "Additional" && (
                        <div className="flex  gap-4 px-4 w-1/4 ">
                            <div className="w-full">
                                <label className="text-sm font-semibold mb-1 block pb-0.5">
                                    Comments
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
                <div className="absolute bottom-0 left-0 right-0 py-4 ">
                    <div className="flex justify-center gap-4 mt-8 ">
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
