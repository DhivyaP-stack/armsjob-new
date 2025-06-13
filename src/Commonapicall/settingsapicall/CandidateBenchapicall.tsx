import { apiAxios } from "../apiUrl";

//list JobPostings, search, pagination
export const fetchCandidateBenchList = async (page: number, search: string | undefined, PageSize: string,) => {
  try {
    const response = await apiAxios.get(
      `/api/candidate-bench/?page=${page}&search=${search || ''}&page_size=${PageSize || ''}`
    );
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch candidate bench list");
    }
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching candidate bench list:", error);
    throw error;
  }
};

//Add Candidate Bench
export const AddCandidateBench = async (
  Name: string,
  Technology: string,
  Experience: string,
  Availability: string,
  Location: string,
) => {
  try {
    const formData = new FormData();
    formData.append('name', Name);
    formData.append('technology', Technology);
    formData.append('experience', Experience);
    formData.append('availability', Availability);
    formData.append('location', Location);
    const response = await apiAxios.post(
      "/api/candidate-bench/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (!response.data || response.status !== 201) {
      throw new Error("Failed to add Candidate Bench");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error add Candidate Bench:", error);
  }
};

//Edit Candidate Bench
export const EditCandidateBench = async (
  id: number,
  Name: string,
  Technology: string,
  Experience: string,
  Availability: string,
  Location: string,
) => {
  try {
    const formData = new FormData();
    formData.append('name', Name);
    formData.append('technology', Technology);
    formData.append('experience', Experience);
    formData.append('availability', Availability);
    formData.append('location', Location);
    const response = await apiAxios.patch(
      `/api/candidate-bench/update/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to add Candidate Bench");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error add Candidate Bench:", error);
  }
};

//Delete Candidate Bench
export const deleteCandidateBench = async (Id: number): Promise<boolean> => {
  try {
    const response = await apiAxios.delete(`/api/candidate-bench/delete/${Id}/`);
    if (response.status === 200) {
      return true; // Success
    }
    throw new Error("Failed to delete Candidate Bench");
  } catch (error: any) {
    console.error("Error deleting Candidate Bench:", error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to delete Candidate Bench. Please try again."
    );
  }
};