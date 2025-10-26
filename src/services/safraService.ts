import { CreateSafraData, Safra, UpdateSafraData } from '../types/safra';
import { apiClient, apiConfig } from './api';

export const safraService = {
  async getAll(): Promise<Safra[]> {
    return apiClient.get<Safra[]>(apiConfig.endpoints.harvests);
  },

  async getById(id: string): Promise<Safra> {
    return apiClient.get<Safra>(`${apiConfig.endpoints.harvests}/${id}`);
  },

  async getByYear(year: number): Promise<Safra[]> {
    return apiClient.get<Safra[]>(`${apiConfig.endpoints.harvests}/year/${year}`);
  },

  async getByPropriedade(propriedadeId: string): Promise<Safra[]> {
    // Novo modelo: 1:N - uma propriedade pode ter múltiplas safras
    try {
      return apiClient.get<Safra[]>(`${apiConfig.endpoints.harvests}/propriedade/${propriedadeId}`);
    } catch (error: unknown) {
      // Se retornar 404, significa que a propriedade não tem safras
      if ((error as { status?: number })?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  async create(data: CreateSafraData): Promise<Safra> {
    return apiClient.post<Safra>(apiConfig.endpoints.harvests, data);
  },

  async update(id: string, data: UpdateSafraData): Promise<Safra> {
    return apiClient.patch<Safra>(`${apiConfig.endpoints.harvests}/${id}`, data);
  },

  delete: async (id: string): Promise<unknown> => {
    return apiClient.delete<void>(`${apiConfig.endpoints.harvests}/${id}`);
  },
};
