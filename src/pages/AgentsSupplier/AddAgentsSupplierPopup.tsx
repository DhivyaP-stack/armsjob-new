

// import React, { useEffect, useState } from "react";
// import { IoCloseOutline } from "react-icons/io5";
// import { Button } from "../../common/Button";
// import { InputField } from "../../common/InputField";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import axios from 'axios';
// import { toast } from "react-toastify";
// import Select from "react-select";
// import { dropdowngetCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";

// interface AddAgentsSupplierPopupProps {
//     closePopup: () => void;
//     onAgentAdded?: () => void;
// }

// interface Category {
//     id: number;
//     status: boolean;
//     category: string;
//     is_deleted: boolean;
// }

// interface CategoryApiResponse {
//     status: string;
//     message: string;
//     data: Category[];
// }

// // Define the agent schema with proper validation
// export const agentSchema = z.object({
//     // agent details
//     company_name: z.string().min(1, "Company Name is required"),
//     contact_person_name: z.string().min(1, "Contact Person Name is required"),
//     office_location: z.string().min(1, "Office Location is required"),
//     mobile_no: z.string()
//         .min(10, "Mobile number must be 10 digits")
//         .max(10, "Mobile number must be 10 digits")
//         .regex(/^\d+$/, "Must contain only numbers"),
//     whatsapp_no: z.string()
//         .min(10, "WhatsApp number must be 10 digits")
//         .max(10, "WhatsApp number must be 10 digits")
//         .regex(/^\d+$/, "Must contain only numbers"),
//     email: z.string()
//         .email("Invalid email format"),
    
//     // eligibility and history
//     can_recruit: z.enum(["yes", "no"]),
//     associated_earlier: z.enum(["yes", "no"]),
//     can_supply_manpower: z.enum(["yes", "no"]),
//     previous_experience: z.enum(["yes", "no"]),
//     worked_with_arms_before: z.enum(["yes", "no"]),
    
//     // Man power info
//     supply_categories: z.string().optional(),
//     quantity_estimates: z.string().optional(),
//     areas_covered: z.string().optional(),
//     categories_available: z.array(
//         z.object({
//             value: z.string(),
//             label: z.string(),
//         })
//     ).min(1, "At least one category is required"),
//     // quantity_per_category: z.string()
//     //     .transform(Number)
//     //     .refine(val => val >= 1 && val <= 10, "Quantity must be between 1 and 10"),
//     quantity_per_category: z.coerce.number().min(1, "Must be at least 1"),

//     // documents
//     trade_license: z.instanceof(FileList).optional(),
//     company_license: z.instanceof(FileList).optional(),
    
//     // additional info
//     additional_notes: z.string().optional(),
//     comments: z.string().optional(),
// });

// type AgentFormData = z.infer<typeof agentSchema>;

// type OptionType = { value: string; label: string };

// const emiratesOptions: OptionType[] = [
//     { value: "Abu Dhabi", label: "Abu Dhabi" },
//     { value: "Dubai", label: "Dubai" },
//     { value: "Sharjah", label: "Sharjah" },
//     { value: "Ajman", label: "Ajman" },
//     { value: "Umm Al Quwain", label: "Umm Al Quwain" },
//     { value: "Ras Al Khaimah", label: "Ras Al Khaimah" },
//     { value: "Fujairah", label: "Fujairah" },
// ];

// export const AddAgentsSupplierPopup: React.FC<AddAgentsSupplierPopupProps> = ({
//     closePopup,
//     onAgentAdded,
// }) => {
//     const [activeTab, setActiveTab] = useState("Agent Details");
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [selectedAreas, setSelectedAreas] = useState<OptionType[]>([]);
//     const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);
//     const [selectedSupplyCategories, setSelectedSupplyCategories] = useState<OptionType[]>([]);

//     const tabs = ["Agent Details", "Eligibility & History", "Manpower Info", "Documents", "Additional Info"];

//     const { 
//         register, 
//         control, 
//         handleSubmit, 
//         formState: { errors }, 
//         watch, 
//         setValue 
//     } = useForm<AgentFormData>({
//         resolver: zodResolver(agentSchema),
//         defaultValues: {
//             can_recruit: "no",
//             associated_earlier: "no",
//             can_supply_manpower: "no",
//             previous_experience: "no",
//             worked_with_arms_before: "no"
//         }
//     });

//     const tabFieldMapping: Record<string, string[]> = {
//         "Agent Details": [
//             'company_name',
//             'contact_person_name',
//             'mobile_no',
//             'whatsapp_no',
//             'email',
//             'office_location'
//         ],
//         "Eligibility & History": [
//             'can_recruit',
//             'associated_earlier',
//             'can_supply_manpower',
//             'previous_experience',
//             'worked_with_arms_before'
//         ],
//         "Manpower Info": [
//             'quantity_estimates',
//             'supply_categories',
//             'areas_covered',
//             'categories_available',
//             'quantity_per_category'
//         ],
//         "Documents": [
//             'trade_license',
//             'company_license',
//         ],
//         "Additional Info": [
//             'additional_notes',
//             'comments'
//         ],
//     };

//     // Handle area selection change
//     const handleAreaChange = (selectedOptions: readonly OptionType[]) => {
//         const newSelected = selectedOptions as OptionType[];
//         setSelectedAreas(newSelected);
//         const areasString = newSelected.map(option => option.value).join(', ');
//         setValue('areas_covered', areasString);
//     };

//     // Handle category selection change
//     const handleCategoryChange = (selectedOptions: readonly OptionType[]) => {
//         const newSelected = selectedOptions as OptionType[];
//         setSelectedCategories(newSelected);
//         setValue('categories_available', newSelected);
//     };

//     // Handle supply category selection change
//     const handleSupplyCategoryChange = (selectedOptions: readonly OptionType[]) => {
//         const newSelected = selectedOptions as OptionType[];
//         setSelectedSupplyCategories(newSelected);
//         const categoryIds = newSelected.map(opt => opt.value).join(',');
//         setValue('supply_categories', categoryIds);
//     };

//     // Fetch categories on component mount
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const data = await dropdowngetCategories() as CategoryApiResponse;
//                 setCategories(data.data);
//             } catch (error) {
//                 console.error("Failed to fetch categories", error);
//                 toast.error("Failed to load categories");
//             }
//         };
//         fetchCategories();
//     }, []);

//     // Prepare category options for select components
//     const categoryOptions = categories.map(cat => ({
//         value: cat.id.toString(),
//         label: cat.category
//     }));

//     // Handle form submission
//     const onSubmit : SubmitHandler<AgentFormData> = async (data: AgentFormData) => {
//         setIsSubmitting(true);
        
//         try {
//             const formData = new FormData();
            
//             // Append basic fields
//             formData.append("company_name", data.company_name);
//             formData.append("contact_person_name", data.contact_person_name);
//             formData.append("mobile_no", data.mobile_no);
//             formData.append("whatsapp_no", data.whatsapp_no);
//             formData.append("email", data.email);
//             formData.append("office_location", data.office_location);
            
//             // Append radio button fields
//             formData.append("can_recruit", data.can_recruit);
//             formData.append("associated_earlier", data.associated_earlier);
//             formData.append("can_supply_manpower", data.can_supply_manpower);
//             formData.append("previous_experience", data.previous_experience);
//             formData.append("worked_with_arms_before", data.worked_with_arms_before);
            
          
//         //    if (data.categories_available && data.categories_available.length > 0) {
//         //     const categoryValues = data.categories_available.map(cat => cat.value);
//         //     formData.append("categories_available", JSON.stringify(categoryValues));
//         // }  
        
// //         if (data.categories_available?.length) {
// //     const quotedValues = data.categories_available.map(cat => `"${cat.value}"`);
// //     formData.append("categories_available", quotedValues.join(',')); // "6","10"
// // }


// if (data.categories_available?.length) {
//     const jsonString = JSON.stringify(data.categories_available.map(c => c.value))
//                      .replace(/^\[|\]$/g, ''); // Removes [ and ]
//     formData.append("categories_available", jsonString); // "6","10"
// }
//             // Append other fields
//             if (data.quantity_estimates) formData.append("quantity_estimates", data.quantity_estimates);
//             if (data.supply_categories) formData.append("supply_categories", data.supply_categories);
//             if (data.areas_covered) formData.append("areas_covered", data.areas_covered);
//             if (data.quantity_per_category) formData.append("quantity_per_category", data.quantity_per_category.toString());
//             if (data.additional_notes) formData.append("additional_notes", data.additional_notes);
//             if (data.comments) formData.append("comments", data.comments);
            
//             //  if (data.trade_license?.[0]) formData.append('trade_license', data.trade_license[0]);
//             // if (data.company_license?.[0]) formData.append('company_license', data.company_license[0]);
         
//             // In your onSubmit:
// if (data.trade_license?.[0]) {
//     formData.append("trade_license", data.trade_license[0].name); // Just the filename
// }
// if (data.company_license?.[0]) {
//     formData.append("company_license", data.company_license[0].name); // Just the filename
// }

//             const response = await axios.post("http://37.27.253.81:8000/api/suppliers/", formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 }
//             });

//             if (response.status === 200 || response.status === 201) {
//                 toast.success("Agent added successfully");
//                 closePopup();
//                 if (onAgentAdded) onAgentAdded();
//             } else {
//                 throw new Error("Failed to add agent");
//             }
//         } catch (error: any) {
//             console.error("Error adding agent:", error);
//             toast.error(error.response?.data?.message || "Error adding agent");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Handle form errors and scroll to the first error field
//     const onError = (errors: any) => {
//         const errorFields = Object.keys(errors);
//         for (const [tabName, fields] of Object.entries(tabFieldMapping)) {
//             if (errorFields.some(errorField => fields.includes(errorField))) {
//                 setActiveTab(tabName);
//                 const firstErrorFieldInTab = errorFields.find(field => fields.includes(field));
//                 if (firstErrorFieldInTab) {
//                     setTimeout(() => {
//                         const element = document.querySelector(`[name="${firstErrorFieldInTab}"]`);
//                         if (element) {
//                             element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                             (element as HTMLElement).focus();
//                         }
//                     }, 100);
//                 }
//                 break;
//             }
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-armsAsh bg-opacity-70 flex justify-center items-start pt-25 z-50">
//             <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] p-6 relative">
//                 {/* Heading */}
//                 <div className="relative mb-5">
//                     <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
//                         Add Agents/Supplier
//                     </h2>
//                 </div>
//                 <div
//                     onClick={closePopup}
//                     className="absolute top-5 right-5 text-gray-500 cursor-pointer"
//                 >
//                     <IoCloseOutline size={30} />
//                 </div>
                
//                 {/* Tabs */}
//                 <div className="flex gap-1 border-b-1 border-armsBlack mb-6">
//                     {tabs.map((tab) => {
//                         const hasError = tabFieldMapping[tab]?.some(field => field in errors);
//                         return (
//                             <button
//                                 key={tab}
//                                 onClick={() => setActiveTab(tab)}
//                                 className={`px-4 py-3 text-sm font-bold cursor-pointer relative ${activeTab === tab
//                                     ? "bg-main text-white"
//                                     : "text-black"
//                                     }`}
//                             >
//                                 {tab}
//                                 {hasError && (
//                                     <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>
                
//                 {/* Form */}
//                 <form onSubmit={handleSubmit(onSubmit, onError)}>
//                     {/* Agent Details Tab */}
//                     {activeTab === "Agent Details" && (
//                         <div className="max-w-full mx-auto p-0 pl-1">
//                             <div className="grid grid-cols-1 gap-4">
//                                 <div className="grid w-4/4 md:grid-cols-2 lg:grid-cols-4 grid-cols-4 gap-4">
//                                     {/* Company Name */}
//                                     <div>
//                                         <label className="text-sm font-semibold mb-1">
//                                             Company Name<span className="text-red-500">*</span>
//                                         </label>
//                                         <InputField
//                                             label={""} type="text"
//                                             className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                             {...register("company_name")}                                        />
//                                         {errors.company_name && (
//                                             <p className="text-red-500 text-xs mt-1">
//                                                 {errors.company_name.message}
//                                             </p>
//                                         )}
//                                     </div>
                                    
//                                     {/* Contact Person Name */}
//                                     <div>
//                                         <label className="text-sm font-semibold mb-1">
//                                             Contact Person Name<span className="text-red-500">*</span>
//                                         </label>
//                                         <InputField
//                                             label={""} type="text"
//                                             className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                             {...register("contact_person_name")}                                        />
//                                         {errors.contact_person_name && (
//                                             <p className="text-red-500 text-xs mt-1">
//                                                 {errors.contact_person_name.message}
//                                             </p>
//                                         )}
//                                     </div>
                                    
//                                     {/* Mobile Number */}
//                                     <div>
//                                         <label className="text-sm font-semibold mb-1">
//                                             Mobile Number <span className="text-red-500">*</span>
//                                         </label>
//                                         <InputField
//                                             label={""} type="text"
//                                             className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                             {...register("mobile_no")}                                        />
//                                         {errors.mobile_no && (
//                                             <p className="text-red-500 text-xs mt-1">
//                                                 {errors.mobile_no.message}
//                                             </p>
//                                         )}
//                                     </div>
                                    
//                                     {/* WhatsApp Number */}
//                                     <div>
//                                         <label className="text-sm font-semibold mb-1">
//                                             WhatsApp Number <span className="text-red-500">*</span>
//                                         </label>
//                                         <InputField
//                                             label={""} type="text"
//                                             className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                             {...register("whatsapp_no")}                                        />
//                                         {errors.whatsapp_no && (
//                                             <p className="text-red-500 text-xs mt-1">
//                                                 {errors.whatsapp_no.message}
//                                             </p>
//                                         )}
//                                     </div>
                                    
//                                     {/* Email */}
//                                     <div>
//                                         <label className="text-sm font-semibold mb-1">
//                                             Email ID <span className="text-red-500">*</span>
//                                         </label>
//                                         <InputField
//                                             label={""} type="email"
//                                             className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                             {...register("email")}                                        />
//                                         {errors.email && (
//                                             <p className="text-red-500 text-xs mt-1">
//                                                 {errors.email.message}
//                                             </p>
//                                         )}
//                                     </div>
                                    
//                                     {/* Office Location */}
//                                     <div>
//                                         <label className="text-sm font-semibold mb-1">
//                                             Office Location<span className="text-red-500">*</span>
//                                         </label>
//                                         <InputField
//                                             label={""} type="text"
//                                             className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                             {...register("office_location")}                                        />
//                                         {errors.office_location && (
//                                             <p className="text-red-500 text-xs mt-1">
//                                                 {errors.office_location.message}
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
                    
//                     {/* Eligibility & History Tab */}
//                     {activeTab === "Eligibility & History" && (
//                         <div className="grid grid-cols-3 w-3/4 gap-6">
//                             {/* Can Recruit */}
//                             <div>
//                                 <label className="text-sm font-semibold mb-1 block">
//                                     Can the agent do recruitment?
//                                 </label>
//                                 <div className="flex gap-4 pt-1.5">
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="yes"
//                                             {...register("can_recruit")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         Yes
//                                     </label>
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="no"
//                                             {...register("can_recruit")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         No
//                                     </label>
//                                 </div>
//                             </div>
                            
//                             {/* Associated Earlier */}
//                             <div>
//                                 <label className="text-sm font-semibold mb-1 block">
//                                     Have you been associated earlier with ARMSJOBS?
//                                 </label>
//                                 <div className="flex gap-4 pt-1.5">
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="yes"
//                                             {...register("associated_earlier")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         Yes
//                                     </label>
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="no"
//                                             {...register("associated_earlier")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         No
//                                     </label>
//                                 </div>
//                             </div>
                            
//                             {/* Can Supply Manpower */}
//                             <div>
//                                 <label className="text-sm font-semibold mb-1 block">
//                                     Can the agent do manpower supplying?
//                                 </label>
//                                 <div className="flex gap-4 pt-1.5">
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="yes"
//                                             {...register("can_supply_manpower")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         Yes
//                                     </label>
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="no"
//                                             {...register("can_supply_manpower")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         No
//                                     </label>
//                                 </div>
//                             </div>
                            
//                             {/* Previous Experience */}
//                             <div className="pt-5">
//                                 <label className="text-sm font-semibold mb-1 block">
//                                     Previous experience in manpower supplying
//                                 </label>
//                                 <div className="flex gap-4 pt-1.5">
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="yes"
//                                             {...register("previous_experience")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         Yes
//                                     </label>
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="no"
//                                             {...register("previous_experience")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         No
//                                     </label>
//                                 </div>
//                             </div>
                            
//                             {/* Worked with Arms Before */}
//                             <div className="pt-5">
//                                 <label className="text-sm font-semibold mb-1 block">
//                                     If worked earlier with Arms
//                                 </label>
//                                 <div className="flex gap-4 pt-1.5">
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="yes"
//                                             {...register("worked_with_arms_before")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         Yes
//                                     </label>
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             value="no"
//                                             {...register("worked_with_arms_before")}
//                                             className="w-5 h-5 cursor-pointer"
//                                         />
//                                         No
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
                    
//                     {/* Manpower Info Tab */}
//                     {activeTab === "Manpower Info" && (
//                         <div className="max-w-full mx-auto p-0 pl-1">
//                             <div className="flex flex-row gap-1 items-start">
//                                 <div className="flex gap-6 w-3/4">
//                                     <div className="flex flex-col gap-5 flex-1">
//                                         <div className="flex flex-wrap gap-3">
//                                             {/* Supply Categories */}
//                                             <div className="flex-1 min-w-[210px]">
//                                                 <label className="text-sm font-semibold mb-1">
//                                                     Categories You Can Supply
//                                                 </label>
//                                                 <Select
//                                                     isMulti
//                                                     options={categoryOptions}
//                                                     value={selectedSupplyCategories}
//                                                     onChange={handleSupplyCategoryChange}
//                                                     classNamePrefix="select"
//                                                 />
//                                             </div>
                                            
//                                             {/* Quantity Estimates */}
//                                             <div className="flex-1 min-w-[210px]">
//                                                 <label className="text-sm font-semibold mb-1">
//                                                     Number of People You Can Supply
//                                                 </label>
//                                                 <InputField
//                                                     label={""} type="number"
//                                                     className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                                     {...register("quantity_estimates")}                                                />
//                                             </div>
                                            
//                                             {/* Areas Covered */}
//                                             <div className="flex-1 min-w-[220px]">
//                                                 <label className="text-sm font-semibold mb-1">
//                                                     Areas Covered (Emirates)
//                                                 </label>
//                                                 <Select
//                                                     isMulti
//                                                     options={emiratesOptions}
//                                                     value={selectedAreas}
//                                                     onChange={handleAreaChange}
//                                                     classNamePrefix="select"
//                                                 />
//                                             </div>
                                            
//                                             {/* Categories Available */}
//                                             <div className="flex-1 min-w-[220px]">
//                                                 <label className="text-sm font-semibold mb-1">
//                                                     Categories Available<span className="text-red-500">*</span>
//                                                 </label>
//                                                 <Controller
//                                                     name="categories_available"
//                                                     control={control}
//                                                     render={({ field }) => (
//                                                         <Select
//                                                             {...field}
//                                                             isMulti
//                                                             options={categoryOptions}
//                                                             value={selectedCategories}
//                                                             onChange={handleCategoryChange}
//                                                             classNamePrefix="select"
//                                                         />
//                                                     )}
//                                                 />
//                                                 {errors.categories_available && (
//                                                     <p className="text-red-500 text-xs mt-1">
//                                                         {errors.categories_available.message}
//                                                     </p>
//                                                 )}
//                                             </div>
                                            
//                                             {/* Quantity per Category */}
//                                             <div className="flex-1 min-w-[220px]">
//                                                 <label className="text-sm font-semibold mb-1">
//                                                     Quantity per Category<span className="text-red-500">*</span>
//                                                 </label>
//                                                 <InputField
//                                                     label={""} type="range"
//                                                     min={1}
//                                                     max={10}
//                                                     step={1}
//                                                     className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                                     {...register("quantity_per_category")}                                                />
//                                                 <p className="text-xs text-gray-500 mt-1">
//                                                     Current value: {watch("quantity_per_category") || 1}
//                                                 </p>
//                                                 {errors.quantity_per_category && (
//                                                     <p className="text-red-500 text-xs mt-1">
//                                                         {errors.quantity_per_category.message}
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
                    
//                     {/* Documents Tab */}
//                     {activeTab === "Documents" && (
//                         <div className="max-w-full mx-auto p-4">
//                             <div className="grid grid-cols-4 items-start gap-6 mb-6">
//                                 {/* Trade License */}
//                                 <div className="flex flex-col gap-4">
//                                     <label className="text-sm font-semibold mb-1">
//                                         Upload trade license
//                                     </label>
//                                     <div className="flex items-center gap-4">
//                                         <div className="flex-1">
//                                             <input
//                                                 type="file"
//                                                 id="trade_license"
//                                                 {...register("trade_license")}
//                                                 accept=".pdf,.jpg,.jpeg,.png"
//                                                 className="hidden"
//                                             />
//                                             <input
//                                                 type="text"
//                                                 readOnly
//                                                 placeholder="Upload your trade license"
//                                                 className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                                 value={watch("trade_license")?.[0]?.name || ""}
//                                             />
//                                         </div>
//                                         <label
//                                             htmlFor="trade_license"
//                                             className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue cursor-pointer"
//                                         >
//                                             Upload
//                                         </label>
//                                     </div>
//                                     {errors.trade_license && (
//                                         <p className="text-sm text-red-500">{errors.trade_license.message as string}</p>
//                                     )}
//                                 </div>
                                
//                                 {/* Company License */}
//                                 <div className="flex flex-col gap-4">
//                                     <label className="text-sm font-semibold mb-1">
//                                         Upload company license
//                                     </label>
//                                     <div className="flex items-center gap-4">
//                                         <div className="flex-1">
//                                             <input
//                                                 type="file"
//                                                 id="company_license"
//                                                 {...register("company_license")}
//                                                 accept=".pdf,.jpg,.jpeg,.png"
//                                                 className="hidden"
//                                             />
//                                             <input
//                                                 type="text"
//                                                 readOnly
//                                                 placeholder="Upload your company license"
//                                                 className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                                 value={watch("company_license")?.[0]?.name || ""}
//                                             />
//                                         </div>
//                                         <label
//                                             htmlFor="company_license"
//                                             className="bg-armsjobslightblue text-armsWhite px-4 py-1.5 rounded text-sm hover:bg-armsWhite hover:text-armsjobslightblue border border-armsjobslightblue cursor-pointer"
//                                         >
//                                             Upload
//                                         </label>
//                                     </div>
//                                     {errors.company_license && (
//                                         <p className="text-sm text-red-500">{errors.company_license.message as string}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
                    
//                     {/* Additional Info Tab */}
//                     {activeTab === "Additional Info" && (
//                         <div className="max-w-full mx-auto p-0 pl-1">
//                             <div className="flex flex-row gap-6 items-start">
//                                 <div className="flex gap-13 w-1/4">
//                                     {/* Additional Notes */}
//                                     <div className="flex-1 w-full">
//                                         <label className="text-sm font-semibold mb-3 block">
//                                             Additional Notes (Category Rates & Recruitment Rates)
//                                         </label>
//                                         <textarea
//                                             className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                             {...register("additional_notes")}
//                                             rows={4}
//                                         />
//                                     </div>
//                                 </div>
                                
//                                 {/* Comments */}
//                                 <div className="flex-1 w-full">
//                                     <label className="text-sm font-semibold mb-1 block pb-0.5">
//                                         Comments
//                                     </label>
//                                     <textarea
//                                         className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
//                                         {...register("comments")}
//                                         rows={4}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
                    
//                     {/* Form Buttons */}
//                     <div className="absolute bottom-0 left-0 right-0 py-4">
//                         <div className="flex justify-center gap-4 mt-8">
//                             <div>
//                                 <Button
//                                     onClick={closePopup}
//                                     buttonType="button"
//                                     buttonTitle="Cancel"
//                                     className="px-7 py-2.5 text-armsBlack rounded-sm font-semibold hover:bg-gray-50 cursor-pointer"
//                                 />
//                             </div>
//                             <div>
//                                 <Button
//                                     type="submit"
//                                     buttonType="submit"
//                                     buttonTitle="Submit"
//                                     disabled={isSubmitting}
//                                     className={`bg-armsjobslightblue text-lg text-armsWhite font-bold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };




import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../../common/Button";
import { InputField } from "../../common/InputField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldErrors, useForm } from "react-hook-form";
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
    data: Category[];
}

const categorySchema = z.object({
    value: z.string(),
    label: z.string()
});

// Define the agent schema with proper validation
export const agentSchema = z.object({
    // agent details
    company_name: z.string().min(1, "Company Name is required"),
    contact_person_name: z.string().min(1, "Contact Person Name is required"),
    office_location: z.string().min(1, "Office Location is required"),
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
    categories_available: z.array(categorySchema).min(1, "Please select at least one category"),
    quantity_per_category: z
    .string()
    .nonempty({ message: "Quantity is required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Quantity must be a number",
    })
    .refine((val) => {
      const num = Number(val);
      return num >= 1 && num <= 10;
    }, {
      message: "Quantity must be between 1 and 10",
    }),

    // documents
    trade_license: z.instanceof(FileList).optional(),
    company_license: z.instanceof(FileList).optional(),
    
    // additional info
    additional_notes: z.string().optional(),
    comments: z.string().optional(),
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<OptionType[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);
    const [selectedSupplyCategories, setSelectedSupplyCategories] = useState<OptionType[]>([]);

    const tabs = ["Agent Details", "Eligibility & History", "Manpower Info", "Documents", "Additional Info"];

    const { 
        register, 
        control, 
        handleSubmit, 
        formState: { errors }, 
        watch, 
        setValue 
    } = useForm<AgentFormData>({
        resolver: zodResolver(agentSchema),
        defaultValues: {
            can_recruit: "no",
            associated_earlier: "no",
            can_supply_manpower: "no",
            previous_experience: "no",
            worked_with_arms_before: "no",
            categories_available: [],
            quantity_per_category: '1'
        }
    });

    const tabFieldMapping: Record<string, string[]> = {
        "Agent Details": [
            'company_name',
            'contact_person_name',
            'mobile_no',
            'whatsapp_no',
            'email',
            'office_location'
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
            'supply_categories',
            'areas_covered',
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

    // Handle area selection change
    const handleAreaChange = (selectedOptions: readonly OptionType[]) => {
        const newSelected = selectedOptions as OptionType[];
        setSelectedAreas(newSelected);
        const areasString = newSelected.map(option => option.value).join(', ');
        setValue('areas_covered', areasString);
    };

    // Handle category selection change
    const handleCategoryChange = (selectedOptions: readonly OptionType[]) => {
        const newSelected = selectedOptions as OptionType[];
        setSelectedCategories(newSelected);
        setValue('categories_available', newSelected);
    };

    // Handle supply category selection change
    const handleSupplyCategoryChange = (selectedOptions: readonly OptionType[]) => {
        const newSelected = selectedOptions as OptionType[];
        setSelectedSupplyCategories(newSelected);
        const categoryIds = newSelected.map(opt => opt.value).join(',');
        setValue('supply_categories', categoryIds);
    };

    // Fetch categories on component mount
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

    // Prepare category options for select components
    const categoryOptions = categories.map(cat => ({
        value: cat.id.toString(),
        label: cat.category
    }));

    // Handle form submission
    const onSubmit = async (data: AgentFormData) => {
        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            
            // Append basic fields
            formData.append("company_name", data.company_name);
            formData.append("contact_person_name", data.contact_person_name);
            formData.append("mobile_no", data.mobile_no);
            formData.append("whatsapp_no", data.whatsapp_no);
            formData.append("email", data.email);
            formData.append("office_location", data.office_location);
            
            // Append radio button fields
            formData.append("can_recruit", data.can_recruit);
            formData.append("associated_earlier", data.associated_earlier);
            formData.append("can_supply_manpower", data.can_supply_manpower);
            formData.append("previous_experience", data.previous_experience);
            formData.append("worked_with_arms_before", data.worked_with_arms_before);
            
            // Format categories as comma-separated string
            if (data.categories_available?.length) {
                const categoryValues = data.categories_available.map(cat => cat.value);
                formData.append("categories_available", categoryValues.join(','));
            }
            
            // Append other fields
            if (data.quantity_estimates) formData.append("quantity_estimates", data.quantity_estimates);
            if (data.supply_categories) formData.append("supply_categories", data.supply_categories);
            if (data.areas_covered) formData.append("areas_covered", data.areas_covered);
            if (data.quantity_per_category) formData.append("quantity_per_category", data.quantity_per_category.toString());
            if (data.additional_notes) formData.append("additional_notes", data.additional_notes);
            if (data.comments) formData.append("comments", data.comments);
            
            // Handle file uploads
            if (data.trade_license?.[0]) {
                formData.append("trade_license", data.trade_license[0]);
            }
            if (data.company_license?.[0]) {
                formData.append("company_license", data.company_license[0]);
            }

            const response = await axios.post("http://37.27.253.81:8000/api/suppliers/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.status === 200 || response.status === 201) {
                toast.success("Agent added successfully");
                closePopup();
                if (onAgentAdded) onAgentAdded();
            } else {
                throw new Error("Failed to add agent");
            }
        } catch (error: unknown) {
            console.error("Error adding agent:", error);
            toast.error((error as Error).message || "Error adding agent");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle form errors and scroll to the first error field
    const onError = (errors: FieldErrors<AgentFormData>) => {
        const errorFields = Object.keys(errors);
        for (const [tabName, fields] of Object.entries(tabFieldMapping)) {
            if (errorFields.some(errorField => fields.includes(errorField))) {
                setActiveTab(tabName);
                const firstErrorFieldInTab = errorFields.find(field => fields.includes(field));
                if (firstErrorFieldInTab) {
                    setTimeout(() => {
                        const element = document.querySelector(`[name="${firstErrorFieldInTab}"]`);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            (element as HTMLElement).focus();
                        }
                    }, 100);
                }
                break;
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-armsAsh bg-opacity-70 flex justify-center items-start pt-25 z-50">
            <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] p-6 relative">
                {/* Heading */}
                <div className="relative mb-5">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
                        Add Agents/Supplier
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
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    {/* Agent Details Tab */}
                    {activeTab === "Agent Details" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid w-4/4 md:grid-cols-2 lg:grid-cols-4 grid-cols-4 gap-4">
                                    {/* Company Name */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Company Name<span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            label={""} type="text"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            {...register("company_name")}                                        />
                                        {errors.company_name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.company_name.message}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Contact Person Name */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Contact Person Name<span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            label={""} type="text"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            {...register("contact_person_name")}                                        />
                                        {errors.contact_person_name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.contact_person_name.message}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Mobile Number */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            label={""} type="text"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            {...register("mobile_no")}                                        />
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
                                            label={""} type="text"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            {...register("whatsapp_no")}                                        />
                                        {errors.whatsapp_no && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.whatsapp_no.message}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Email */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Email ID <span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            label={""} type="email"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            {...register("email")}                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Office Location */}
                                    <div>
                                        <label className="text-sm font-semibold mb-1">
                                            Office Location<span className="text-red-500">*</span>
                                        </label>
                                        <InputField
                                            label={""} type="text"
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            {...register("office_location")}                                        />
                                        {errors.office_location && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.office_location.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Eligibility & History Tab */}
                    {activeTab === "Eligibility & History" && (
                        <div className="grid grid-cols-3 w-3/4 gap-6">
                            {/* Can Recruit */}
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
                            </div>
                            
                            {/* Associated Earlier */}
                            <div>
                                <label className="text-sm font-semibold mb-1 block">
                                    Have you been associated earlier with ARMSJOBS?
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="yes"
                                            {...register("associated_earlier")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="no"
                                            {...register("associated_earlier")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                            
                            {/* Can Supply Manpower */}
                            <div>
                                <label className="text-sm font-semibold mb-1 block">
                                    Can the agent do manpower supplying?
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="yes"
                                            {...register("can_supply_manpower")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="no"
                                            {...register("can_supply_manpower")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                            
                            {/* Previous Experience */}
                            <div className="pt-5">
                                <label className="text-sm font-semibold mb-1 block">
                                    Previous experience in manpower supplying
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="yes"
                                            {...register("previous_experience")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="no"
                                            {...register("previous_experience")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                            
                            {/* Worked with Arms Before */}
                            <div className="pt-5">
                                <label className="text-sm font-semibold mb-1 block">
                                    If worked earlier with Arms
                                </label>
                                <div className="flex gap-4 pt-1.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="yes"
                                            {...register("worked_with_arms_before")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="no"
                                            {...register("worked_with_arms_before")}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Manpower Info Tab */}
                    {activeTab === "Manpower Info" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-1 items-start">
                                <div className="flex gap-6 w-3/4">
                                    <div className="flex flex-col gap-5 flex-1">
                                        <div className="flex flex-wrap gap-3">
                                            {/* Supply Categories */}
                                            <div className="flex-1 min-w-[210px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Categories You Can Supply
                                                </label>
                                                <Select
                                                    isMulti
                                                    options={categoryOptions}
                                                    value={selectedSupplyCategories}
                                                    onChange={handleSupplyCategoryChange}
                                                    classNamePrefix="select"
                                                />
                                            </div>
                                            
                                            {/* Quantity Estimates */}
                                            <div className="flex-1 min-w-[210px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Number of People You Can Supply
                                                </label>
                                                <InputField
                                                    label={""} type="number"
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    {...register("quantity_estimates")}                                                />
                                            </div>
                                            
                                            {/* Areas Covered */}
                                            <div className="flex-1 min-w-[220px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Areas Covered (Emirates)
                                                </label>
                                                <Select
                                                    isMulti
                                                    options={emiratesOptions}
                                                    value={selectedAreas}
                                                    onChange={handleAreaChange}
                                                    classNamePrefix="select"
                                                />
                                            </div>
                                            
                                            {/* Categories Available */}
                                            <div className="flex-1 min-w-[220px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Categories Available<span className="text-red-500">*</span>
                                                </label>
                                                <Controller
                                                    name="categories_available"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            isMulti
                                                            options={categoryOptions}
                                                            value={selectedCategories}
                                                            onChange={handleCategoryChange}
                                                            classNamePrefix="select"
                                                        />
                                                    )}
                                                />
                                                {errors.categories_available && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.categories_available.message}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            {/* Quantity per Category */}
                                            <div className="flex-1 min-w-[220px]">
                                                <label className="text-sm font-semibold mb-1">
                                                    Quantity per Category<span className="text-red-500">*</span>
                                                </label>
                                                <InputField
                                                    label={""} type="range"
                                                    min={1}
                                                    max={10}
                                                    step={1}
                                                    className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                    {...register("quantity_per_category")}                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Current value: {watch("quantity_per_category") || 1}
                                                </p>
                                                {errors.quantity_per_category && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.quantity_per_category.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Documents Tab */}
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
                                                {...register("trade_license")}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                            />
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Upload your trade license"
                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                value={watch("trade_license")?.[0]?.name || ""}
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
                                                {...register("company_license")}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                            />
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Upload your company license"
                                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                                value={watch("company_license")?.[0]?.name || ""}
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
                    
                    {/* Additional Info Tab */}
                    {activeTab === "Additional Info" && (
                        <div className="max-w-full mx-auto p-0 pl-1">
                            <div className="flex flex-row gap-6 items-start">
                                <div className="flex gap-13 w-1/4">
                                    {/* Additional Notes */}
                                    <div className="flex-1 w-full">
                                        <label className="text-sm font-semibold mb-3 block">
                                            Additional Notes (Category Rates & Recruitment Rates)
                                        </label>
                                        <textarea
                                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                            {...register("additional_notes")}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                                
                                {/* Comments */}
                                <div className="flex-1 w-full">
                                    <label className="text-sm font-semibold mb-1 block pb-0.5">
                                        Comments
                                    </label>
                                    <textarea
                                        className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                        {...register("comments")}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Form Buttons */}
                    <div className="absolute bottom-0 left-0 right-0 py-4">
                        <div className="flex justify-center gap-4 mt-8">
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
                                    type="submit"
                                    buttonType="submit"
                                    buttonTitle="Submit"
                                    disabled={isSubmitting}
                                    className={`bg-armsjobslightblue text-lg text-armsWhite font-bold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};