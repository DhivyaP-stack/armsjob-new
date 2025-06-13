import { apiAxios } from "../apiUrl";

export const fetchBlogsList = async (page: number, search: string | undefined, PageSize: string,) => {
  try {
    const response = await apiAxios.get(
      `/api/blogs/?page=${page}&search=${search || ''}&page_size=${PageSize || ''}`
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


export const AddBlog = async (
    date: string,
    title: string,
    blogdescription: string,
    postedby: string,
) => {
    try {
        const formData = new FormData();
        formData.append('date', date);
        formData.append('title', title);
        formData.append('blog_description', blogdescription);
        formData.append('posted_by', postedby);
        
        const response = await apiAxios.post(
            "/api/blogs/",formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to add Blog Data");
        }
        return response.data;
    } catch (error: any) {
        console.error("Error add Blog Data:", error);
    }
};

//Edit JobPostings
export const EditBlog = async (
    id:number,
    date: string,
    title: string,
    postedby: string,
    blogdescription: string,
) => {
    try {
        const formData = new FormData();
        formData.append('date', date);
        formData.append('title', title);
        formData.append('posted_by', postedby );
        formData.append('blog_description', blogdescription);
        const response = await apiAxios.patch(
            `/api/blogs/update/${id}/`,formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to add Blogs Data");
        }
        return response.data;
    } catch (error: any) {
        console.error("Error add Blogs Data:", error);
    }
};

//DeleteCandidate
export const DeleteBlog = async (Id: number): Promise<boolean> => {
  try {
    const response = await apiAxios.delete(`/api/blogs/delete/${Id}/`);
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