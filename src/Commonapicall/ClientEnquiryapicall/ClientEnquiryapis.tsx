import { apiAxios } from '../apiUrl';
interface ClientEnquiryApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    status: string;
    message: string;
    data: ClientEnquiryList[];
  };
}
interface ClientEnquiryList {
  id: number;
  client_enquiry_id: string;
  company_name: string;
  email: string;
  contact_person_name: string;
  mobile_number: string;
  nature_of_work: string;
  project_location: string;
  project_duration: string;
  categories_required: string;
  categories_required_names:string;
  quantity_required: string;
  project_start_date: string;
  kitchen_facility: boolean;
  transportation_provided: boolean;
  accommodation_provided: boolean;
  remarks: string | null;
  query_type: string;
  status: string;
  is_deleted: boolean;
  created_at: string;
}

//List,Search, All, Pagination
export const filterClientEnquiryList = async (page: number, search: string | undefined, filterBy: string, PageSize:string, status:string) => {
  try {
    const response = await apiAxios.get<ClientEnquiryApiResponse>(
      `/api/client-enquiries/?page=${page}&search=${search || ''}&filter_by=${filterBy || ''}&page_size=${PageSize || ''}&status=${status || ''}`
    );
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch Client Enquiry list");
    }
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching Client Enquiry list:", error);
    throw error;
  }
};

//AddClientEnquiry
export const AddClientEnquiryList = async (
    CompanyName: string,
    Email: string,
    ContactPersonName: string,
    MobileNO: string,
    NatureofWork: string,
    ProjectLocation: string,
    ProjectDuration: string,
    CategoriesRequired: string,
    QuantityRequired: string,
    ProjectStarDate: string,
    KitchenFacility: string,
    TransportationProvided: string,
    AccomodationProvide: string,
    Remarks: string,
    QueryType: string,
) => {
    try {
        const formData = new FormData();
        formData.append('company_name', CompanyName);
        formData.append('email', Email);
        formData.append('contact_person_name', ContactPersonName);
        formData.append('mobile_number', MobileNO);
        formData.append('nature_of_work', NatureofWork);
        formData.append('project_location', ProjectLocation);
        formData.append('project_duration', ProjectDuration);
        formData.append('categories_required', CategoriesRequired);
        formData.append('quantity_required', QuantityRequired);
        formData.append('project_start_date', ProjectStarDate);
        formData.append('kitchen_facility', KitchenFacility);
        formData.append('transportation_provided', TransportationProvided);
        formData.append('accommodation_provided', AccomodationProvide);
        formData.append('remarks', Remarks);
        formData.append('query_type', QueryType);
        const response = await apiAxios.post('/api/client-enquiries/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.status !== 201) {
            throw new Error('Failed to submit client Enquiry data');
        }
        console.log('ClientEnquiry submitted successfully:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error submitting ClientEnquiry:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Submission failed. Please try again.');
    }
};

//EditClientEnquiry
export const EditClientEnquiry = async (
  id: number,
  CompanyName: string, 
  Email: string, 
  ContactPersonName: string, 
  MobileNumber:string, 
  NatureofWork:string,
  ProjectLocation:string,
  ProjectDuration:string,
  CategoriesRequired:string,
  QuantityRequired:string,
  ProjectStartDtae:string,
  KitchenFacility:string,
  TransportationProvided:string,
  AccomodationProvided:string,
  Remarks:string,
  QueryType:string,
 ) => {
  try {
    const formData = new FormData();
    formData.append('company_name', CompanyName);
    formData.append('email',Email);
    formData.append('contact_person_name', ContactPersonName);
    formData.append('mobile_number', MobileNumber);
    formData.append('nature_of_work', NatureofWork);
    formData.append('project_location', ProjectLocation);
    formData.append('project_duration', ProjectDuration);
    formData.append('categories_required',CategoriesRequired);
    formData.append('quantity_required', QuantityRequired);
    formData.append('project_start_date', ProjectStartDtae);
    formData.append('kitchen_facility', KitchenFacility);
    formData.append('transportation_provided',TransportationProvided);
    formData.append('accommodation_provided', AccomodationProvided);
    formData.append('remarks', Remarks);
    formData.append('query_type', QueryType);
    const response = await apiAxios.patch(`/api/client-enquiries/update/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 200) {
      throw new Error('Failed to submit candidate data');
    }
    console.log('Candidate updated successfully:', response.data);3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting candidate:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};

//DeleteCandidate
export const deleteClientEnquiry = async (Id: string) => {
    try {
        const formData = new FormData();
        formData.append('id', Id);
        const response = await apiAxios.post(`/api/client-enquiries/delete/`, formData,);
        if (response.status === 200) {
            return true; // Success
        }
        throw new Error("Failed to delete client enquiry");
    } catch (error: any) {
        console.error("Error deleting client enquiry:", error);
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to delete client enquiry. Please try again."
        );
    }
};

// ViewPAge --> ClientEnquiry Names List
export const fetchClientEnquiryNames = async (search?:string) => {
  try {
    const response = await apiAxios.get('/api/client-enquiries/names/',
      {
      params: { search },
    });
    if (response.status !== 200 || !response.data) {
      throw new Error('Failed to fetch ClientEnquiry names');
    }
    console.log('ClientEnquiry Names List:', response.data); // Optional
    return response.data;
  } catch (error: any) {
    console.error('Error fetching ClientEnquiry names:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch ClientEnquiry names.');
  }
};

//ViewCandidateNamw
export const ViewClientNameById = async (
  id: number,
 ) => {
  try {
    const response = await apiAxios.get(`/api/client-enquiries/${id}/`)
    if (response.status !== 200) {
      throw new Error('Failed to submit ClientEnquiry data');
    }
    console.log('ClientEnquiry updated successfully:', response.data);3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting ClientEnquiry:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};

//ClientEnquiry Status
export const ClientEnquiryStatus = async (
  Id: string,
  Status: string, 
 ) => {
  try {
    const formData = new FormData();
    formData.append('id', Id);
    formData.append('boolean_value',Status);
    const response = await apiAxios.post('/api/client-enquiries/update-status/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 200) {
      throw new Error('Failed to submit ClientEnquiry status data');
    }
    console.log('ClientEnquiry status updated successfully:', response.data);3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting ClientEnquiry status:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};