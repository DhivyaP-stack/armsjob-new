import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../../common/Button";
import { InputField } from "../../common/InputField";
import { SelectField } from "../../common/SelectField";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { JobPosting } from "../../pages/SettingTable/JobpostingTable";
import { EditJobPostings } from "../../Commonapicall/settingsapicall/Jobpostingapicall";

interface EditJobPostingPopupProps {
    closePopup: () => void;
    refreshData: () => void;
    editJobPosting: JobPosting;
}

const jobPostingSchema = zod.object({
    job_type: zod.string().min(1, "Job type is required"),
    job_no: zod.string().min(1, "Job number is required"),
    job_location: zod.string().min(1, "Job location is required"),
    experience: zod.string().min(1, "Experience is required"),
    salary: zod.string().min(1, "Salary is required"),
    job_title: zod.string().min(1, "Job title is required"),
    job_description: zod.string().min(1, "Job description is required"),
});

type JobPostingFormData = zod.infer<typeof jobPostingSchema>;

export const EditJobPostingPopup: React.FC<EditJobPostingPopupProps> = ({
    closePopup,
    editJobPosting,
    refreshData
}) => {
    const [, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<JobPostingFormData>({
        resolver: zodResolver(jobPostingSchema),
    });

    useEffect(() => {
        if (editJobPosting) {
            setValue("job_type", editJobPosting.job_type || '');
            setValue("job_no", editJobPosting.job_no || '');
            setValue("job_location", editJobPosting.job_location || '');
            setValue("experience", editJobPosting.experience || '');
            setValue("salary", editJobPosting.salary || '');
            setValue("job_title", editJobPosting.job_title || '');
            setValue("job_description", editJobPosting.job_description || '');
        }
    }, [editJobPosting, setValue]);

    const handleFormSubmit = async (data:JobPostingFormData) => {
        try {
            const success = await EditJobPostings(
                editJobPosting.id,
                data.job_type || '',
                data.job_no || '',
                data.job_location || '',
                data.experience || '',
                data.salary || '',
                data.job_title || '',
                data.job_description || '',)
            if (success) {
                toast.success("Job Posting Added Successfully");
                closePopup();
                refreshData();
                reset();
            } else {
                toast.error("Failed to Add Job Posting. Please try again.");
            }
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
                        Edit Job Posting
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
                            <label className="text-sm font-semibold mb-1">Job Type</label>
                            <SelectField
                                label={""} {...register("job_type")}
                                options={[
                                    { value: "", label: "Select Job Type" },
                                    { value: "Full Time", label: "Full Time" },
                                    { value: "Part Time", label: "Part Time" },
                                    { value: "Contract", label: "Contract" },
                                    { value: "Hybrid", label: "Hybrid" },
                                ]}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.job_type?.message}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold mb-1">Job Number</label>
                            <InputField
                                label={""} type="text"
                                {...register("job_no")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.job_no?.message} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold mb-1">Job Location</label>
                            <InputField
                                label={""} type="text"
                                {...register("job_location")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.job_location?.message} />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Experience</label>
                            <InputField
                                label={""} type="text"
                                {...register("experience")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.experience?.message}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Salary</label>
                            <InputField
                                label={""} type="text"
                                {...register("salary")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.salary?.message} />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Job Title</label>
                            <InputField
                                label={""} type="text"
                                {...register("job_title")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.job_title?.message} />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-semibold mb-1">Job Description</label>
                            <textarea
                                {...register("job_description")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none h-32"
                            // error={errors.job_description?.message}
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