import {
    CreatePropriedadeData,
    PropriedadeRural,
    PropriedadeRuralFormData,
    UpdatePropriedadeData,
} from '../types/propriedadeRural';
import { apiClient, apiConfig } from './api';

const API_URL = 'http://localhost:3001/api';

class PropriedadeRuralService {
  async getAll(): Promise<PropriedadeRural[]> {
    return apiClient.get<PropriedadeRural[]>(apiConfig.endpoints.properties);
  }

  async getByProdutor(produtorId: string): Promise<PropriedadeRural[]> {
    return apiClient.get<PropriedadeRural[]>(
      `${apiConfig.endpoints.properties}?produtorId=${produtorId}`
    );
  }

  async getById(id: string): Promise<PropriedadeRural> {
    return apiClient.get<PropriedadeRural>(`${apiConfig.endpoints.properties}/${id}`);
  }

  async create(data: CreatePropriedadeData): Promise<PropriedadeRural> {
    return apiClient.post<PropriedadeRural>(apiConfig.endpoints.properties, data);
  }

  async update(id: string, data: UpdatePropriedadeData): Promise<PropriedadeRural> {
    return apiClient.patch<PropriedadeRural>(`${apiConfig.endpoints.properties}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${apiConfig.endpoints.properties}/${id}`);
  }

  // Método auxiliar para converter FormData em CreateData
  convertFormToCreateData(
    formData: PropriedadeRuralFormData,
    produtorIds: string[]
  ): CreatePropriedadeData {
    return {
      nomeFazenda: formData.nomeFazenda,
      cidade: formData.cidade,
      estado: formData.estado,
      areaTotal: Number(formData.areaTotal),
      areaAgricultavel: Number(formData.areaAgricultavel),
      areaVegetacao: Number(formData.areaVegetacao),
      produtorIds,
    };
  }
}

export const propriedadeRuralService = new PropriedadeRuralService();
