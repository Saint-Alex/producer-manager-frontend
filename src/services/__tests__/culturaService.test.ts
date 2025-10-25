import { CreateCulturaData, Cultura, UpdateCulturaData } from '../../types/cultura';
import { apiClient } from '../api';
import { culturaService } from '../culturaService';

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
      cultures: '/api/culturas',
    },
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('CulturaService', () => {
  const mockCultura: Cultura = {
    id: '1',
    nome: 'Soja',
    descricao: 'Cultura de soja',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockCulturas: Cultura[] = [
    mockCultura,
    {
      id: '2',
      nome: 'Milho',
      descricao: 'Cultura de milho',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve buscar todas as culturas', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockCulturas);

      const result = await culturaService.getAll();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/culturas');
      expect(result).toEqual(mockCulturas);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('API Error');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(culturaService.getAll()).rejects.toThrow('API Error');
    });
  });

  describe('getByPropriedade', () => {
    const propriedadeRuralId = 'prop-123';

    it('deve buscar culturas por propriedade rural', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockCulturas);

      const result = await culturaService.getByPropriedade(propriedadeRuralId);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/api/culturas?propriedadeRuralId=${propriedadeRuralId}`
      );
      expect(result).toEqual(mockCulturas);
    });

    it('deve lidar com propriedade rural inexistente', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await culturaService.getByPropriedade('inexistente');

      expect(result).toEqual([]);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('Propriedade não encontrada');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(culturaService.getByPropriedade(propriedadeRuralId)).rejects.toThrow(
        'Propriedade não encontrada'
      );
    });
  });

  describe('getBySafra', () => {
    const safraId = 'safra-123';

    it('deve buscar culturas por safra', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockCulturas);

      const result = await culturaService.getBySafra(safraId);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/api/culturas?safraId=${safraId}`
      );
      expect(result).toEqual(mockCulturas);
    });

    it('deve lidar com safra inexistente', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await culturaService.getBySafra('inexistente');

      expect(result).toEqual([]);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('Safra não encontrada');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(culturaService.getBySafra(safraId)).rejects.toThrow(
        'Safra não encontrada'
      );
    });
  });

  describe('getById', () => {
    const culturaId = '1';

    it('deve buscar cultura por ID', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockCultura);

      const result = await culturaService.getById(culturaId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/culturas/${culturaId}`);
      expect(result).toEqual(mockCultura);
    });

    it('deve propagar erro quando cultura não for encontrada', async () => {
      const error = new Error('Cultura não encontrada');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(culturaService.getById('inexistente')).rejects.toThrow(
        'Cultura não encontrada'
      );
    });

    it('deve lidar com ID vazio', async () => {
      const error = new Error('ID inválido');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(culturaService.getById('')).rejects.toThrow('ID inválido');
    });
  });

  describe('create', () => {
    const createData: CreateCulturaData = {
      nome: 'Nova Cultura',
      descricao: 'Descrição da nova cultura',
    };

    it('deve criar nova cultura', async () => {
      const novaCultura = { ...mockCultura, ...createData };
      mockApiClient.post.mockResolvedValueOnce(novaCultura);

      const result = await culturaService.create(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/culturas', createData);
      expect(result).toEqual(novaCultura);
    });

    it('deve propagar erro de validação', async () => {
      const error = new Error('Dados inválidos');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(culturaService.create(createData)).rejects.toThrow('Dados inválidos');
    });

    it('deve lidar com dados incompletos', async () => {
      const dadosIncompletos = { nome: 'Sem descrição' } as CreateCulturaData;
      const error = new Error('Descrição é obrigatória');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(culturaService.create(dadosIncompletos)).rejects.toThrow(
        'Descrição é obrigatória'
      );
    });
  });

  describe('update', () => {
    const culturaId = '1';
    const updateData: UpdateCulturaData = {
      nome: 'Cultura Atualizada',
      descricao: 'Descrição atualizada',
    };

    it('deve atualizar cultura existente', async () => {
      const culturaAtualizada = { ...mockCultura, ...updateData };
      mockApiClient.patch.mockResolvedValueOnce(culturaAtualizada);

      const result = await culturaService.update(culturaId, updateData);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/api/culturas/${culturaId}`,
        updateData
      );
      expect(result).toEqual(culturaAtualizada);
    });

    it('deve propagar erro quando cultura não for encontrada', async () => {
      const error = new Error('Cultura não encontrada');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(culturaService.update('inexistente', updateData)).rejects.toThrow(
        'Cultura não encontrada'
      );
    });

    it('deve permitir atualização parcial', async () => {
      const updateParcial = { nome: 'Apenas nome atualizado' };
      const culturaAtualizada = { ...mockCultura, nome: updateParcial.nome };
      mockApiClient.patch.mockResolvedValueOnce(culturaAtualizada);

      const result = await culturaService.update(culturaId, updateParcial);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/api/culturas/${culturaId}`,
        updateParcial
      );
      expect(result).toEqual(culturaAtualizada);
    });

    it('deve propagar erro de validação', async () => {
      const error = new Error('Nome já existe');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(culturaService.update(culturaId, updateData)).rejects.toThrow(
        'Nome já existe'
      );
    });
  });

  describe('delete', () => {
    const culturaId = '1';

    it('deve deletar cultura existente', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      await culturaService.delete(culturaId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/api/culturas/${culturaId}`);
    });

    it('deve propagar erro quando cultura não for encontrada', async () => {
      const error = new Error('Cultura não encontrada');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(culturaService.delete('inexistente')).rejects.toThrow(
        'Cultura não encontrada'
      );
    });

    it('deve lidar com ID vazio', async () => {
      const error = new Error('ID inválido');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(culturaService.delete('')).rejects.toThrow('ID inválido');
    });

    it('deve retornar void quando deletar com sucesso', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      const result = await culturaService.delete(culturaId);

      expect(result).toBeUndefined();
    });
  });

  describe('Error handling geral', () => {
    it('deve propagar erros de rede', async () => {
      const networkError = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(networkError);

      await expect(culturaService.getAll()).rejects.toThrow('Network error');
    });

    it('deve propagar erros de timeout', async () => {
      const timeoutError = new Error('Request timeout');
      mockApiClient.post.mockRejectedValueOnce(timeoutError);

      await expect(
        culturaService.create({ nome: 'Test', descricao: 'Test' })
      ).rejects.toThrow('Request timeout');
    });

    it('deve propagar erros de servidor (500)', async () => {
      const serverError = new Error('HTTP error! status: 500');
      mockApiClient.get.mockRejectedValueOnce(serverError);

      await expect(culturaService.getAll()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('Integration scenarios', () => {
    it('deve lidar com resposta vazia corretamente', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await culturaService.getAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('deve preservar tipos de dados', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockCulturas);

      const result = await culturaService.getAll();

      expect(typeof result[0].id).toBe('string');
      expect(typeof result[0].nome).toBe('string');
      expect(typeof result[0].descricao).toBe('string');
      expect(typeof result[0].createdAt).toBe('string');
      expect(typeof result[0].updatedAt).toBe('string');
    });
  });
});
