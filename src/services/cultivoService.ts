import { CreateCultivoData, Cultivo, UpdateCultivoData } from '../types/cultivo';
import { apiClient, apiConfig } from './api';

class CultivoService {
  async getAll(): Promise<Cultivo[]> {
    return apiClient.get<Cultivo[]>(apiConfig.endpoints.cultivations);
  }

  async getBySafra(safraId: string): Promise<Cultivo[]> {
    return apiClient.get<Cultivo[]>(`${apiConfig.endpoints.cultivations}/safra/${safraId}`);
  }

  async getByPropriedade(propriedadeId: string): Promise<Cultivo[]> {
    return apiClient.get<Cultivo[]>(
      `${apiConfig.endpoints.cultivations}/propriedade/${propriedadeId}`
    );
  }

  async getById(id: string): Promise<Cultivo> {
    return apiClient.get<Cultivo>(`${apiConfig.endpoints.cultivations}/${id}`);
  }

  async create(data: CreateCultivoData): Promise<Cultivo> {
    return apiClient.post<Cultivo>(apiConfig.endpoints.cultivations, data);
  }

  async update(id: string, data: UpdateCultivoData): Promise<Cultivo> {
    return apiClient.patch<Cultivo>(`${apiConfig.endpoints.cultivations}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${apiConfig.endpoints.cultivations}/${id}`);
  }
}

export const cultivoService = new CultivoService();
