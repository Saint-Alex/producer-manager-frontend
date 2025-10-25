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

describe('SafraService', () => {
  const mockSafra: Safra = {
    id: '1',
    ano: 2023,
    nome: 'Safra 2023',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockSafras: Safra[] = [
    mockSafra,
    {
      id: '2',
      ano: 2024,
      nome: 'Safra 2024',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve buscar todas as safras', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockSafras);

      const result = await safraService.getAll();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/safras');
      expect(result).toEqual(mockSafras);
    });

    it('deve retornar array vazio quando não houver safras', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await safraService.getAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('API Error');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(safraService.getAll()).rejects.toThrow('API Error');
    });
  });

  describe('getById', () => {
    const safraId = '1';

    it('deve buscar safra por ID', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockSafra);

      const result = await safraService.getById(safraId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/safras/${safraId}`);
      expect(result).toEqual(mockSafra);
    });

    it('deve propagar erro quando safra não for encontrada', async () => {
      const error = new Error('Safra não encontrada');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(safraService.getById('inexistente')).rejects.toThrow(
        'Safra não encontrada'
      );
    });

    it('deve lidar com ID vazio', async () => {
      const error = new Error('ID inválido');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(safraService.getById('')).rejects.toThrow('ID inválido');
    });
  });

  describe('getByYear', () => {
    const year = 2023;

    it('deve buscar safras por ano', async () => {
      mockApiClient.get.mockResolvedValueOnce([mockSafra]);

      const result = await safraService.getByYear(year);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/safras/year/${year}`);
      expect(result).toEqual([mockSafra]);
    });

    it('deve retornar array vazio para ano sem safras', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await safraService.getByYear(2025);

      expect(result).toEqual([]);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('Ano inválido');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(safraService.getByYear(year)).rejects.toThrow('Ano inválido');
    });

    it('deve lidar com anos negativos', async () => {
      const error = new Error('Ano deve ser positivo');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(safraService.getByYear(-1)).rejects.toThrow('Ano deve ser positivo');
    });

    it('deve lidar com anos futuros', async () => {
      const futureYear = new Date().getFullYear() + 10;
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await safraService.getByYear(futureYear);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/safras/year/${futureYear}`);
      expect(result).toEqual([]);
    });
  });

  describe('getByPropriedade', () => {
    const propriedadeId = 'prop-123';

    it('deve buscar safras por propriedade', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockSafras);

      const result = await safraService.getByPropriedade(propriedadeId);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/api/safras?propriedadeId=${propriedadeId}`
      );
      expect(result).toEqual(mockSafras);
    });

    it('deve lidar com propriedade inexistente', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await safraService.getByPropriedade('inexistente');

      expect(result).toEqual([]);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('Propriedade não encontrada');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(safraService.getByPropriedade(propriedadeId)).rejects.toThrow(
        'Propriedade não encontrada'
      );
    });
  });

  describe('create', () => {
    const createData: CreateSafraData = {
      ano: 2023,
      nome: 'Nova Safra 2023',
    };

    it('deve criar nova safra', async () => {
      const novaSafra = { ...mockSafra, ...createData };
      mockApiClient.post.mockResolvedValueOnce(novaSafra);

      const result = await safraService.create(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/safras', createData);
      expect(result).toEqual(novaSafra);
    });

    it('deve propagar erro de validação', async () => {
      const error = new Error('Dados inválidos');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(safraService.create(createData)).rejects.toThrow('Dados inválidos');
    });

    it('deve lidar com dados incompletos', async () => {
      const dadosIncompletos = { ano: 2023 } as CreateSafraData;
      const error = new Error('Nome é obrigatório');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(safraService.create(dadosIncompletos)).rejects.toThrow(
        'Nome é obrigatório'
      );
    });

    it('deve validar ano duplicado', async () => {
      const error = new Error('Safra para este ano já existe');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(safraService.create(createData)).rejects.toThrow(
        'Safra para este ano já existe'
      );
    });

    it('deve validar ano inválido', async () => {
      const dadosInvalidos = { ...createData, ano: 1800 };
      const error = new Error('Ano deve ser maior que 1900');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(safraService.create(dadosInvalidos)).rejects.toThrow(
        'Ano deve ser maior que 1900'
      );
    });
  });

  describe('update', () => {
    const safraId = '1';
    const updateData: UpdateSafraData = {
      nome: 'Safra Atualizada',
      ano: 2024,
    };

    it('deve atualizar safra existente', async () => {
      const safraAtualizada = { ...mockSafra, ...updateData };
      mockApiClient.patch.mockResolvedValueOnce(safraAtualizada);

      const result = await safraService.update(safraId, updateData);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/api/safras/${safraId}`,
        updateData
      );
      expect(result).toEqual(safraAtualizada);
    });

    it('deve propagar erro quando safra não for encontrada', async () => {
      const error = new Error('Safra não encontrada');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(safraService.update('inexistente', updateData)).rejects.toThrow(
        'Safra não encontrada'
      );
    });

    it('deve permitir atualização parcial', async () => {
      const updateParcial = { nome: 'Apenas nome atualizado' };
      const safraAtualizada = { ...mockSafra, nome: updateParcial.nome };
      mockApiClient.patch.mockResolvedValueOnce(safraAtualizada);

      const result = await safraService.update(safraId, updateParcial);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/api/safras/${safraId}`,
        updateParcial
      );
      expect(result).toEqual(safraAtualizada);
    });

    it('deve propagar erro de validação', async () => {
      const error = new Error('Nome já existe para este ano');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(safraService.update(safraId, updateData)).rejects.toThrow(
        'Nome já existe para este ano'
      );
    });
  });

  describe('delete', () => {
    const safraId = '1';

    it('deve deletar safra existente', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      await safraService.delete(safraId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/api/safras/${safraId}`);
    });

    it('deve propagar erro quando safra não for encontrada', async () => {
      const error = new Error('Safra não encontrada');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(safraService.delete('inexistente')).rejects.toThrow(
        'Safra não encontrada'
      );
    });

    it('deve lidar com ID vazio', async () => {
      const error = new Error('ID inválido');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(safraService.delete('')).rejects.toThrow('ID inválido');
    });

    it('deve retornar void quando deletar com sucesso', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      const result = await safraService.delete(safraId);

      expect(result).toBeUndefined();
    });

    it('deve propagar erro de relacionamento', async () => {
      const error = new Error('Não é possível deletar safra com cultivos');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(safraService.delete(safraId)).rejects.toThrow(
        'Não é possível deletar safra com cultivos'
      );
    });
  });

  describe('Error handling geral', () => {
    it('deve propagar erros de rede', async () => {
      const networkError = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(networkError);

      await expect(safraService.getAll()).rejects.toThrow('Network error');
    });

    it('deve propagar erros de timeout', async () => {
      const timeoutError = new Error('Request timeout');
      mockApiClient.post.mockRejectedValueOnce(timeoutError);

      await expect(
        safraService.create({
          ano: 2023,
          nome: 'Test Safra',
        })
      ).rejects.toThrow('Request timeout');
    });

    it('deve propagar erros de servidor (500)', async () => {
      const serverError = new Error('HTTP error! status: 500');
      mockApiClient.get.mockRejectedValueOnce(serverError);

      await expect(safraService.getAll()).rejects.toThrow('HTTP error! status: 500');
    });

    it('deve propagar erros de autenticação (401)', async () => {
      const authError = new Error('HTTP error! status: 401');
      mockApiClient.get.mockRejectedValueOnce(authError);

      await expect(safraService.getAll()).rejects.toThrow('HTTP error! status: 401');
    });
  });

  describe('Data integrity', () => {
    it('deve preservar tipos de dados', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockSafras);

      const result = await safraService.getAll();

      expect(typeof result[0].id).toBe('string');
      expect(typeof result[0].ano).toBe('number');
      expect(typeof result[0].nome).toBe('string');
      expect(typeof result[0].createdAt).toBe('string');
      expect(typeof result[0].updatedAt).toBe('string');
    });

    it('deve manter estrutura do objeto Safra', async () => {
      mockApiClient.get.mockResolvedValueOnce([mockSafra]);

      const result = await safraService.getAll();
      const safra = result[0];

      expect(safra).toHaveProperty('id');
      expect(safra).toHaveProperty('ano');
      expect(safra).toHaveProperty('nome');
      expect(safra).toHaveProperty('createdAt');
      expect(safra).toHaveProperty('updatedAt');
    });

    it('deve validar formato de datas', async () => {
      mockApiClient.get.mockResolvedValueOnce([mockSafra]);

      const result = await safraService.getAll();
      const safra = result[0];

      // Verificar se é uma string de data ISO válida
      expect(new Date(safra.createdAt)).toBeInstanceOf(Date);
      expect(new Date(safra.updatedAt)).toBeInstanceOf(Date);
      expect(safra.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(safra.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('deve validar range de anos', async () => {
      const safraComAnoValido = { ...mockSafra, ano: 2023 };
      mockApiClient.get.mockResolvedValueOnce([safraComAnoValido]);

      const result = await safraService.getAll();

      expect(result[0].ano).toBeGreaterThan(1900);
      expect(result[0].ano).toBeLessThanOrEqual(new Date().getFullYear() + 10);
    });
  });

  describe('Business logic scenarios', () => {
    it('deve buscar safras por ano corrente', async () => {
      const currentYear = new Date().getFullYear();
      const safrasAnoCorrente = [{ ...mockSafra, ano: currentYear }];
      mockApiClient.get.mockResolvedValueOnce(safrasAnoCorrente);

      const result = await safraService.getByYear(currentYear);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/safras/year/${currentYear}`);
      expect(result[0].ano).toBe(currentYear);
    });

    it('deve lidar com múltiplas safras do mesmo ano', async () => {
      const safrasDoMesmoAno = [
        { ...mockSafra, id: '1', nome: 'Safra Verão 2023' },
        { ...mockSafra, id: '2', nome: 'Safra Inverno 2023' },
      ];
      mockApiClient.get.mockResolvedValueOnce(safrasDoMesmoAno);

      const result = await safraService.getByYear(2023);

      expect(result).toHaveLength(2);
      expect(result.every(s => s.ano === 2023)).toBe(true);
    });

    it('deve preservar ordenação retornada pelo backend', async () => {
      const safrasOrdenadas = [
        { ...mockSafra, id: '1', ano: 2021 },
        { ...mockSafra, id: '2', ano: 2022 },
        { ...mockSafra, id: '3', ano: 2023 },
      ];
      mockApiClient.get.mockResolvedValueOnce(safrasOrdenadas);

      const result = await safraService.getAll();

      expect(result.map(s => s.ano)).toEqual([2021, 2022, 2023]);
    });
  });
});
