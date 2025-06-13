import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../../common/Button";
import { InputField } from "../../common/InputField";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { BlogTable } from "../../pages/SettingTable/BlogTable";
import { EditBlog } from "../../Commonapicall/settingsapicall/BlogTableaplicall";

interface EditBlogPopupProps {
    closePopup: () => void;
    refreshData: () => void;
    editBlogTable: BlogTable
}

const blogSchema = zod.object({
    blogtitle: zod.string().min(1, "Blog ID is required"),
    date: zod.string().min(1, "Date is required"),
    title: zod.string().min(1, "Title is required"),
    blog_description: zod.string().min(1, "Description is required"),
    posted_by: zod.string().min(1, "Posted by is required"),
    status: zod.string().min(1, "Status is required"),
});

type BlogFormData = zod.infer<typeof blogSchema>;

export const EditBlogPopup: React.FC<EditBlogPopupProps> = ({
    closePopup,
    editBlogTable,
    refreshData
}) => {
    const [, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<BlogFormData>({
        resolver: zodResolver(blogSchema),
    });




    useEffect(() => {
        if (editBlogTable) {
            setValue("blog_description", editBlogTable.blog_description || '');
            setValue("title", editBlogTable.title || '');
            setValue("date", editBlogTable.date || '');
            setValue("posted_by", editBlogTable.posted_by || '');
            setValue("blogtitle", editBlogTable.title || ''); // or whatever is appropriate
            setValue("status", editBlogTable.status || 'active'); // provide actual value
        }
    }, [editBlogTable, setValue]);

    const handleFormSubmit = async (data: BlogFormData) => {
        try {
            const success = await EditBlog(
                editBlogTable.id,
                data.date || '',
                data.title || '',
                data.posted_by || '',
                data.blog_description || '',
            )
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
                        Edit Blog
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
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-semibold mb-1">Blog Title</label>
                            <InputField
                                label={""}
                                type="text"
                                {...register("title")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.title?.message}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold mb-1">Date</label>
                            <InputField
                                label={""}
                                type="text"
                                {...register("date")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.date?.message}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-1">Posted by</label>
                            <InputField
                                label={""}
                                type="text"
                                {...register("posted_by")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none"
                                error={errors.posted_by?.message}
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm font-semibold mb-1">Description</label>
                        <textarea
                            {...register("blog_description")}
                            className="w-full rounded-[5px] border-[1px] border-armsgrey px-2 py-1.5 focus-within:outline-none h-32"
                        />
                        {errors.blog_description?.message && (
                            <p className="text-red-500 text-xs mt-1">{errors.blog_description.message}</p>
                        )}
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

