// import axios from 'axios';
import { apiAxios } from '../apiUrl';
interface OverseasRecruitment {
  id: number;
  overseas_recruitment_id: string;
  company_name: string;
  country: string;
  contact_person_name: string;
  mobile_no: string;
  whatsapp_no: string | null;
  email_address: string;
  categories_you_can_provide: string;
  categories_you_can_provide_names:string;
  nationality_of_workers: string;
  mobilization_time: string;
  uae_deployment_experience: boolean;
  relevant_docs: string | null;
  comments: string | null;
  status: boolean;
  is_deleted: boolean;
  created_at: string;
}
interface OverseasRecruitmentFormData {
  company_name: string;
  country: string;
  contact_person_name: string;
  mobile_no: string;
  whatsapp_no: string;
  email_address: string;
  categories_you_can_provide: string;
  //categories_you_can_provide_names:string;
  nationality_of_workers: string;
  mobilization_time: string;
  uae_deployment_experience: boolean;
  comments: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    status: string;
    message: string;
    data: OverseasRecruitment[];
  };
}

//Search table, All, Pagination
export const fetchOverseasRecruitmentList = async (page: number, search: string | undefined, filterBy: string, PageSize:string, status:string) => {
  try {
    const response = await apiAxios.get<ApiResponse>(
      `/api/recruitments/?page=${page}&search=${search || ''}&filter_by=${filterBy || ''}&page_size=${PageSize || ''}&status=${status || ''}`
    );

    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch overseas recruitment list");
    }
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching overseas recruitment list:", error);
    throw error;
  }
};

//Delete Overseas
export const deleteOverseasRecruitment = async (id: number): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('id', id.toString());
    const response = await apiAxios.post(`/api/recruitments/delete/`, formData);
    if (response.status === 200) {
      return true;
    }
    throw new Error("Failed to delete Overseas Recruitment");
  } catch (error: unknown) {
    console.error("Error deleting Overseas Recruitment:", error);
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete Overseas Recruitment. Please try again."
      );
    }
    throw new Error("Failed to delete Overseas Recruitment. Please try again.");
  }
};

//Add Overseas
// export const addOverseasRecruitment = async (data: OverseasRecruitmentFormData) => {
//   try {
//     const response = await apiAxios.post('/api/recruitments/', data);
//     return response.data;
//   } catch (error: unknown) {
//     console.error("Error adding Overseas Recruitment:", error);
//     throw error;
//   }
// };

export const addOverseasRecruitment = async (formData: FormData) => {
  try {
    const response = await apiAxios.post('/api/recruitments/', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error adding Overseas Recruitment:", error);
    throw error;
  }
};

//Edit Overseas
export const updateOverseasRecruitment = async (id: number, data: OverseasRecruitmentFormData) => {
  try {
    const response = await apiAxios.patch(`/api/recruitments/update/${id}/`, data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating Overseas Recruitment:", error);
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        err.response?.data?.message ||
        err.message ||
        "Failed to update Overseas Recruitment. Please try again."
      );
    }
    throw new Error("Failed to update Overseas Recruitment. Please try again.");
  }
};

//Recruitment Names
export const fetchOverseasRecruitmentData = async () => {
  try {
    const response = await apiAxios.get(`/api/recruitments/names/`);
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch overseas recruitment data");
    }
    return response.data || [];
  } catch (error: unknown) {
    console.error("Error fetching Overseas Recruitment:", error);
    throw error;
  }
};

//
export const fetchOverseasRecruitmentDataByID = async (id: number) => {
  try {
    const response = await apiAxios.get(`/api/recruitments/${id}/`);
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch overseas recruitment data");
    }
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching Overseas Recruitment:", error);
    throw error;
  }
};

//search Recruitments Namelist
export const fetchRecruitmentNames = async (query: string) => {
  try {
    const response = await apiAxios.get(`/api/recruitments/names/`, {
      params: {
        search: query
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching Overseas Recruitment:", error);
    throw error;
  }
};

//Add Remark
export const addOverseasRemark = async (overseas_recruitment_id: number, remark: string) => {
  try {
    const response = await apiAxios.post('/api/recruitments/remarks/create/', {
      overseas_recruitment_id,
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

//OverseasStatus
export const OverseasStatus = async (
  Id: string,
  Status: string, 
 ) => {
  try {
    const formData = new FormData();
    formData.append('id', Id);
    formData.append('boolean_value',Status);
    const response = await apiAxios.post('/api/recruitments/update-status/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 200) {
      throw new Error('Failed to submit Overseas Recruitment status data');
    }
    console.log('Overseas Recruitment status updated successfully:', response.data);3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting Overseas Recruitment status:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};

