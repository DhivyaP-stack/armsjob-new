
import { apiAxios } from '../apiUrl';

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    status: string;
    message: string;
    data: CandidateList[];
  };
}

interface CandidateList {
  id: number;
  candidate_id: number;
  photo_upload?: string | null;
  full_name: string;
  mobile_number: string;
  whatsapp_number: string;
  email: string;
  nationality: string;
  current_location: string;
  visa_type: string;
  visa_expiry_date: string | null;
  availability_to_join: string;
  position_applying_for: string;
  category: string;
  category_names: string;
  other_category?: string | null;
  uae_experience_years: string;
  skills_tasks: string;
  preferred_work_location: string;
  expected_salary: string;
  upload_cv: string;
  relevant_docs1?: string | null;
  relevant_docs2?: string | null;
  relevant_docs3?: string | null;
  status: string;
  created_at: string;
  is_deleted: boolean;
  remarks: {
    id: number;
    remark: string;
    candidate_full_name: string;
    created_at: string;
    updated_at: string;
  }[];
  languages_spoken: string;
  preferred_work_type: string;
  currently_employed: boolean;
  additional_notes: string;
  referral_name: string;
  referral_contact: string;
}

// Get CandidateList
export const fetchCandidatesList = async () => {
  try {
    const response = await apiAxios.get('/api/candidates/');
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch candidates");
    }
    console.log("Candidates API response", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching candidates:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to fetch candidates. Please try again later.");
  }
};

//Add Candidate
export const AddCandidateList = async (
  FullName: string,
  MobileNumber: string,
  WhatsappNumber: string,
  Email: string,
  Nationality: string,
  CurrentLocation: string,
  VisaType: string,
  AvailabilitytoJoin: string,
  PositionApplyingFor: string,
  Category: string,
  UAEexperience: string,
  SkillsTasks: string,
  PreferredWorkLocation: string,
  ExpectedSalary: string,
  VisaExpiryDate: string,
  OtherCategory: string,
  LanguagesSpoken: string,
  PreferredWorkType: string,
  CurrentlyEmployed: string,
  AdditionalNotes: string,
  ReferralName: string,
  ReferralContact: string,
  cvFile?: File,
  insuranceFile?: File,
  passportFile?: File,
  visaFile?: File,
  nocFile?: File,
  licenseFile?: File,
  experienceCertificateFile?: File
) => {
  try {
    const formData = new FormData();
    formData.append('full_name', FullName);
    formData.append('mobile_number', MobileNumber);
    formData.append('whatsapp_number', WhatsappNumber);
    formData.append('email', Email);
    formData.append('nationality', Nationality);
    formData.append('current_location', CurrentLocation);
    formData.append('visa_type', VisaType);
    formData.append('availability_to_join', AvailabilitytoJoin);
    formData.append('position_applying_for', PositionApplyingFor);
    formData.append('category', Category);
    formData.append('uae_experience_years', UAEexperience);
    formData.append('skills_tasks', SkillsTasks);
    formData.append('preferred_work_location', PreferredWorkLocation);
    formData.append('expected_salary', ExpectedSalary);
    formData.append('visa_expiry_date', VisaExpiryDate);
    formData.append('other_category', OtherCategory);
    formData.append('languages_spoken', LanguagesSpoken);
    formData.append('preferred_work_type', PreferredWorkType);
    formData.append('currently_employed', CurrentlyEmployed);
    formData.append('additional_notes', AdditionalNotes);
    formData.append('referral_name', ReferralName);
    formData.append('referral_contact', ReferralContact)
    if (cvFile) formData.append('upload_cv', cvFile);
    if (insuranceFile) formData.append('insurance', insuranceFile);
    if (passportFile) formData.append('passport', passportFile);
    if (visaFile) formData.append('visa', visaFile);
    if (nocFile) formData.append('noc', nocFile);
    if (licenseFile) formData.append('license', licenseFile);
    if (experienceCertificateFile) formData.append('experience_certificate', experienceCertificateFile);
    const response = await apiAxios.post('/api/candidates/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 201) {
      throw new Error('Failed to submit candidate data');
    }
    console.log('Candidate submitted successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting candidate:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Submission failed. Please try again.');
  }
};

//EditCandidate
export const EditCandidateList = async (
  id: number, FullName: string, MobileNumber: string, WhatsappNumber: string, Email: string, Nationality: string, CurrentLocation: string, VisaType: string, AvailabilitytoJoin: string, PositionApplyingFor: string, Category: string, UAEexperience: string, SkillsTasks: string, PreferredWorkLocation: string, ExpectedSalary: string, VisaExpiryDate: string, OtherCategory: string, LanguagesSpoken: string, PreferredWorkType: string, CurrentlyEmployed: string, AdditionalNotes: string, ReferralName: string, ReferralContact: string,
  cvFile?: File,
  insuranceFile?: File,
  passportFile?: File,
  visaFile?: File,
  nocFile?: File,
  licenseFile?: File,
  experienceCertificateFile?: File) => {
  try {
    const formData = new FormData();
    formData.append('full_name', FullName);
    formData.append('mobile_number', MobileNumber);
    formData.append('whatsapp_number', WhatsappNumber);
    formData.append('email', Email);
    formData.append('nationality', Nationality);
    formData.append('current_location', CurrentLocation);
    formData.append('visa_type', VisaType);
    formData.append('availability_to_join', AvailabilitytoJoin);
    formData.append('position_applying_for', PositionApplyingFor);
    formData.append('category', Category);
    formData.append('uae_experience_years', UAEexperience);
    formData.append('skills_tasks', SkillsTasks);
    formData.append('preferred_work_location', PreferredWorkLocation);
    formData.append('expected_salary', ExpectedSalary);
    formData.append('visa_expiry_date', VisaExpiryDate);
    formData.append('other_category', OtherCategory);
    formData.append('languages_spoken', LanguagesSpoken);
    formData.append('preferred_work_type', PreferredWorkType);
    formData.append('currently_employed', CurrentlyEmployed);
    formData.append('additional_notes', AdditionalNotes);
    formData.append('referral_name', ReferralName);
    formData.append('referral_contact', ReferralContact);
    if (cvFile) formData.append('upload_cv', cvFile);
    if (insuranceFile) formData.append('insurance', insuranceFile);
    if (passportFile) formData.append('passport', passportFile);
    if (visaFile) formData.append('visa', visaFile);
    if (nocFile) formData.append('noc', nocFile);
    if (licenseFile) formData.append('license', licenseFile);
    if (experienceCertificateFile) formData.append('experience_certificate', experienceCertificateFile);
    const response = await apiAxios.patch(`/api/candidates/update/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 200) {
      throw new Error('Failed to submit candidate data');
    }
    console.log('Candidate updated successfully:', response.data); 3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting candidate:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};

//DeleteCandidate
export const deleteCandidate = async (Id: number): Promise<boolean> => {
  try {
    const response = await apiAxios.delete(`/api/candidates/delete/${Id}/`);
    if (response.status === 200) {
      return true; // Success
    }
    throw new Error("Failed to delete Candidate");
  } catch (error: any) {
    console.error("Error deleting Candidatre:", error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to delete Candidate. Please try again."
    );
  }
};

// Get Candidate Names List
export const fetchCandidateNames = async (search?: string) => {
  try {
    const response = await apiAxios.get(`/api/candidates/names/?page_size=${22}`,
      {
        params: { search },
      });
    if (response.status !== 200 || !response.data) {
      throw new Error('Failed to fetch candidate names');
    }
    console.log('Candidate Names List:', response.data); // Optional
    return response.data;
  } catch (error: any) {
    console.error('Error fetching candidate names:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Unable to fetch candidate names.');
  }
};

//ViewCandidateNamw
export const ViewCandidateName = async (
  id: number,
) => {
  try {
    const response = await apiAxios.get(`/api/candidates/${id}/`)
    if (response.status !== 200) {
      throw new Error('Failed to submit candidate data');
    }
    console.log('Candidate updated successfully:', response.data); 3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting candidate:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};

//Search, All, Pagination
export const filterCandidateList = async (page: number, search: string | undefined, filterBy: string, PageSize: string, Status: string) => {
  try {
    const response = await apiAxios.get<ApiResponse>(
      `/api/candidates/?page=${page}&search=${search || ''}&filter_by=${filterBy || ''}&page_size=${PageSize || ''}&status=${Status || ''}`
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

//Remark
export const createRemark = async (candidate_id: number, remark: string) => {
  try {
    const formData = new FormData();
    formData.append('candidate_id', candidate_id.toString());
    formData.append('remark', remark);
    const response = await apiAxios.post(
      '/api/remarks/create/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (!response.data || response.status !== 201) {
      throw new Error('Failed to create remark');
    }
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating remark:', error);
    throw error;
  }
};

//Candidate status
export const Candidatestatus = async (
  Id: string,
  Status: string,
) => {
  try {
    const formData = new FormData();
    formData.append('id', Id);
    formData.append('boolean_value', Status);
    const response = await apiAxios.post('/api/candidates/update-status/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 200) {
      throw new Error('Failed to submit candidate status data');
    }
    console.log('Candidate status updated successfully:', response.data); 3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting candidate status:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};
