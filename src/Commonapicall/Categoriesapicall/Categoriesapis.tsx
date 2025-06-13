import { apiAxios } from "../apiUrl";

// Fetch all categories, search, pagination
export const getCategories = async (page: number, search: string | undefined, PageSize: string,) => {
  try {
    const response = await apiAxios.get(
      `/api/categories/?page=${page}&search=${search || ''}&page_size=${PageSize || ''}`
    );
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch categories list");
    }
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching categories list:", error);
    throw error;
  }
};

//dropdown Categories
export const dropdowngetCategories = async () => {
  try {
    const response = await apiAxios.get(`/api/categories/dropdown/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

//Add Candidate
export const AddCategoryList = async (
  Category: string,
) => {
  try {
    const formData = new FormData();
    formData.append('category', Category);
    const response = await apiAxios.post('/api/categories/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 201) {
      throw new Error('Failed to submit category data');
    }
    console.log('category submitted successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting candidate:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Submission failed. Please try again.');
  }
};

//Edit Category
export const EditCategoryList = async (
  id: number,
  Category: string,
) => {
  try {
    const formData = new FormData();
    formData.append('category', Category);
    const response = await apiAxios.put(`/api/categories/update/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 200) {
      throw new Error('Failed to update category data');
    }
    console.log('category update successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating candidate:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Submission failed. Please try again.');
  }
};

//DeleteCategory
export const deleteCategory = async (Id: number): Promise<boolean> => {
  try {
    const response = await apiAxios.delete(`/api/categories/delete/${Id}/`);
    if (response.status === 200) {
      return true; // Success
    }
    throw new Error("Failed to delete Category");
  } catch (error: any) {
    console.error("Error deleting Category:", error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to delete Category. Please try again."
    );
  }
};

