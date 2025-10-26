import { CreateSafraData, Safra, UpdateSafraData } from '../../types/safra';
import { apiClient } from '../api';
import { safraService } from '../safraService';

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
      harvests: '/api/safras',
    },
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('safraService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSafra: Safra = {
    id: '1',
    nome: 'Safra 2024',
    ano: 2024,
    cultivos: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockCreateData: CreateSafraData = {
    nome: 'Safra 2024',
    ano: 2024,
    propriedadeRuralId: 'prop1',
  };

  const mockUpdateData: UpdateSafraData = {
    nome: 'Safra 2025',
    ano: 2025,
  };

  describe('getAll', () => {
    it('should get all safras', async () => {
      const mockSafras = [mockSafra];
      mockApiClient.get.mockResolvedValueOnce(mockSafras);

      const result = await safraService.getAll();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/safras');
      expect(result).toEqual(mockSafras);
    });

    it('should handle errors when getting all safras', async () => {
      const error = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(safraService.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('should get safra by id', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockSafra);

      const result = await safraService.getById('1');

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/safras/1');
      expect(result).toEqual(mockSafra);
    });

    it('should handle errors when getting safra by id', async () => {
      const error = new Error('Safra not found');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(safraService.getById('1')).rejects.toThrow('Safra not found');
    });
  });

  describe('getByYear', () => {
    it('should get safras by year', async () => {
      const mockSafras = [mockSafra];
      mockApiClient.get.mockResolvedValueOnce(mockSafras);

      const result = await safraService.getByYear(2024);

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/safras/year/2024');
      expect(result).toEqual(mockSafras);
    });

    it('should handle errors when getting safras by year', async () => {
      const error = new Error('Invalid year');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(safraService.getByYear(2024)).rejects.toThrow('Invalid year');
    });
  });

  describe('getByPropriedade', () => {
    it('should get safras by propriedade', async () => {
      const mockSafras = [mockSafra];
      mockApiClient.get.mockResolvedValueOnce(mockSafras);

      const result = await safraService.getByPropriedade('prop1');

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/safras/propriedade/prop1');
      expect(result).toEqual(mockSafras);
    });

    it('should return empty array when propriedade has no safras (404)', async () => {
      // O mock precisa simular que apiClient.get retorna uma rejeição
      // mas o service tem um try-catch que captura o erro 404
      mockApiClient.get.mockImplementationOnce(() => {
        const error = { status: 404 };
        throw error;
      });

      const result = await safraService.getByPropriedade('nonexistent');

      expect(result).toEqual([]);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/safras/propriedade/nonexistent');
    });

    it('should throw error for other status codes', async () => {
      const error = { status: 500, message: 'Server error' };
      mockApiClient.get.mockImplementationOnce(() => {
        throw error;
      });

      await expect(safraService.getByPropriedade('prop1')).rejects.toEqual(error);
    });

    it('should throw error when no status property', async () => {
      const error = new Error('Network error');
      mockApiClient.get.mockImplementationOnce(() => {
        throw error;
      });

      await expect(safraService.getByPropriedade('prop1')).rejects.toThrow('Network error');
    });
  });

  describe('create', () => {
    it('should create a new safra', async () => {
      mockApiClient.post.mockResolvedValueOnce(mockSafra);

      const result = await safraService.create(mockCreateData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/safras', mockCreateData);
      expect(result).toEqual(mockSafra);
    });

    it('should handle errors when creating safra', async () => {
      const error = new Error('Validation error');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(safraService.create(mockCreateData)).rejects.toThrow('Validation error');
    });
  });

  describe('update', () => {
    it('should update a safra', async () => {
      const updatedSafra = { ...mockSafra, ...mockUpdateData };
      mockApiClient.patch.mockResolvedValueOnce(updatedSafra);

      const result = await safraService.update('1', mockUpdateData);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/api/safras/1', mockUpdateData);
      expect(result).toEqual(updatedSafra);
    });

    it('should handle errors when updating safra', async () => {
      const error = new Error('Safra not found');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(safraService.update('1', mockUpdateData)).rejects.toThrow('Safra not found');
    });
  });

  describe('delete', () => {
    it('should delete a safra', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      const result = await safraService.delete('1');

      expect(mockApiClient.delete).toHaveBeenCalledWith('/api/safras/1');
      expect(result).toBeUndefined();
    });

    it('should handle errors when deleting safra', async () => {
      const error = new Error('Cannot delete safra');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(safraService.delete('1')).rejects.toThrow('Cannot delete safra');
    });
  });
});
