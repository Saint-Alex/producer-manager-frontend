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
    // Para compatibilidade - buscar safras por propriedade via query params
    return apiClient.get<Safra[]>(`${apiConfig.endpoints.harvests}?propriedadeId=${propriedadeId}`);
  },

  async create(data: CreateSafraData): Promise<Safra> {
    return apiClient.post<Safra>(apiConfig.endpoints.harvests, data);
  },

  async update(id: string, data: UpdateSafraData): Promise<Safra> {
    return apiClient.patch<Safra>(`${apiConfig.endpoints.harvests}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${apiConfig.endpoints.harvests}/${id}`);
  },
};
