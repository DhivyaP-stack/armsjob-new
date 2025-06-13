import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../../common/Button";
import { InputField } from "../../common/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fetchAgentById, updateAgent } from "../../Commonapicall/AgentsSupplierapicall/Agentsapis";
import { toast } from "react-toastify";
import { AgentSupplier } from "./AgentsSupplierTable";
import Select from "react-select";
import { dropdowngetCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";

// ✅ Correct way
import type { Resolver } from 'react-hook-form';

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
    data: Category[];
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
    const [activeTab, setActiveTab] = useState("Agent Details");
    const [, setCategories] = useState<Category[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<OptionType[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);
    const [selectedSupplyCategories, setSelectedSupplyCategories] = useState<OptionType[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
      const [tradeLicenseFileName, setTradeLicenseFileName] = useState("");
  const [companyLicenseFileName, setCompanyLicenseFileName] = useState("");
    
    const tabs = ["Agent Details", "Eligibility & History", "Manpower Info","Documents", "Additional Info"];

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<AgentFormData>({
        // resolver: zodResolver(agentSchema),
         resolver: zodResolver(agentSchema) as unknown as Resolver<AgentFormData>,
        defaultValues: {
            can_recruit: "no",
            associated_earlier: "no",
            can_supply_manpower: "no",
            worked_with_arms_before: "no",
            previous_experience: "no",
            quantity_per_category: 1
        }
    });

    const tabFieldMapping: Record<string, string[]> = {
        "Agent Details": [
            'contact_person_name',
            'mobile_no',
            'whatsapp_no',
            'email',
            'office_location',
            'company_name'
        ],
        "Eligibility & History": [
            'can_recruit',
            'associated_earlier',
            'can_supply_manpower',
            'previous_experience',
            'worked_with_arms_before'
        ],
        "Manpower Info": [
            'quantity_estimates',
            'areas_covered',
            'supply_categories',
            'categories_available',
            'quantity_per_category'
        ],
          "Documents": [
            'trade_license',
            'company_license',
        ],
        "Additional Info": [
            'additional_notes',
            'comments'
        ],
    };

    const handleAreaChange = (selectedOptions: readonly OptionType[]) => {
        const newSelected = selectedOptions as OptionType[];
        setSelectedAreas(newSelected);
        const areasString = newSelected.map(option => option.value).join(', ');
        setValue('areas_covered', areasString);
    };

    const handleCategoryChange = (selectedOptions: readonly OptionType[] | null) => {
        const newSelected = selectedOptions || [];
        setSelectedCategories([...newSelected]);
        const categoryIds = newSelected.map(opt => opt.value).join(',');
        setValue('categories_available', categoryIds);
    };

    const handleSupplyCategoryChange = (selectedOptions: readonly OptionType[] | null) => {
        const newSelected = selectedOptions || [];
        setSelectedSupplyCategories([...newSelected]);
        const categoryIds = newSelected.map(opt => opt.value).join(',');
        setValue('supply_categories', categoryIds);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await dropdowngetCategories() as CategoryApiResponse;
                setCategories(data.data);
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
        const fetchAgentData = async () => {
            setIsLoading(true);
            try {
                const agent = await fetchAgentById(agentId);
                
                // Parse areas_covered
                const areasCovered = agent.areas_covered || "";
                const initialAreas = areasCovered
                    ? areasCovered.split(', ').map(area => ({
                        value: area,
                        label: area
                    }))
                    : [];
                setSelectedAreas(initialAreas);

                // Parse categories_available
                // const categoriesAvailable = agent.categories_available || "";
                // const initialCategories = categoriesAvailable && categoryOptions.length
                //     ? categoryOptions.filter(opt => 
                //         categoriesAvailable.split(',').includes(opt.value))
                //     : [];

                const categoriesAvailable = Array.isArray(agent.categories_available) 
    ? agent.categories_available.join(',')
    : agent.categories_available || "";
const initialCategories = categoriesAvailable && categoryOptions.length
    ? categoryOptions.filter(opt => 
        categoriesAvailable.split(',').includes(opt.value))
    : [];
                setSelectedCategories(initialCategories);

                // Parse supply_categories
                const supplyCategories = agent.supply_categories || "";
                const initialSupplyCategories = supplyCategories && categoryOptions.length
                    ? categoryOptions.filter(opt => 
                        supplyCategories.split(',').includes(opt.value))
                    : [];
                setSelectedSupplyCategories(initialSupplyCategories);


                   if (agent.trade_license) {
          setTradeLicenseFileName(agent.trade_license);
        }
        if (agent.company_license) {
          setCompanyLicenseFileName(agent.company_license);
        }
                reset({
                    company_name: agent.company_name || "",
                    contact_person_name: agent.contact_person_name || "",
                    mobile_no: agent.mobile_no || "",
                    whatsapp_no: agent.whatsapp_no || "",
                    email: agent.email || "",
                    office_location: agent.office_location || "",
                    can_recruit: agent.can_recruit ? "yes" : "no",
                    associated_earlier: agent.associated_earlier ? "yes" : "no",
                    can_supply_manpower: agent.can_supply_manpower ? "yes" : "no",
                    previous_experience: agent.previous_experience ? "yes" : "no",
                    worked_with_arms_before: agent.worked_with_arms_before ? "yes" : "no",
                    supply_categories: supplyCategories,
                    // categories_available: categoriesAvailable ,
                    // company_license:agent.company_license,
                    // trade_license:agent.trade_license,
                    categories_available: categoriesAvailable || undefined,
company_license: agent.company_license || undefined,
trade_license: agent.trade_license || undefined,
                    quantity_estimates: agent.quantity_estimates || "",
                    areas_covered: areasCovered,
                    additional_notes: agent.additional_notes || "",
                    comments: agent.comments || "",
                   // quantity_per_category: agent.quantity_per_category?.toString() || "1"
                   quantity_per_category: agent.quantity_per_category ? Number(agent.quantity_per_category) : 1
                });
            } catch (error) {
                console.error("Error fetching agent data:", error);
                toast.error("Failed to load agent data");
            } finally {
                setIsLoading(false);
            }
        };
        
        if (agentId) {
            fetchAgentData();
        }
    }, [agentId, reset, setValue, categoryOptions]);



      // Handle file changes
  const handleTradeLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTradeLicenseFileName(e.target.files[0].name);
      setValue("trade_license", e.target.files[0].name); // Store just the file name
    }
  };

  const handleCompanyLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCompanyLicenseFileName(e.target.files[0].name);
      setValue("company_license", e.target.files[0].name); // Store just the file name
    }
  };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(async (data) => {
            setIsLoading(true);
            try {
                const parseBoolean = (val: string): boolean => val === "yes";
                
                const updateData: Partial<AgentSupplier> = {
                    company_name: data.company_name,
                    contact_person_name: data.contact_person_name,
                    mobile_no: data.mobile_no,
                    whatsapp_no: data.whatsapp_no,
                    email: data.email,
                    office_location: data.office_location,
                    can_recruit: parseBoolean(data.can_recruit),
                    associated_earlier: parseBoolean(data.associated_earlier),
                    can_supply_manpower: parseBoolean(data.can_supply_manpower),
                    previous_experience: parseBoolean(data.previous_experience),
                    worked_with_arms_before: parseBoolean(data.worked_with_arms_before),
                    supply_categories: data.supply_categories,
                    categories_available: data.categories_available,
                    quantity_estimates: data.quantity_estimates,
                    areas_covered: data.areas_covered,
                    additional_notes: data.additional_notes,
                    // trade_license:data.trade_license,
                    // company_license:data.company_license,
                      trade_license: tradeLicenseFileName,
                      company_license: companyLicenseFileName,
                    comments: data.comments,
                   // quantity_per_category: parseInt(data.quantity_per_category) || 0
                    quantity_per_category: String(data.quantity_per_category ?? "")
                };

                await updateAgent(agentId, updateData);
                reset();
                closePopup();
                refreshData();
                toast.success('Agent Updated successfully');
                if (onAgentAdded) onAgentAdded();
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Failed to update agent";
                console.error("Error updating agent:", errorMessage);
                toast.error("Failed to update agent");
            } finally {
                setIsLoading(false);
            }
        }, (errors) => {
            // Handle validation errors
            const errorFields = Object.keys(errors);
            if (errorFields.length > 0) {
                // Find which tab contains the first error
                for (const [tabName, fields] of Object.entries(tabFieldMapping)) {
                    const hasErrorInTab = errorFields.some(errorField => fields.includes(errorField));
                    if (hasErrorInTab) {
                        setActiveTab(tabName);
                        const firstErrorFieldInTab = errorFields.find(field => fields.includes(field));
                        if (firstErrorFieldInTab) {
                            setTimeout(() => {
                                const el = document.querySelector(`[name="${firstErrorFieldInTab}"]`);
                                if (el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    (el as HTMLElement).focus();
                                }
                            }, 300);
                        }
                        break;
                    }
                }
            }
        })(e);
    };

    const quantityPerCategory = watch("quantity_per_category");

    return (
        <div className="fixed inset-0 bg-armsAsh bg-opacity-70 flex justify-center items-start pt-25 z-50">
            <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] p-6 relative">
                {/* Heading */}
                <div className="relative mb-5">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
                        Edit Agents/Supplier
                    </h2>
                </div>
                <div
                    onClick={closePopup}
                    className="absolute top-5 right-5 text-gray-500 cursor-pointer"
                >
                    <IoCloseOutline size={30} />
                </div>

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

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
                                    {/* company name */}
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
                                        {errors.company_name && <p className="text-red-500 text-xs">{errors.company_name.message}</p>}
                                    </div>
                                    {/* Name of Agent */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Contact Person Name<span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            type="text"
                                            {...register("contact_person_name")}
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            label={""}
                                        />
                                        {errors.contact_person_name && <p className="text-red-500 text-xs">{errors.contact_person_name.message}</p>}
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
                                    <div>
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

                                    <div>
                                        <label className="text-sm font-semibold mb-1">Office Location</label>
                                        <InputField
                                            type="text"
                                            {...register("office_location")}
                                            name="office_location"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            label={""}
                                        />
                                        {errors.office_location && <p className="text-red-500 text-xs">{errors.office_location.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Eligibility & History */}
                    {activeTab === "Eligibility & History" && (
                        <div className="grid grid-cols-3 w-3/4 gap-6">
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

                            <div>
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
                                {errors.can_supply_manpower && <p className="text-red-500 text-xs">{errors.can_supply_manpower.message}</p>}
                            </div>
                          
                            <div>
                                <label className="text-sm font-semibold mb-1 block">
                                    Previous experience in manpower supplying
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("previous_experience")}
                                            value="yes"
                                            className="w-5 h-5 cursor-pointer "
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("previous_experience")}
                                            value="no"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                                {errors.previous_experience && <p className="text-red-500 text-xs">{errors.previous_experience.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-1 block">
                                    If worked earlier with Arms
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("worked_with_arms_before")}
                                            value="yes"
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("worked_with_arms_before")}
                                            value="no"
                                            className="w-5 h-5 cursor-pointer "
                                        />
                                        No
                                    </label>
                                </div>
                                {errors.worked_with_arms_before && <p className="text-red-500 text-xs">{errors.worked_with_arms_before.message}</p>}
                            </div>
                        </div>
                    )}

                    {/* Manpower Info */}
                    {activeTab === "Manpower Info" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 w-3/4">
                                    <div className="flex flex-col gap-5 flex-1">
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex-1 min-w-[210px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Categories You Can Supply
                                                </label>
                                                <Select
                                                    isMulti
                                                    name="supply_categories"
                                                    options={categoryOptions}
                                                    value={selectedSupplyCategories}
                                                    onChange={handleSupplyCategoryChange}
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
                                            <div className="flex-1 min-w-[220px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Areas Covered (Emirates)
                                                </label>
                                                <Select
                                                    options={emiratesOptions}
                                                    isMulti
                                                    value={selectedAreas}
                                                    onChange={handleAreaChange}
                                                    classNamePrefix="react-select"
                                                />
                                                {errors.areas_covered && <p className="text-red-500 text-xs">{errors.areas_covered.message}</p>}
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Categories Available
                                                </label>
                                                <Select
                                                    isMulti
                                                    options={categoryOptions}
                                                    value={selectedCategories}
                                                    onChange={handleCategoryChange}
                                                    classNamePrefix="select"
                                                />
                                                {errors.categories_available && <p className="text-red-500 text-xs">{errors.categories_available.message}</p>}
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold mb-1">
                                                    Quantity per Category: {quantityPerCategory}
                                                </label>
                                                <InputField
                                                    type="range"
                                                    min={1}
                                                    max={10}
                                                    step={1}
                                                    {...register("quantity_per_category")}
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    label={""}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Select a quantity from 1 to 10.
                                                </p>
                                                {errors.quantity_per_category && <p className="text-red-500 text-xs">{errors.quantity_per_category.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                      {activeTab === "Documents" && (
    <div className="max-w-full mx-auto p-4">
      <div className="grid grid-cols-4 items-start gap-6 mb-6">
        {/* Trade License */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold mb-1">
            Upload trade license
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                id="trade_license"
                onChange={handleTradeLicenseChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              <input
                type="text"
                readOnly
                placeholder="Upload your trade license"
                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                value={tradeLicenseFileName}
              />
            </div>
            <label
              htmlFor="trade_license"
              className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue cursor-pointer"
            >
              Upload
            </label>
          </div>
          {errors.trade_license && (
            <p className="text-sm text-red-500">{errors.trade_license.message as string}</p>
          )}
        </div>
        
        {/* Company License */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold mb-1">
            Upload company license
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                id="company_license"
                onChange={handleCompanyLicenseChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              <input
                type="text"
                readOnly
                placeholder="Upload your company license"
                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                value={companyLicenseFileName}
              />
            </div>
            <label
              htmlFor="company_license"
              className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue cursor-pointer"
            >
              Upload
            </label>
          </div>
          {errors.company_license && (
            <p className="text-sm text-red-500">{errors.company_license.message as string}</p>
          )}
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
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            rows={5}
                                        />
                                        {errors.additional_notes && <p className="text-red-500 text-xs">{errors.additional_notes.message}</p>}
                                    </div>
                                </div>
                                <div className="flex-1 w-full mt-1">
                                    <label className="text-sm font-semibold mb-1 block pb-0.5">
                                        Comments
                                    </label>
                                    <textarea
                                        {...register("comments")}
                                        className="w-2/4 rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                        rows={5}
                                    />
                                    {errors.comments && <p className="text-red-500 text-xs">{errors.comments.message}</p>}
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
                                    className="px-7 py-2.5 text-armsBlack rounded-sm font-semibold hover:bg-gray-200 cursor-pointer"
                                />
                            </div>
                            <div>
                                <Button
                                    buttonType="submit"
                                    buttonTitle={isLoading ? "Updating..." : "Update"}
                                    disabled={isLoading}
                                    className={`bg-armsjobslightblue text-lg text-armsWhite font-bold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const agentSchema = z.object({
    // agent details
    company_name: z.string().min(1, "Company Name is required"),
    contact_person_name: z.string().min(1, "Contact Person Name is required"),
    office_location: z.string().optional(),
    mobile_no: z.string()
        .min(10, "Mobile number must be 10 digits")
        .max(10, "Mobile number must be 10 digits")
        .regex(/^\d+$/, "Must contain only numbers"),
    whatsapp_no: z.string()
        .min(10, "WhatsApp number must be 10 digits")
        .max(10, "WhatsApp number must be 10 digits")
        .regex(/^\d+$/, "Must contain only numbers"),
    email: z.string()
        .email("Invalid email format"),
    
    // eligibility and history
    can_recruit: z.enum(["yes", "no"]),
    associated_earlier: z.enum(["yes", "no"]),
    can_supply_manpower: z.enum(["yes", "no"]),
    previous_experience: z.enum(["yes", "no"]),
    worked_with_arms_before: z.enum(["yes", "no"]),
    
    // Man power info
    supply_categories: z.string().optional(),
    quantity_estimates: z.string().optional(),
    areas_covered: z.string().optional(),
    categories_available: z.string().optional(),
    // quantity_per_category: z.string()
    //     .transform(Number )
    //     .refine(val => val >= 1 && val <= 10, "Quantity must be between 1 and 10")
    //     .optional(),
//     quantity_per_category: z
//   .union([
//     z.string().min(1).transform(Number).refine(val => val >= 1 && val <= 10, {
//       message: "Quantity must be between 1 and 10",
//     }),
//     z.literal("").transform(() => undefined), // allow empty string to become undefined
//   ])
//   .optional(),

//quantity_per_category: z.coerce.number().min(1, "Must be at least 1"),
quantity_per_category: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseInt(val, 10);
      if (typeof val === 'number') return val;
      return 1;
    },
    z.number().min(1).max(10)
  ),
// quantity_per_category: z.union([
//   z.string().min(1).transform(val => parseInt(val, 10)),
//   z.number().min(1)
// ]).refine(val => val >= 1 && val <= 10, {
//   message: "Quantity must be between 1 and 10",
// }),
    // additional info
    additional_notes: z.string().optional(),
    comments: z.string().optional(),
//      trade_license: z.instanceof(FileList).optional(),
//       company_license:  z.object({
//   company_license: z
//     .instanceof(File)
//     .optional()
   
// })


  trade_license: z.string().optional(),
  company_license: z.string().optional(),

    // company_license:  z
    // .any()
    // .refine((file) => file instanceof File && file.type.startsWith("image/"), {
    //   message: "Please upload a valid image file (PNG, JPG, etc.)",
    // })
    // .optional(),
});