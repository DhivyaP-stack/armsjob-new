import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../../common/Button";
import { InputField } from "../../common/InputField";
import { SelectField } from "../../common/SelectField";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

interface AddCandidateBenchListPopupProps {
    closePopup: () => void;
    refreshData: () => void;
}

const candidateBenchSchema = zod.object({
    name: zod.string().min(1, "Name is required"),
    technology: zod.string().min(1, "Technology is required"),
    experience: zod.string().min(1, "Experience is required"),
    availability: zod.string().min(1, "Availability is required"),
    location: zod.string().min(1, "Location is required"),
    category: zod.string().min(1, "Category is required"),
    status: zod.string().min(1, "Status is required"),
});

type CandidateBenchFormData = zod.infer<typeof candidateBenchSchema>;

export const AddCandidateBenchListPopup: React.FC<AddCandidateBenchListPopupProps> = ({
    closePopup,
    refreshData
}) => {
    const [, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CandidateBenchFormData>({
        resolver: zodResolver(candidateBenchSchema),
    });

    const handleFormSubmit = async () => {
        try {
            // TODO: Add API call to save candidate bench list
            // await AddCandidateBench(data);
            reset();
            closePopup();
            refreshData();
            toast.success("Candidate added to bench list successfully");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to submit form";
            setError(errorMessage);
            toast.error("Failed to submit form");
        }
    };

    return (
        <div className="fixed inset-0 bg-armsAsh bg-opacity-70 flex justify-center items-start pt-25 z-50">
            <div className="bg-white rounded-lg shadow-lg w-30/31 h-[75%] p-6 relative max-xl:!h-[90%]">
                {/* Heading */}
                <div className="relative mb-5">
                    <h2 className="text-xl font-bold mb-4 border-b-2 border-armsgrey pb-3">
                        Add Candidate to Bench List
                    </h2>
                </div>
                <div
                    onClick={closePopup}
                    className="absolute top-5 right-5 text-gray-500 cursor-pointer"
                >
                    <IoCloseOutline size={30} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="h-[calc(100%-150px)] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold mb-1">Name</label>
                            <InputField
                                label={""} 
                                type="text"
                                {...register("name")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.name?.message}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Technology</label>
                            <InputField
                                label={""} 
                                type="text"
                                {...register("technology")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.technology?.message}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Experience</label>
                            <InputField
                                label={""} 
                                type="text"
                                {...register("experience")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.experience?.message}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Availability</label>
                            <SelectField
                                label={""} 
                                {...register("availability")}
                                options={[
                                    { value: "", label: "Select Availability" },
                                    { value: "Immediate", label: "Immediate" },
                                    { value: "1 Week", label: "1 Week" },
                                    { value: "2 Weeks", label: "2 Weeks" },
                                    { value: "3 Weeks", label: "3 Weeks" },
                                    { value: "1 Month", label: "1 Month" },
                                ]}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.availability?.message}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Location</label>
                            <InputField
                                label={""} 
                                type="text"
                                {...register("location")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.location?.message}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Category</label>
                            <SelectField
                                label={""} 
                                {...register("category")}
                                options={[
                                    { value: "", label: "Select Category" },
                                    { value: "IT", label: "IT" },
                                    { value: "Engineers&Technicians", label: "Engineers & Technicians" },
                                    { value: "Electricians", label: "Electricians" },
                                    { value: "Plumbers", label: "Plumbers" },
                                    { value: "Welders&Fabricators", label: "Welders & Fabricators" },
                                ]}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.category?.message}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="absolute bottom-0 left-0 right-0 py-4">
                        <div className="flex justify-center gap-4 mt-8">
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
                                    buttonTitle="Submit"
                                    className="bg-armsjobslightblue text-lg text-armsWhite font-bold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};