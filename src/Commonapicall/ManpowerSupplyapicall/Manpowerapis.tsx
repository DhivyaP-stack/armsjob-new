// import {  ManpowerSupplier, ManpowerSupplierResponse } from "../../pages/ManPowerSupply/ManPowerSupplyTable";
// import {  ManPowerData} from "../../pages/ManPowerSupply/ManPowerSupplyView";
// import { apiAxios } from "../apiUrl";

// //ManPower list 
// export const fetchManpowerList = async (): Promise<ManpowerSupplierResponse> => {
//   try {
//     const response = await apiAxios.get('/api/manpower-suppliers/');

//     if (!response.data || response.status !== 200) {
//       throw new Error("Failed to fetch manpower");
//     }
//     console.log("Candidates API response", response.data);
//     return response.data as ManpowerSupplierResponse;
//   } catch (error: any) {
//     console.error("Error fetching manpower:", error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || "Unable to fetch manpower. Please try again later.");
//   }
// };

// //Manower data by id
// export const fetchManPowerListById = async (id: number): Promise<ManpowerSupplier> => {
//   try {
//     const response = await apiAxios.get<ManpowerSupplier>(
//       `/api/manpower-suppliers/${id}/`
//     );
//     if (!response.data || response.status !== 200) {
//       throw new Error("Failed to fetch manpower");
//     }
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Unable to fetch manpower. Please try again later.");
//   }
// };


// //ManPower data list including Page ,search, and filter
// export const fetchManPowerSupplyList = async (page: number,search: string | undefined,filterBy: string) => {
//   try {
//     const response = await apiAxios.get(
//       `/api/manpower-suppliers/?page=${page}&search=${search}&filter_by=${filterBy}`
//     );
//     if (!response.data || response.status !== 200) {
//       throw new Error("Failed to fetch agents list");
//     }
//     return response.data;
//   } catch (error: any) {
//     console.error("Error fetching agents list:", error);
//   }
// };


// // Delete ManPower
// export const deleteManPowerData = async (Id: number): Promise<boolean> => {
//   try {
//     const response = await apiAxios.delete(`/api/manpower-suppliers/${Id}/`);
    
//     if (response.status === 200) {
//       return true; // Success
//     }
//     throw new Error("Failed to delete manpower");
//   } catch (error: any) {
//     console.error("Error deleting manpowe:", error);
//     throw new Error(
//       error.response?.data?.message || 
//       error.message || 
//       "Failed to delete manpower. Please try again."
//     );
//   }
// };

// //MannPower Namelist
// export const fetchManPowerSearch = async (query: string): Promise<ManPowerData[]> => {
//   try {
//     const res = await apiAxios.get<ManPowerData>("/api/manpower-suppliers/names-list/", {
//       params: { search: query },
//     });
//     return res.data.data;
//   } catch (error) {
//     console.error("Error fetching ManPower", error);
//     return [];
//   }
// };

// //Add Remark
// export const addManPowerRemark = async (manpower_supplier_id: number, remark: string) => {
//   try {
//     const response = await apiAxios.post('/api/manpower-suppliers/remarks/create/', {
//       manpower_supplier_id,
//       remark
//     });
//     return response.data;
//   } catch (error: unknown) {
//     console.error("Error adding remark:", error);
//     if (error && typeof error === "object" && "response" in error) {
//       const err = error as { response?: { data?: { message?: string } }; message?: string };
//       throw new Error(
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to add remark. Please try again."
//       );
//     }
//     throw new Error("Failed to add remark. Please try again.");
//   }
// };


// //Add Candidate
// export const AddManpowerSupply = async (
//   CompanyName: string, 
//   ContactPersonName: string, 
//   MobileNo: string, 
//   WhatsappNo:string, 
//   Email:string,
//   OfficeLocation:string,
//   CategoriesAvailable:string,
//   QuantityPerCategory:string,
//   PreviousExperience:string,
//   WorkedwithArmsBefore:string,
//   Comments:string,
//  ) => {
//   try {
//     const formData = new FormData();
//     formData.append('company_name', CompanyName);
//     formData.append('contact_person_name',ContactPersonName);
//     formData.append('mobile_no', MobileNo);
//     formData.append('whatsapp_no', WhatsappNo);
//     formData.append('email', Email);
//     formData.append('office_location', OfficeLocation);
//     formData.append('categories_available', CategoriesAvailable);
//     formData.append('quantity_per_category', QuantityPerCategory);
//     formData.append('previous_experience', PreviousExperience);
//     formData.append('worked_with_arms_before', WorkedwithArmsBefore);
//     formData.append('comments', Comments);
//     const response = await apiAxios.post('/api/manpower-suppliers/', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });

//     if (response.status !== 201) {
//       throw new Error('Failed to submit Manpower Supply data');
//     }

//     console.log('Manpower Supply submitted successfully:', response.data);
//     return response.data;
//   } catch (error: any) {
//     console.error('Error submitting ManpowerSupply:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Submission failed. Please try again.');
//   }
// };

// //EditCandidate
// export const EditCandidateList = async (
//   id: number,
//   FullName: string, 
//   MobileNumber: string, 
//   WhatsappNumber: string, 
//   Email:string, 
//   Nationality:string,
//   CurrentLocation:string,
//   VisaType:string,
//   AvailabilitytoJoin:string,
//   PositionApplyingFor:string,
//   Category:string,
//   UAEexperience:string,
//   SkillsTasks:string,
//   PreferredWorkLocation:string,
//   ExpectedSalary:string,
//   VisaExpiryDate:string,
//   OtherCategory:string,
//   LanguagesSpoken:string,
//   PreferredWorkType:string,
//   CurrentlyEmployed:string,
//   AdditionalNotes:string,
//   ReferralName:string,
//   ReferralContact:string
//  ) => {
//   try {
//     const formData = new FormData();
//     formData.append('full_name', FullName);
//     formData.append('mobile_number',MobileNumber);
//     formData.append('whatsapp_number', WhatsappNumber);
//     formData.append('email', Email);
//     formData.append('nationality', Nationality);
//     formData.append('current_location', CurrentLocation);
//     formData.append('visa_type', VisaType);
//     formData.append('availability_to_join',AvailabilitytoJoin);
//     formData.append('position_applying_for', PositionApplyingFor);
//     formData.append('category', Category);
//     formData.append('uae_experience_years', UAEexperience);
//     formData.append('skills_tasks', SkillsTasks);
//     formData.append('preferred_work_location', PreferredWorkLocation);
//     formData.append('expected_salary', ExpectedSalary);
//     formData.append('visa_expiry_date', VisaExpiryDate);
//     formData.append('other_category', OtherCategory);
//     formData.append('languages_spoken', LanguagesSpoken);
//     formData.append('preferred_work_type', PreferredWorkType);
//     formData.append('currently_employed', CurrentlyEmployed);
//     formData.append('additional_notes', AdditionalNotes);
//     formData.append('referral_name', ReferralName);
//     formData.append('referral_contact',ReferralContact)
//     const response = await apiAxios.patch(`/api/candidates/update/${id}/`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     if (response.status !== 200) {
//       throw new Error('Failed to submit candidate data');
//     }
//     console.log('Candidate updated successfully:', response.data);3
//     return response.data;
//   } catch (error: any) {
//     console.error('Error submitting candidate:', error.response?.message || error.message);
//     throw new Error(error.response?.message || 'Submission failed. Please try again.');
//   }
// };




import { ManpowerSupplier } from "../../pages/ManPowerSupply/EditManpowerSupplyPopup";
import { ManpowerSupplierResponse } from "../../pages/ManPowerSupply/ManPowerSupplyTable";
import { ManPowerData} from "../../pages/ManPowerSupply/ManPowerSupplyView";
import { apiAxios } from "../apiUrl";

// manPower list 
export const fetchManpowerList = async (): Promise<ManpowerSupplierResponse> => {
  try {
    const response = await apiAxios.get('/api/manpower-suppliers/');
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch manpower");
    }
    console.log("Candidates API response", response.data);
    return response.data as ManpowerSupplierResponse;
  } catch (error: any) {
    console.error("Error fetching manpower:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to fetch manpower. Please try again later.");
  }
};

// Manpower data by ID
export const fetchManPowerListById = async (id: number): Promise<ManpowerSupplier> => {
  try {
    const response = await apiAxios.get<ManpowerSupplier>(
      `/api/manpower-suppliers/${id}/`
    );
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch manpower");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Unable to fetch manpower. Please try again later.");
  }
};


// manPower data list including page ,search, and filter
export const fetchManPowerSupplyList = async (page: number,search: string | undefined,filterBy: string, PageSize:string, status:string) => {
  try {
    const response = await apiAxios.get(
      `/api/manpower-suppliers/?page=${page}&search=${search}&filter_by=${filterBy}&page_size=${PageSize}&status=${status}`
    );
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch agents list");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error fetching agents list:", error);
  }
};

// Delete manPower Data
export const deleteManPowerData = async (Id: number): Promise<boolean> => {
  try {
    const response = await apiAxios.delete(`/api/manpower-suppliers/${Id}/`);
    if (response.status === 200) {
      return true; // Success
    }
    throw new Error("Failed to delete manpower");
  } catch (error: any) {
    console.error("Error deleting manpowe:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to delete manpower. Please try again."
    );
  }
};

//MannPower namelist
export const fetchManPowerSearch = async (query: string): Promise<ManPowerData[]> => {
  try {
    const res = await apiAxios.get<ManPowerData>("/api/manpower-suppliers/names-list/", {
      params: { search: query },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching ManPower", error);
    return [];
  }
};


//Add Manpower Remark
export const addManPowerRemark = async (manpower_supplier_id: number, remark: string) => {
  try {
    const response = await apiAxios.post('/api/manpower-suppliers/remarks/create/', {
      manpower_supplier_id,
      remark
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error adding remark:", error);
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        err.response?.data?.message ||
        err.message ||
        "Failed to add remark. Please try again."
      );
    }
    throw new Error("Failed to add remark. Please try again.");
  }
};

//UpdateSupplier
// export const updateSupplier = async (supplierId:number, formData: { [s: string]: unknown; } | ArrayLike<unknown> | ManpowerSupplier, tradeLicenseFile: string | Blob | null, companyLicenseFile: string | Blob | null) => {
//   const formDataToSend = new FormData();
//   // Append all form data except excluded fields
//   Object.entries(formData).forEach(([key, value]) => {
//       if (key !== 'trade_license' && key !== 'company_license' && key !== 'manpower_remarks') {
//           formDataToSend.append(key, value.toString());
//       }
//   });
//   // Append files if available
//   if (tradeLicenseFile) {
//       formDataToSend.append('trade_license', tradeLicenseFile);
//   }
//   if (companyLicenseFile) {
//       formDataToSend.append('company_license', companyLicenseFile);
//   }
//   // Send PUT request
//   const response = await apiAxios.put(`/api/manpower-suppliers/${supplierId}/`, formDataToSend, {
//       headers: {
//           'Content-Type': 'multipart/form-data'
//       }
//   });
//   return response;
// };

//Add ManpowerSupply
export const AddManpowerSupply = async (
  CompanyName: string, 
  ContactPersonName: string, 
  MobileNo: string, 
  WhatsappNo:string, 
  Email:string,
  OfficeLocation:string,
  CategoriresAvailable:string,
  QuantityPerCategory:string,
  PreviousExp:string,
  WorkedarmsBefore:string,
  Comments:string,
 ) => {
  try {
    const formData = new FormData();
    formData.append('company_name', CompanyName);
    formData.append('contact_person_name',ContactPersonName);
    formData.append('mobile_no', MobileNo);
    formData.append('whatsapp_no', WhatsappNo);
    formData.append('email', Email);
    formData.append('office_location', OfficeLocation);
    formData.append('categories_available', CategoriresAvailable);
    formData.append('quantity_per_category',QuantityPerCategory);
    formData.append('previous_experience', PreviousExp);
    formData.append('worked_with_arms_before',WorkedarmsBefore);
    formData.append('comments', Comments);
    const response = await apiAxios.post('/api/manpower-suppliers/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 201) {
      throw new Error('Failed to submit candidate data');
    }
    console.log('ManpoerSupply submitted successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting candidate:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Submission failed. Please try again.');
  }
};

//Edir manpower Supply
export const EditManpowerSupply = async (
  id: number,
  CompanyName: string, 
  ContactPersonName: string, 
  MobileNo: string, 
  WhatsappNo:string, 
  Email:string,
  OfficeLocation:string,
  CategoriresAvailable:string,
  QuantityPerCategory:string,
  PreviousExp:string,
  WorkedarmsBefore:string,
  Comments:string,
 ) => {
  try {
    const formData = new FormData();
    formData.append('company_name', CompanyName);
    formData.append('contact_person_name',ContactPersonName);
    formData.append('mobile_no', MobileNo);
    formData.append('whatsapp_no', WhatsappNo);
    formData.append('email', Email);
    formData.append('office_location', OfficeLocation);
    formData.append('categories_available', CategoriresAvailable);
    formData.append('quantity_per_category',QuantityPerCategory);
    formData.append('previous_experience', PreviousExp);
    formData.append('worked_with_arms_before',WorkedarmsBefore);
    formData.append('comments', Comments);
    const response = await apiAxios.put(`/api/manpower-suppliers/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 200) {
      throw new Error('Failed to submit Manpower Supply data');
    }
    console.log('Manpower Supply updated successfully:', response.data);3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting Manpower Supply:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};

/// get manpower data
export const fetchSupplierData = async (supplierId: number): Promise<ManpowerSupplier> => {
  const response = await apiAxios.get(`/api/manpower-suppliers/${supplierId}/`);
  return response.data as ManpowerSupplier;
};

//Mnapower Status
export const Manpowerstatus = async (
  Id: string,
  Status: string, 
 ) => {
  try {
    const formData = new FormData();
    formData.append('id', Id);
    formData.append('boolean_value',Status);
    const response = await apiAxios.post('/api/manpower-suppliers/update-status/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 200) {
      throw new Error('Failed to submit Manpower Supply status data');
    }
    console.log('Manpower Supply status updated successfully:', response.data);3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting Manpower Supply status:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};