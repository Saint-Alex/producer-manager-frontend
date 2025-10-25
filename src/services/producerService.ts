import { CreateProducerData, Producer, UpdateProducerData } from '../types/producer';
import { apiClient, apiConfig } from './api';

export interface ProducerResponse {
  producers: Producer[];
  total: number;
  page: number;
  limit: number;
}

export const producerService = {
  async getAll(): Promise<Producer[]> {
    return apiClient.get<Producer[]>(apiConfig.endpoints.producers);
  },

  async getById(id: string): Promise<Producer> {
    return apiClient.get<Producer>(`${apiConfig.endpoints.producers}/${id}`);
  },

  async create(data: CreateProducerData): Promise<Producer> {
    return apiClient.post<Producer>(apiConfig.endpoints.producers, data);
  },

  async update(id: string, data: UpdateProducerData): Promise<Producer> {
    return apiClient.patch<Producer>(`${apiConfig.endpoints.producers}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`${apiConfig.endpoints.producers}/${id}`);
  },

  async search(
    params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {}
  ): Promise<Producer[]> {
    // Para o backend NestJS, usar query params padrão
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    const endpoint = query
      ? `${apiConfig.endpoints.producers}?${query}`
      : apiConfig.endpoints.producers;

    return apiClient.get<Producer[]>(endpoint);
  },
};
