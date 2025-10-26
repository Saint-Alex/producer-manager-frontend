import { CreateProducerData, Producer, UpdateProducerData } from '../../types/producer';
import { apiClient } from '../api';
import { producerService } from '../producerService';

// Mock do apiClient
jest.mock('../api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
  apiConfig: {
    endpoints: {
      producers: '/api/produtores',
    },
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('producerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProducer: Producer = {
    id: '1',
    cpfCnpj: '12345678901',
    nome: 'João Silva',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockCreateData: CreateProducerData = {
    cpfCnpj: '12345678901',
    nome: 'João Silva',
  };

  const mockUpdateData: UpdateProducerData = {
    nome: 'João Silva Updated',
  };

  describe('getAll', () => {
    it('should get all producers', async () => {
      const mockProducers = [mockProducer];
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const result = await producerService.getAll();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores');
      expect(result).toEqual(mockProducers);
    });

    it('should handle errors when getting all producers', async () => {
      const error = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(producerService.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('should get producer by id', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducer);

      const result = await producerService.getById('1');

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores/1');
      expect(result).toEqual(mockProducer);
    });

    it('should handle errors when getting producer by id', async () => {
      const error = new Error('Producer not found');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(producerService.getById('1')).rejects.toThrow('Producer not found');
    });
  });

  describe('create', () => {
    it('should create a new producer', async () => {
      mockApiClient.post.mockResolvedValueOnce(mockProducer);

      const result = await producerService.create(mockCreateData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/produtores', mockCreateData);
      expect(result).toEqual(mockProducer);
    });

    it('should handle errors when creating producer', async () => {
      const error = new Error('Validation error');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(producerService.create(mockCreateData)).rejects.toThrow('Validation error');
    });
  });

  describe('update', () => {
    it('should update a producer', async () => {
      const updatedProducer = { ...mockProducer, ...mockUpdateData };
      mockApiClient.patch.mockResolvedValueOnce(updatedProducer);

      const result = await producerService.update('1', mockUpdateData);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/api/produtores/1', mockUpdateData);
      expect(result).toEqual(updatedProducer);
    });

    it('should handle errors when updating producer', async () => {
      const error = new Error('Producer not found');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(producerService.update('1', mockUpdateData)).rejects.toThrow(
        'Producer not found'
      );
    });
  });

  describe('delete', () => {
    it('should delete a producer', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      await producerService.delete('1');

      expect(mockApiClient.delete).toHaveBeenCalledWith('/api/produtores/1');
    });

    it('should handle errors when deleting producer', async () => {
      const error = new Error('Cannot delete producer');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(producerService.delete('1')).rejects.toThrow('Cannot delete producer');
    });
  });

  describe('search', () => {
    it('should search producers without parameters', async () => {
      const mockProducers = [mockProducer];
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const result = await producerService.search();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores');
      expect(result).toEqual(mockProducers);
    });

    it('should search producers with all parameters', async () => {
      const mockProducers = [mockProducer];
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const params = {
        page: 1,
        limit: 10,
        search: 'João',
      };

      const result = await producerService.search(params);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/produtores?page=1&limit=10&search=Jo%C3%A3o'
      );
      expect(result).toEqual(mockProducers);
    });

    it('should search producers with partial parameters', async () => {
      const mockProducers = [mockProducer];
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const params = {
        search: 'Silva',
      };

      const result = await producerService.search(params);

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores?search=Silva');
      expect(result).toEqual(mockProducers);
    });

    it('should search producers with page and limit only', async () => {
      const mockProducers = [mockProducer];
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const params = {
        page: 2,
        limit: 5,
      };

      const result = await producerService.search(params);

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores?page=2&limit=5');
      expect(result).toEqual(mockProducers);
    });

    it('should handle errors when searching producers', async () => {
      const error = new Error('Search failed');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(producerService.search({ search: 'test' })).rejects.toThrow('Search failed');
    });
  });
});
