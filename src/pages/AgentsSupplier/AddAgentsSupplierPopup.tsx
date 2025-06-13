import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../../common/Button"
import { InputField } from "../../common/InputField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { toast } from "react-toastify";
import Select from "react-select";
import { dropdowngetCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";

interface AddAgentsSupplierPopupProps {
    closePopup: () => void;
    onAgentAdded?: () => void;
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

export const agentSchema = z.object({
    // agent details
    name: z.string().min(1, "Name is required"),
    mobile_no: z
        .string()
        .min(3, "Mobile number is required")
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    whatsapp_no: z
        .string()
        .min(3, "Whatsapp number is required")
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email: z
        .string()
        .min(3, "Email ID is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    //eligibility and history
    can_recruit: z.string().optional(),
    associated_earlier: z.string().optional(),
    can_supply_manpower: z.string().optional(),
    //Man power info
    supply_categories: z.string().optional(),
    quantity_estimates: z.string().optional(),
    areas_covered: z.string().optional(),
    // additional info
    additional_notes: z.string().optional()
});

type AgentFormData = z.infer<typeof agentSchema>;

type OptionType = { value: string; label: string };

const emiratesOptions: OptionType[] = [
    { value: "Abu Dhabi", label: "Abu Dhabi" },
    { value: "Dubai", label: "Dubai" },
    { value: "Sharjah", label: "Sharjah" },
    { value: "Ajman", label: "Ajman" },
    { value: "Umm Al Quwain", label: "Umm Al Quwain" },
    { value: "Ras Al Khaimah", label: "Ras Al Khaimah" },
    { value: "Fujairah", label: "Fujairah" },
];

export const AddAgentsSupplierPopup: React.FC<AddAgentsSupplierPopupProps> = ({
    closePopup,
    onAgentAdded,
}) => {
    const [activeTab, setActiveTab] = useState("Agent Details");
    const [, setIsSubmitting] = useState(false);
    const tabs = ["Agent Details", "Eligibility & History", "Manpower Info", "Additional Info"];
    const [categories, setCategories] = useState<Category[]>([]);

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<AgentFormData>({
        resolver: zodResolver(agentSchema),
        defaultValues: {
            can_recruit: "no",
            associated_earlier: "no",
            can_supply_manpower: "no",
        }
    });

    const [selectedAreas, setSelectedAreas] = useState([]);

    const handleChange = (selectedOptions: any) => {
        setSelectedAreas(selectedOptions);
        // Convert selected options to comma-separated string of values
        const areasString = selectedOptions.map((option: OptionType) => option.value).join(', ');
        setValue('areas_covered', areasString);
    };

    const handleCategoryChange = (
        selectedOptions: readonly { value: string; label: string }[] | null
    ) => {
        const newSelected = selectedOptions || [];
        // Extract only the IDs and join with commas
        const categoryIds = newSelected.map(opt => opt.value).join(',');
        setValue('supply_categories', categoryIds); // Pass to form
    };

    const categoryOptions = categories.map(cat => ({
        value: cat.id.toString(),      // use ID as value
        label: cat.category            // show category name
    }));

    const tabFieldMapping: Record<string, string[]> = {
        "Agent Details": [
            'name',
            'mobile_no',
            'whatsapp_no',
            'email'
        ],
        "Eligibility & History": [
            'can_recruit',
            'associated_earlier',
            'can_supply_manpower'
        ],
        "Manpower Info": [
            'quantity_estimates',
            'supply_categories',
            'areas_covered',
        ],
        "Additional Info": [
            'additional_notes'
        ],
    };

    const [scrollToField, setScrollToField] = useState<string | null>(null);
    console.log("scrollToField", scrollToField)

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Combine form validation and submission in one step
        handleSubmit(async (data: AgentFormData) => {
            setIsSubmitting(true);
            try {
                const response = await axios.post("https://armsjob.vercel.app/api/agents/", data, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.status === 200 || response.status === 201) {
                    console.log('Agent added successfully');
                    toast.success('Agent added successfully');
                    closePopup();
                    if (onAgentAdded) onAgentAdded();
                } else {
                    throw new Error("Failed to add agent");
                }
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Failed to submit form";
                console.error("Error adding agent:", errorMessage);
                toast.error("Error adding agent");
            } finally {
                setIsSubmitting(false);
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
            <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] p-6 relative">
                {/* Heading */}
                <div className="relative mb-5">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
                        Add Manpower Supply/Agents
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
                <form onSubmit={handleFormSubmit}>
                    {/* Agent Details */}
                    {activeTab === "Agent Details" && (
                        <div className="max-w-full mx-auto p-0 pl-1 ">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid w-3/4 md:grid-cols-2 lg:grid-cols-3 grid-cols-3 gap-4">
                                    {/* Name of Agent */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Name of Manpower Supply/Agents<span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            type="text"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            label={""}
                                            {...register("name")}
                                            name="name"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>
                                    {/* Mobile Number */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            type="text"
                                            {...register("mobile_no")}
                                            name="mobile_no"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            label={""}
                                        />
                                        {errors.mobile_no && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.mobile_no.message}
                                            </p>
                                        )}
                                    </div>
                                    {/* WhatsApp Number */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            WhatsApp Number <span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            type="text"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            label={""}
                                            {...register("whatsapp_no")}
                                            name="whatsapp_no"
                                        />
                                        {errors.whatsapp_no && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.whatsapp_no.message}
                                            </p>
                                        )}
                                    </div>
                                    {/* Email ID  */}
                                    <div >
                                        <label className="text-sm font-semibold mb-1">
                                            Email ID <span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            type="email"
                                            {...register("email")}
                                            name="email"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none "
                                            label={""}

                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Eligibility & History */}
                    {activeTab === "Eligibility & History" && (
                        <div className="grid grid-cols-3 w-3/4">
                            <div>
                                <label className="text-sm font-semibold mb-1 block">
                                    Can the agent do recruitment?
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="can_recruit"
                                            value="yes"
                                            checked={watch("can_recruit") === "yes"}
                                            onChange={() => setValue("can_recruit", "yes")}
                                            className="w-5 h-5 cursor-pointer "
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="can_recruit"
                                            value="no"
                                            checked={watch("can_recruit") === "no"}
                                            onChange={() => setValue("can_recruit", "no")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            <div className="pr-12">
                                <label className="text-sm font-semibold mb-1 block">
                                    Have you been associated earlier with ARMSJOBS?
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="associated_earlier"
                                            value="yes"
                                            checked={watch("associated_earlier") === "yes"}
                                            onChange={() => setValue("associated_earlier", "yes")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="associated_earlier"
                                            value="no"
                                            checked={watch("associated_earlier") === "no"}
                                            onChange={() => setValue("associated_earlier", "no")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold mb-1 block">
                                    Can the agent do manpower supplying?
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value='yes'
                                            name="can_supply_manpower"
                                            checked={watch("can_supply_manpower") === "no"}
                                            onChange={() => setValue("can_supply_manpower", "no")}
                                            className="w-5 h-5 cursor-pointer "
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="can_supply_manpower"
                                            value="no"
                                            checked={watch("can_supply_manpower") === "no"}
                                            onChange={() => setValue("can_supply_manpower", "no")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Manpower Info */}
                    {activeTab === "Manpower Info" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 w-3/4">
                                    {/* Form Fields */}
                                    <div className="flex flex-col gap-5 flex-1">
                                        {/* First Row - 4 fields */}
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex-1 min-w-[210px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Categories You Can Supply
                                                </label>
                                                <Select
                                                    isMulti
                                                    name="supply_categories"
                                                    options={categoryOptions}
                                                    // value={selectedCategories} // array of { value, label }
                                                    onChange={handleCategoryChange}
                                                    // className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5"
                                                    classNamePrefix="select"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-[210px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Number of People You Can Supply
                                                </label>
                                                <InputField
                                                    type="number"
                                                    {...register("quantity_estimates")}
                                                    name="quantity_estimates"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-[220px]" >
                                                <label className="text-sm font-semibold mb-1">
                                                    Areas Covered (Emirates)
                                                </label>
                                                <Select<OptionType, true>
                                                    options={emiratesOptions}
                                                    isMulti
                                                    value={selectedAreas}
                                                    {...register("areas_covered")}
                                                    name="areas_covered"
                                                    onChange={handleChange}
                                                    className="react-select-container"
                                                />
                                                {/* <textarea
                                                    {...register("areas_covered")}
                                                    name="areas_covered"
                                                    className="w-full  h-9.5 rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                /> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Additional Info */}
                    {activeTab === "Additional Info" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-6 items-start">
                                <div className="flex gap-13 w-1/4">
                                    <div className="flex-1 w-full">
                                        <label className="text-sm font-semibold mb-3 block">
                                            Additional Notes (Category Rates & Recruitment Rates)
                                        </label>
                                        <textarea
                                            {...register("additional_notes")}
                                            name="additional_notes"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Buttons */}
                    <div className="absolute bottom-0 left-0 right-0 py-4 ">
                        <div className="flex justify-center gap-4 mt-8 ">
                            <div>
                                <Button
                                    onClick={closePopup}
                                    buttonType="button"
                                    buttonTitle="Cancel"
                                    className="px-7 py-2.5 text-armsBlack rounded-sm font-semibold hover:bg-gray-50 cursor-pointer"
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
                </form>
            </div>
        </div >
    );
};
