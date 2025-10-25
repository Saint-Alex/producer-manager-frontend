import { CreateCulturaData, Cultura, UpdateCulturaData } from '../types/cultura';
import { apiClient, apiConfig } from './api';

const API_URL = 'http://localhost:3001/api';

class CulturaService {
  async getAll(): Promise<Cultura[]> {
    return apiClient.get<Cultura[]>(apiConfig.endpoints.cultures);
  }

  async getByPropriedade(propriedadeRuralId: string): Promise<Cultura[]> {
    return apiClient.get<Cultura[]>(
      `${apiConfig.endpoints.cultures}?propriedadeRuralId=${propriedadeRuralId}`
    );
  }

  async getBySafra(safraId: string): Promise<Cultura[]> {
    return apiClient.get<Cultura[]>(`${apiConfig.endpoints.cultures}?safraId=${safraId}`);
  }

  async getById(id: string): Promise<Cultura> {
    return apiClient.get<Cultura>(`${apiConfig.endpoints.cultures}/${id}`);
  }

  async create(data: CreateCulturaData): Promise<Cultura> {
    return apiClient.post<Cultura>(apiConfig.endpoints.cultures, data);
  }

  async update(id: string, data: UpdateCulturaData): Promise<Cultura> {
    return apiClient.patch<Cultura>(`${apiConfig.endpoints.cultures}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${apiConfig.endpoints.cultures}/${id}`);
  }
}

export const culturaService = new CulturaService();
