import { apiAxios } from "../apiUrl";

//Testimonial list
export const fetchTestimonialList = async (page: number, search: string | undefined, PageSize: string,) => {
  try {
    const response = await apiAxios.get(
      `/api/testimonials/?page=${page}&search=${search || ''}&page_size=${PageSize || ''}`
    );
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch testimonials list");
    }
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching testimonials list:", error);
    throw error;
  }
};

//Add Testimonial
export const AddTestimonial = async (
    ClientName: string,
    Website: string,
    Testimonial: string,
) => {
    try {
        const formData = new FormData();
        formData.append('client_name', ClientName);
        formData.append('website', Website);
        formData.append('testimonial', Testimonial);
        const response = await apiAxios.post(
            "/api/testimonials/",formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (!response.data || response.status !== 201) {
            throw new Error("Failed to add testimonial");
        }
        return response.data;
    } catch (error: any) {
        console.error("Error add testimonial:", error);
    }
};

//Edit Testimonial
export const EditTestimonial = async (
    id:number,
   ClientName: string,
    Website: string,
    Testimonial: string,
) => {
    try {
        const formData = new FormData();
        formData.append('client_name', ClientName);
        formData.append('website', Website);
        formData.append('testimonial', Testimonial);
        const response = await apiAxios.patch(
            `/api/testimonials/update/${id}/`,formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to add testimonial");
        }
        return response.data;
    } catch (error: any) {
        console.error("Error add testimonial:", error);
    }
};

//DeleteTestimonial
export const deleteTestimonial = async (Id: number): Promise<boolean> => {
  try {
    const response = await apiAxios.delete(`/api/testimonials/delete/${Id}/`);
    if (response.status === 200) {
      return true; // Success
    }
    throw new Error("Failed to delete testimonial");
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to delete testimonial. Please try again."
    );
  }
};