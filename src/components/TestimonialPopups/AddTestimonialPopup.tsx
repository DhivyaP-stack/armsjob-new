import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../../common/Button";
import { InputField } from "../../common/InputField";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

interface AddTestimonialPopupProps {
    closePopup: () => void;
    refreshData: () => void;
}

const testimonialSchema = zod.object({
    clientName: zod.string().min(1, "Client name is required"),
    website: zod.string().min(1, "Website is required").url("Please enter a valid URL"),
    testimonial: zod.string().min(1, "Testimonial is required").min(20, "Testimonial should be at least 20 characters"),
    status: zod.string().min(1, "Status is required"),
});

type TestimonialFormData = zod.infer<typeof testimonialSchema>;

export const AddTestimonialPopup: React.FC<AddTestimonialPopupProps> = ({
    closePopup,
    refreshData
}) => {
    const [, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TestimonialFormData>({
        resolver: zodResolver(testimonialSchema),
    });

    const handleFormSubmit = async () => {
        try {
            // TODO: Add API call to save testimonial
            // await AddTestimonial(data);
            reset();
            closePopup();
            refreshData();
            toast.success("Testimonial added successfully");
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
                        Add New Testimonial
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
                            <label className="text-sm font-semibold mb-1">Client Name</label>
                            <InputField
                                label={""}
                                type="text"
                                {...register("clientName")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.clientName?.message}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Website</label>
                            <InputField
                                label={""}
                                type="url"
                                {...register("website")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.website?.message}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-semibold mb-1">Testimonial</label>
                            <textarea
                                {...register("testimonial")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none h-32"
                            />
                            {errors.testimonial?.message && (
                                <p className="text-red-500 text-xs mt-1">{errors.testimonial.message}</p>
                            )}
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