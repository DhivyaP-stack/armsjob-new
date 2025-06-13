// AddCandidateModal.tsx
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
//import DefaultProfile from "../../assets/images/DefaultProfile.jpg"
import { Button } from "../../common/Button"
import { InputField } from "../../common/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { agentSchema } from "./AddAgentsSupplierPopup";
import { z } from "zod";
import { fetchAgentById, updateAgent } from "../../Commonapicall/AgentsSupplierapicall/Agentsapis";
import { toast } from "react-toastify";
import { AgentSupplier } from "./AgentsSupplierTable";
import Select from "react-select";
import { dropdowngetCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";
// import { SelectField } from "../../common/SelectField";
// import { FaCloudUploadAlt } from "react-icons/fa";
interface EditAgentsSupplierPopupProps {
    closePopup: () => void;
    agentId: number;
    onAgentAdded?: () => void;
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

export const EditAgentsSupplierPopup: React.FC<EditAgentsSupplierPopupProps> = ({
    closePopup,
    agentId,
    onAgentAdded,
    refreshData,
}) => {
    //   if (!isOpen) return null;
    const [activeTab, setActiveTab] = useState("Agent Details");
    const [, setCategories] = useState<Category[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<{ value: string; label: string }[]>([]);
    const tabs = ["Agent Details", "Eligibility & History", "Manpower Info", "Additional Info"];
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<AgentFormData>({
        resolver: zodResolver(agentSchema),
        defaultValues: {
            can_recruit: "no",
            associated_earlier: "no",
            can_supply_manpower: "no",
        }
    });

    const [selectedAreas, setSelectedAreas] = useState<OptionType[]>([]);

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
        setSelectedCategories([...newSelected]);
        // Extract only the IDs and join with commas
        const categoryIds = newSelected.map(opt => opt.value).join(',');
        setValue('supply_categories', categoryIds); // Pass to form
    };


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
            'areas_covered',
            'areas_covered',
        ],
        "Additional Info": [
            'additional_notes'
        ],
    };

    // Optimize the useEffect for data loading:
    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const agent = await fetchAgentById(agentId);
                // Parse areas_covered if it exists
                const areasCovered = agent.areas_covered || "";
                const initialAreas = areasCovered
                    ? areasCovered.split(', ').map(area => ({
                        value: area,
                        label: area
                    }))
                    : [];
                setSelectedAreas(initialAreas);

                reset({
                    name: agent.name || "",
                    mobile_no: agent.mobile_no || "",
                    whatsapp_no: agent.whatsapp_no || "",
                    email: agent.email || "",
                    can_recruit: agent.can_recruit ? "yes" : "no",
                    associated_earlier: agent.associated_earlier ? "yes" : "no",
                    can_supply_manpower: agent.can_supply_manpower ? "yes" : "no",
                    supply_categories: agent.supply_categories || "",
                    quantity_estimates: agent.quantity_estimates || "",
                    areas_covered: areasCovered,
                    additional_notes: agent.additional_notes || ""
                });
            } catch (error) {
                console.error("Error fetching agent data:", error);
                toast.error("Failed to load agent data");
            }
        };
        if (agentId) {
            fetchAgentData();
        }
    }, [agentId, reset, setValue]); // Add setValue to dependencies

    const [scrollToField, setScrollToField] = useState<string | null>(null);
    console.log("scrollToField", scrollToField)

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Combine form validation and submission in one step
        handleSubmit(async (data: AgentFormData) => {
            // setIsSubmitting(true);
            try {
                const parseBoolean = (val: string | undefined): boolean | undefined =>
                    val === "true" ? true : val === "false" ? false : undefined;
                const updateData: Partial<AgentSupplier> = {
                    name: data.name,
                    mobile_no: data.mobile_no,
                    whatsapp_no: data.whatsapp_no,
                    email: data.email,
                    can_recruit: parseBoolean(data.can_recruit),
                    associated_earlier: parseBoolean(data.associated_earlier),
                    can_supply_manpower: parseBoolean(data.can_supply_manpower),
                    supply_categories: data.supply_categories,
                    quantity_estimates: data.quantity_estimates,
                    areas_covered: data.areas_covered,
                    additional_notes: data.additional_notes,
                };
                await updateAgent(agentId, updateData);
                reset(); 2
                closePopup();
                refreshData();
                toast.success('Agent Updated successfully');
                if (onAgentAdded) onAgentAdded();
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Failed to update agent";
                console.error("Error updating agent:", errorMessage);
                toast.error("Failed to update agent");
            }
            // finally {
            //     setIsSubmitting(false);
            // }
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
        if (agentId && categoryOptions.length > 0) {
            // Fetch the agent data again or use the data you already have
            const fetchAgentCategories = async () => {
                try {
                    const agent = await fetchAgentById(agentId);
                    if (agent.supply_categories) {
                        const ids = agent.supply_categories.split(',');
                        const selected = categoryOptions.filter(opt => ids.includes(opt.value));
                        setSelectedCategories(selected);
                        setValue('supply_categories', agent.supply_categories);
                    }
                } catch (error) {
                    console.error("Error fetching agent categories", error);
                }
            };
            fetchAgentCategories();
        }
    }, [agentId, categoryOptions, setValue]);

    return (
        <div className="fixed inset-0 bg-armsAsh bg-opacity-70 flex justify-center items-start pt-25 z-50">
            <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] p-6 relative">
                {/* Heading */}
                <div className="relative mb-5">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
                        Edit Manpower Supply/Agents
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

                {/* Form */}
                <form onSubmit={handleFormSubmit}>
                    {/* Agent Details */}
                    {activeTab === "Agent Details" && (
                        <div className="max-w-full mx-auto p-0 pl-1 ">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid w-3/4 md:grid-cols-2 lg:grid-cols-3 grid-cols-3 gap-4">
                                    {/* Name of Agent */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Name of Agent/Supplier<span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            type="text"
                                            {...register("name")}
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            label={""}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                                    </div>
                                    {/* Mobile Number */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            type="text"

                                            {...register("mobile_no")}
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            label={""}
                                        />
                                        {errors.mobile_no && <p className="text-red-500 text-xs">{errors.mobile_no.message}</p>}
                                    </div>
                                    {/* WhatsApp Number */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            WhatsApp Number <span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            type="text"

                                            {...register("whatsapp_no")}
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            label={""}
                                        />
                                        {errors.whatsapp_no && <p className="text-red-500 text-xs">{errors.whatsapp_no.message}</p>}
                                    </div>
                                    {/* Email ID  */}
                                    <div >
                                        <label className="text-sm font-semibold mb-1">
                                            Email ID <span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            type="email"
                                            {...register("email")}
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            label={""}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
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

                                            value="yes"
                                            {...register("can_recruit")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"

                                            value="no"
                                            {...register("can_recruit")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                                {errors.can_recruit && <p className="text-red-500 text-xs">{errors.can_recruit.message}</p>}
                            </div>

                            <div className="pr-12">
                                <label className="text-sm font-semibold mb-1 block">
                                    Have you been associated earlier with ARMSJOBS?
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"

                                            {...register("associated_earlier")}
                                            value="yes"
                                            className="w-5 h-5 cursor-pointer "
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"

                                            {...register("associated_earlier")}
                                            value="no"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                                {errors.associated_earlier && <p className="text-red-500 text-xs">{errors.associated_earlier.message}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-semibold mb-1 block">
                                    Can the agent do manpower supplying?
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("can_supply_manpower")}
                                            value="yes"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("can_supply_manpower")}
                                            value="no"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                            {errors.can_supply_manpower && <p className="text-red-500 text-xs">{errors.can_supply_manpower.message}</p>}
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
                                                    value={selectedCategories} // array of { value, label }
                                                    onChange={handleCategoryChange}
                                                    // className="w-full cursor-pointer rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5"
                                                    classNamePrefix="select"
                                                />
                                                {errors.supply_categories && <p className="text-red-500 text-xs">{errors.supply_categories.message}</p>}
                                            </div>

                                            <div className="flex-1 min-w-[210px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Number of People You Can Supply
                                                </label>
                                                <InputField
                                                    type="number"
                                                    {...register("quantity_estimates")}
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                {errors.quantity_estimates && <p className="text-red-500 text-xs">{errors.quantity_estimates.message}</p>}
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
                                                    className="w-full  h-9.5 rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                /> */}
                                                {errors.areas_covered && <p className="text-red-500 text-xs">{errors.areas_covered.message}</p>}
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
                                            name="areascovered"
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
                                    className="px-7 py-2.5  text-armsBlack rounded-sm font-semibold hover:bg-gray-200 cursor-pointer"
                                />
                            </div>
                            <div>
                                <Button
                                    buttonType="submit"
                                    buttonTitle={"Submit"}
                                    className={`bg-armsjobslightblue text-lg text-armsWhite font-bold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue`}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
