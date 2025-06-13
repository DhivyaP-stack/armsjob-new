import { apiAxios } from "../apiUrl";

//list JobPostings, saerch, pagination
export const fetchJobPostingsList = async (page: number, search: string | undefined, PageSize: string,) => {
  try {
    const response = await apiAxios.get(
      `/api/job-postings/?page=${page}&search=${search || ''}&page_size=${PageSize || ''}`
    );
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch job postings list");
    }
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching job postings list:", error);
    throw error;
  }
};

export const AddJobPostings = async (
    JobType: string,
    JobNo: string,
    JobLocation: string,
    Experience: string,
    Salary: string,
    JobTitle: string,
    JobDescription: string
) => {
    try {
        const formData = new FormData();
        formData.append('job_type', JobType);
        formData.append('job_no', JobNo);
        formData.append('job_location', JobLocation);
        formData.append('experience', Experience);
        formData.append('salary', Salary);
        formData.append('job_title', JobTitle);
        formData.append('job_description', JobDescription);
        const response = await apiAxios.post(
            "/api/job-postings/",formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (!response.data || response.status !== 201) {
            throw new Error("Failed to add job postings");
        }
        return response.data;
    } catch (error: any) {
        console.error("Error add job postings:", error);
    }
};

//Edit JobPostings
export const EditJobPostings = async (
    id:number,
    JobType: string,
    JobNo: string,
    JobLocation: string,
    Experience: string,
    Salary: string,
    JobTitle: string,
    JobDescription: string
) => {
    try {
        const formData = new FormData();
        formData.append('job_type', JobType);
        formData.append('job_no', JobNo);
        formData.append('job_location', JobLocation);
        formData.append('experience', Experience);
        formData.append('salary', Salary);
        formData.append('job_title', JobTitle);
        formData.append('job_description', JobDescription);
        const response = await apiAxios.patch(
            `/api/job-postings/update/${id}/`,formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to add job postings");
        }
        return response.data;
    } catch (error: any) {
        console.error("Error add job postings:", error);
    }
};

//DeleteCandidate
export const deleteJobPosting = async (Id: number): Promise<boolean> => {
  try {
    const response = await apiAxios.delete(`/api/job-postings/delete/${Id}/`);
    if (response.status === 200) {
      return true; // Success
    }
    throw new Error("Failed to delete Job Posting");
  } catch (error: any) {
    console.error("Error deleting Job Posting:", error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to delete Job Posting. Please try again."
    );
  }
};