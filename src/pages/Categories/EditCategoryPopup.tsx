import React, { useEffect, useState } from 'react';
import { Button } from '../../common/Button';
import { IoCloseCircle } from 'react-icons/io5';
import { toast } from "react-toastify";
import { EditCategoryList } from '../../Commonapicall/Categoriesapicall/Categoriesapis';
import { InputField } from '../../common/InputField';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface EditCategoryPopupProps {
    closePopup: () => void;
    refreshData: () => void;
    EditCategory: {
        id: number;
        category: string;
        status: boolean;
        is_deleted: boolean;
    }
}

// ✅ Zod schema requiring non-empty category
const categorySchema = z.object({
    category: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const EditCategoryPopup: React.FC<EditCategoryPopupProps> = ({
    closePopup,
    refreshData,
    EditCategory
}) => {
    const [, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema)
    });

    useEffect(() => {
        if (EditCategory) {
            setValue("category", EditCategory.category);
        }
    }, [EditCategory, setValue]);

    const onSubmit = async (data: CategoryFormData) => {
        try {
            setLoading(true);
            const success = await EditCategoryList(
                EditCategory.id,
                data.category || ''
            );
            if (success) {
                toast.success("Category updated Successfully");
                closePopup();
                refreshData();
                reset();
            } else {
                toast.error("Failed to update Category. Please try again.");
            }
        } catch (error: any) {
            console.error(error.message || "Failed to Add Category.");
            toast.error("Failed to update Category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-armsAsh bg-opacity-100 flex justify-center items-center z-50">
            <div className="container mx-auto">
                <div className="relative bg-white rounded-[5px] w-4/12 mx-auto px-5 py-5">
                    {/* Header */}
                    <div className="relative mb-10">
                        <h2 className="text-2xl text-armsBlack font-semibold pb-3 border-b-2 border-armsgrey">Edit Category</h2>
                    </div>

                    {/* Close Button */}
                    <div
                        onClick={closePopup}
                        className="absolute top-5 right-5 w-fit cursor-pointer"
                    >
                        <IoCloseCircle className="text-[32px]" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="text-left">
                        <div className="mb-4">
                            <InputField
                                type="text"
                                {...register("category")}
                                className="w-full rounded-[5px] border-[1px] border-armsgrey pl-2 pr-2 py-1.5 focus-within:outline-none"
                                label="Category"
                                error={errors.category?.message}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="pt-5">
                            <div className="flex items-center justify-center space-x-5">
                                <Button
                                    onClick={closePopup}
                                    buttonType="button"
                                    buttonTitle="Cancel"
                                    className="px-7 py-2.5 text-armsBlack rounded-sm font-semibold hover:bg-gray-200 cursor-pointer"
                                />
                                <Button
                                    buttonType="submit"
                                    buttonTitle="Submit"
                                    className="bg-armsjobslightblue text-lg text-armsWhite font-semibold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
