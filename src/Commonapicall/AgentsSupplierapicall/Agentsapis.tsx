import { AgentSupplier, ApiResponse } from '../../pages/AgentsSupplier/AgentsSupplierTable';
import { apiAxios } from '../apiUrl';
import { Agent, AgentSearchResponse } from '../../pages/AgentsSupplier/AgentSupplierView';

//fetch Agentslist
export const fetchAgentsList = async (): Promise<ApiResponse> => {
  try {
    const response = await apiAxios.get('/api/agents/');

    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch candidates");
    }

    console.log("Candidates API response", response.data);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error("Error fetching agents:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to fetch agents. Please try again later.");
  }
};

export const fetchAgentsListById = async (id: number): Promise<AgentSupplier> => {
  try {
    const response = await apiAxios.get<ApiResponse>(
      `/api/agents/${id}/`
    );
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch agent");
    }
    console.log("Agent API response", response.data);
    return response.data.data; // ✅ return only the agent data
  } catch (error: any) {
    console.error("Error fetching agent:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to fetch agent. Please try again later.");
  }
};

//Delete Agents
export const deleteAgentData = async (Id: number): Promise<boolean> => {
  try {
    const response = await apiAxios.post("/api/agents/delete/", { id: Id });

    if (response.status === 200) {
      return true; // Success
    }
    throw new Error("Failed to delete agent");
  } catch (error: any) {
    console.error("Error deleting agent:", error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to delete agent. Please try again."
    );
  }
};

export const fetchAgentById = async (id: number): Promise<AgentSupplier> => {
  try {
    const response = await apiAxios.get<{ data: AgentSupplier }>(
      `/api/agents/${id}/`
    );
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch agent');
  }
};

//Edit Agent
export const updateAgent = async (id: number, agentData: Partial<AgentSupplier>): Promise<AgentSupplier> => {
  try {
    const response = await apiAxios.patch<{ data: AgentSupplier }>(`/api/agents/update/${id}/`, agentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to update agent');
  }
};


export const getAgentDetailsById = async (id: number): Promise<AgentSupplier> => {
  const response = await apiAxios.get<{ data: AgentSupplier }>(
    `/api/agents/${id}/`
  );
  console.log(" response.data.data", response.data.data)
  return response.data.data;
};

export const searchAgents = async (query: string): Promise<ApiResponse> => {
  try {
    const response = await apiAxios.get<ApiResponse>(
      `/api/agents/?search=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching agents:", error);
    throw error;
  }
};

export const fetchAgents = async (query: string): Promise<Agent[]> => {
  try {
    const res = await apiAxios.get<AgentSearchResponse>("/api/agents/name-list/", {
      params: { search: query },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching agents", error);
    return [];
  }
};

//pagination, search, All
export const fetchAgentsPageList = async (page: number, search: string | undefined, filterBy: string, PageSize: string, status: string) => {
  try {
    const response = await apiAxios.get(
      `/api/agents/?page=${page}&search=${search}&filter_by=${filterBy}&page_size=${PageSize}&status=${status}`
    );
    if (!response.data || response.status !== 200) {
      throw new Error("Failed to fetch agents list");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error fetching agents list:", error);
  }
};

//Add Agents Remark
export const addAgentRemark = async (agent_supplier_id: number, remark: string) => {
  try {
    const response = await apiAxios.post('/api/agents/remarks/create/', {
      agent_supplier_id,
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

//AgentsSupplier Status
export const Agentsstatus = async (
  Id: string,
  Status: string,
) => {
  try {
    const formData = new FormData();
    formData.append('id', Id);
    formData.append('boolean_value', Status);
    const response = await apiAxios.post('/api/agents/update-status/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status !== 200) {
      throw new Error('Failed to submit Agents/Supplier status data');
    }
    console.log('Agents/Supplier status updated successfully:', response.data); 3
    return response.data;
  } catch (error: any) {
    console.error('Error submitting Agents/Supplier status:', error.response?.message || error.message);
    throw new Error(error.response?.message || 'Submission failed. Please try again.');
  }
};
