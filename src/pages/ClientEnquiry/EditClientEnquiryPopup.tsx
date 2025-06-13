

import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
// import DefaultProfile from "../../assets/images/DefaultProfile.jpg"
import { Button } from "../../common/Button"
import { InputField } from "../../common/InputField";
import { SelectField } from "../../common/SelectField";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditClientEnquiry } from "../../Commonapicall/ClientEnquiryapicall/ClientEnquiryapis";
import { toast } from "react-toastify";
import Select from "react-select";
import { dropdowngetCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";

interface EditClientEnquiryAddPopupProps {
    // isOpen: boolean;
    closePopup: () => void;
    refreshData: () => void;
    editClientEnquiry: {
        id: number;
        company_name: string;
        email: string;
        contact_person_name: string;
        mobile_number: string;
        nature_of_work: string;
        project_location: string;
        project_duration: string;
        categories_required: string;
        quantity_required: string;
        project_start_date: string;
        kitchen_facility: boolean;
        transportation_provided: boolean;
        accommodation_provided: boolean;
        remarks: string;
        query_type: string;
    }
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

const companydetailsSchema = zod.object({
    company_name: zod.string().optional(),
    email: zod
        .string()
        .min(3, "Email is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    contact_person_name: zod.string().min(3, "Contact Person name is required"),
    mobile_number: zod
        .string()
        .min(3, "Mobile number is required")
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
});

// Visa & Work Eligibility Schema
const personalSchema = zod.object({
    nature_of_work: zod.string().optional(),
    project_location: zod.string().optional(),
    project_duration: zod.string().optional(),
    categories_required: zod.string().optional(),
    quantity_required: zod.string().optional(),
    project_start_date: zod.string().optional(),
});

// Job Information Schema
const facilityInfoSchema = zod.object({
    kitchen_facility: zod.string().optional(),
    transportation_provided: zod.string().optional(),
    accommodation_provided: zod.string().optional(),
});

// Documents Schema
const remarksSchema = zod.object({
    remarks: zod.string().optional(),
    query_type: zod.string().optional(),
});

// Combined Schema
const clientenquirySchema = companydetailsSchema
    .merge(personalSchema)
    .merge(facilityInfoSchema)
    .merge(remarksSchema)

type ClientEnquiryFormData = zod.infer<typeof clientenquirySchema>;

export const EditClientEnquiryPopup: React.FC<EditClientEnquiryAddPopupProps> = ({
    // isOpen,
    closePopup,
    refreshData,
    editClientEnquiry,
}) => {
    //   if (!isOpen) return null;
    const [activeTab, setActiveTab] = useState("Company Details");
    const tabs = ['Company Details', "Personal Information", "Facility Info", "Remarks"];
    const [, setLoading] = useState(false);
    const [, setError] = useState<string | null>(null);
    const [selection, setselection] = useState('');
    const [, setCategories] = useState<Category[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<{ value: string; label: string }[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ClientEnquiryFormData>({
        resolver: zodResolver(clientenquirySchema),
        defaultValues: {
            kitchen_facility: "no",
            transportation_provided: "no",
            accommodation_provided: "no"
        },
    });

    const tabFieldMapping: Record<string, string[]> = {
        "Company Details": [
            'company_name',
            'email',
            'contact_person_name',
            'mobile_number',
        ],
        "Personal Information": [
            'nature_of_work',
            'project_location',
            'project_duration',
            'categories_required',
            'quantity_required',
            'project_start_date',
        ],
        "Facility Info": [
            'kitchen_facility',
            'transportation_provided',
            'accommodation_provided',
        ],
        "Remarks": [
            'remarks',
            'query_type',
        ],
    };

    const handleCategoryChange = (
        selectedOptions: readonly { value: string; label: string }[] | null
    ) => {
        const newSelected = selectedOptions || [];
        setSelectedCategories([...newSelected]);
        // Extract only the IDs and join with commas
        const categoryIds = newSelected.map(opt => opt.value).join(',');
        setValue('categories_required', categoryIds); // Pass to form
    };

    useEffect(() => {
        if (editClientEnquiry) {
            setValue("company_name", editClientEnquiry.company_name);
            setValue("email", editClientEnquiry.email);
            setValue("contact_person_name", editClientEnquiry.contact_person_name);
            setValue("mobile_number", editClientEnquiry.mobile_number);
            setValue("nature_of_work", editClientEnquiry.nature_of_work || '');
            setValue("project_location", editClientEnquiry.project_location || '');
            setValue("project_duration", editClientEnquiry.project_duration || '');
            setValue("categories_required", editClientEnquiry.categories_required || '');
            setValue("quantity_required", editClientEnquiry.quantity_required || '');
            setValue("project_start_date", editClientEnquiry.project_start_date || '');
            setValue("kitchen_facility", editClientEnquiry.kitchen_facility ? 'yes' : 'no');
            setValue("transportation_provided", editClientEnquiry.transportation_provided ? 'yes' : 'no');
            setValue("accommodation_provided", editClientEnquiry.accommodation_provided ? 'yes' : 'no');
            setValue("remarks", editClientEnquiry.remarks || '');
            setValue("query_type", editClientEnquiry.query_type || '')
            setselection(editClientEnquiry.query_type || ''); // Add this line
        }
    }, [editClientEnquiry, setValue]);

    const [scrollToField, setScrollToField] = useState<string | null>(null);
    console.log("scrollToField", scrollToField)

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Combine form validation and submission in one step
        handleSubmit(async (data: ClientEnquiryFormData) => {
            setLoading(true);
            setError(null);
            try {
                // Call the API function with all the form data
                const response = await EditClientEnquiry(
                    editClientEnquiry.id,
                    data.company_name || '',
                    data.email || '',
                    data.contact_person_name || '',
                    data.mobile_number || '',
                    data.nature_of_work || '',
                    data.project_location || '',
                    data.project_duration || '',
                    data.categories_required || '',
                    data.quantity_required || '',
                    data.project_start_date || '',
                    data.kitchen_facility || '',
                    data.transportation_provided || '',
                    data.accommodation_provided || '',
                    data.remarks || '',
                    data.query_type || ''
                );

                // On success
                reset();
                closePopup();
                refreshData();
                console.log("Client Enquiry Updated successfully", response);
                toast.success("Client Enquiry Updated successfully");
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

    const handleQueryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setselection(selectedValue); // Update local state
        setValue("query_type", selectedValue); // Update react-hook-form field
        // Clear remarks if not "Others"
        if (selectedValue !== "Others") {
            setValue("remarks", "");
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await dropdowngetCategories() as CategoryApiResponse;
                setCategories(data.data);
                // Set options for react-select
                const options = data.data.map(cat => ({
                    value: cat.id.toString(),
                    label: cat.category
                }));
                setCategoryOptions(options);
            } catch (error) {
                console.error("Failed to fetch categories", error);
                toast.error("Failed to load categories");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (editClientEnquiry?.categories_required && categoryOptions.length > 0) {
            const ids = editClientEnquiry.categories_required.split(','); // ["10", "13", "12"]
            const selected = categoryOptions.filter(opt => ids.includes(opt.value));
            setSelectedCategories(selected);
            // Set form value
            setValue('categories_required', ids.join(','));
        }
    }, [editClientEnquiry, categoryOptions, setValue]);

    return (
        <div className="fixed inset-0 bg-armsAsh bg-opacity-70 flex justify-center items-start pt-25 z-50">
            <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] p-6 relative">
                {/* Heading */}
                <div className="relative mb-5">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
                        Edit Client Enquiry
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
                {/* Company Details */}
                <form onSubmit={handleFormSubmit} className="h-[calc(100%-150px)] overflow-y-auto">
                    {activeTab === "Company Details" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 w-3/4">
                                    {/* Form Fields */}
                                    <div className="flex flex-col gap-4 flex-1">
                                        <div className="grid grid-cols-4 gap-4 max-xl:!grid-cols-3">
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
                                                {errors.company_name && <p className="text-sm text-red-500">{errors.company_name.message}</p>}
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
                                            {/* Contact Person Name */}
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
                                                    type="tel"
                                                    {...register("mobile_number")}
                                                    name="mobile_number"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.mobile_number && <p className="text-sm text-red-500">{errors.mobile_number.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Personal Information */}
                    {activeTab === "Personal Information" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 max-lg:!w-full w-3/4">
                                    <div className="flex flex-col gap-4 flex-1">
                                        <div className="grid grid-cols-4 max-xl:!grid-cols-3 gap-4">
                                            {/* Nature of Work */}
                                            <div>
                                                <label className="text-sm font-semibold mb-1 block">
                                                    Nature of Work
                                                </label>
                                                <SelectField
                                                    label={""}
                                                    {...register("nature_of_work")}
                                                    options={[
                                                        { value: "", label: "Select Nature of Work" },
                                                        { value: "Open space", label: "Open space" },
                                                        { value: "Closed space", label: "Closed space" },

                                                    ]}
                                                    className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                />
                                            </div>
                                            {/* Project Location */}
                                            <div>
                                                <label className="text-sm font-semibold mb-1 block">
                                                    Project Location(Emirates)
                                                </label>
                                                <SelectField
                                                    label={""}
                                                    {...register("project_location")}
                                                    options={[
                                                        { value: "", label: "Select Project Location" },
                                                        { value: "Emirates", label: "Emirates" },
                                                    ]}
                                                    className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                />
                                            </div>
                                            {/* Project Duration */}
                                            <div>
                                                <label className="text-sm font-semibold mb-1 block">
                                                    Project Duration
                                                </label>
                                                <SelectField
                                                    label={""}
                                                    {...register("project_duration")}
                                                    options={[
                                                        { value: "", label: "Select Project Duration" },
                                                        { value: "0-1 months", label: "0-1 months" },
                                                        { value: "2-3 months 2-3 months", label: "2-3 months" },
                                                        { value: "3-6 months", label: "3-6 months" },
                                                        { value: "6 and above", label: "6 and above" },
                                                    ]}
                                                    className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                />
                                            </div>
                                            {/* Categories Required */}
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Categories Required
                                                </label>
                                                {/* <InputField
                                                    type="text"
                                                    {...register("categories_required")}
                                                    name="categories_required"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                /> */}
                                                <Select
                                                    isMulti
                                                    options={categoryOptions}
                                                    value={selectedCategories} // array of { value, label }
                                                    {...register("categories_required")}
                                                    name="categories_required"
                                                    onChange={handleCategoryChange}
                                                    // className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5"
                                                    classNamePrefix="select"
                                                />
                                            </div>
                                            {/* Quantity Required */}
                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Quantity Required (per category)
                                                </label>
                                                <InputField
                                                    type="text"
                                                    {...register("quantity_required")}
                                                    name="quantity_required"
                                                    placeholder=""
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label=""
                                                />
                                            </div>
                                            {/* Project Start Date */}
                                            <div>
                                                <label className="text-sm font-semibold mb-1 block">
                                                    Project Start Date
                                                </label>
                                                <InputField
                                                    type="date"
                                                    {...register("project_start_date")}
                                                    name="project_start_date"
                                                    className="w-full rounded-[5px] cursor-pointer border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Facility Info" && (
                        <div className="flex flex-wrap gap-4 px-4 ">
                            {/* Kitchen Facilities Provided? */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold mb-1">
                                    Kitchen Facilities Provided?
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("kitchen_facility")}
                                            name="kitchen_facility"
                                            value="yes"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("kitchen_facility")}
                                            name="kitchen_facility"
                                            value="no"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                            {/* Transportation Provided? */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold mb-1">
                                    Transportation Provided?
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("transportation_provided")}
                                            name="transportation_provided"
                                            value="yes"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("transportation_provided")}
                                            name="transportation_provided"
                                            value="no"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold mb-1">
                                    Accommodation Provided?
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("accommodation_provided")}
                                            name="accommodation_provided"
                                            value="yes"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("accommodation_provided")}
                                            name="accommodation_provided"
                                            value="no"
                                            className=" w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Remarks */}
                    {activeTab === "Remarks" && (
                        <div className="grid grid-cols-2 max-lg:!w-full max-md:!grid-cols-1 max-xl:!grid-cols-2 gap-4 px-4 w-1/2">
                            <div>
                                <label className="text-sm font-semibold mb-1 mt-1 block">
                                    Query Type
                                </label>
                                <SelectField
                                    label={""}
                                    {...register("query_type")}
                                    options={[
                                        { value: "", label: "Select Project Duration" },
                                        { value: "Manpower Supply", label: "Manpower Supply" },
                                        { value: "Recruitment", label: "Recruitment" },
                                        { value: "Outsourcing", label: "Outsourcing" },
                                        { value: "Others", label: "Others" },
                                    ]}
                                    value={selection}
                                    onChange={handleQueryTypeChange}
                                    className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                />
                            </div>
                            {selection === "Others" && (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="additionalDetails" className="text-sm font-semibold">
                                        Remarks / Notes
                                    </label>
                                    <textarea
                                        id="additionalDetails"
                                        {...register("remarks")}
                                        name="remarks"
                                        rows={4}
                                        className="w-full h-9.5 rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus:outline-none resize-y"
                                        placeholder="Enter details here..."
                                    />
                                </div>
                            )}
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
