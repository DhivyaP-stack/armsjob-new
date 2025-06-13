import React, { useState } from 'react';
import { Button } from '../../common/Button';
import { IoCloseCircle } from 'react-icons/io5';
import { deleteClientEnquiry } from '../../Commonapicall/ClientEnquiryapicall/ClientEnquiryapis';
import { toast } from 'react-toastify';

interface DeleteClientPopupProps {
  closePopup: () => void;
  ClientData: {
    id: string;
    name: string;
  };
  refreshData: () => void;
}

export const DeleteClientPopup: React.FC<DeleteClientPopupProps> = ({ 
  closePopup, 
  ClientData, 
  refreshData 
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleClientDelete = async () => {

    setError(null);
    try {
      const success = await deleteClientEnquiry(ClientData.id);
      if (success) {
        closePopup();
        refreshData();
        toast.success("ClientEnquiry Deleted Successfully")
      } else {
        setError("Failed to delete agent. Please try again.");
         toast.error("Failed to delete agent. Please try again.");
      }
    } catch (error: any) {
      setError(error.message || "Failed to delete agent. Please try again.");
    } 
  };

  return (
    <div className="fixed inset-0 bg-armsAsh bg-opacity-100 flex justify-center items-center z-50">
      <div className="container mx-auto">
        <div className="relative bg-white rounded-[5px] w-4/12 mx-auto px-5 py-5">
          <div className="relative mb-10">
            <h2 className="text-2xl text-armsBlack font-semibold pb-3 border-b-2 border-armsgrey ">Delete Client Enquiry</h2>
            <div className="absolute inset-x-0 bottom-[-20px] mx-auto rounded-md w-full h-0.5"></div>
          </div>

          {/* Close Button */}
          <div
            onClick={closePopup}
            className="absolute top-5 right-5 w-fit cursor-pointer"
          >
            <IoCloseCircle className="text-armsgrey text-[32px]" />
          </div>

          {/* Content */}
          <div className="text-center">
            <p className="text-lg text-armsBlack">
              Are you sure you want to delete {ClientData.name}?
            </p>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Buttons */}
            <div className="pt-5">
              <div className="flex items-center justify-center space-x-5">
                {/* Cancel Button */}
                <Button
                  onClick={closePopup}
                  buttonType="button"
                  buttonTitle="Cancel"
                  className="px-7 py-2.5  text-armsBlack rounded-sm font-semibold hover:bg-gray-200 cursor-pointer"
                />

                {/* Submit Button */}
                <Button
                  onClick={handleClientDelete}
                  buttonType="submit"
                  buttonTitle="Delete"
                  className="bg-armsjobslightblue text-lg text-armsWhite font-semibold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-armsWhite hover:text-armsjobslightblue hover:border-armsjobslightblue"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};