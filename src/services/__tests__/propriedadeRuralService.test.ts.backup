import {
  CreatePropriedadeData,
  PropriedadeRural,
  PropriedadeRuralFormData,
  UpdatePropriedadeData,
} from '../../types/propriedadeRural';
import { apiClient } from '../api';
import { propriedadeRuralService } from '../propriedadeRuralService';

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
      properties: '/api/propriedades',
    },
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('PropriedadeRuralService', () => {
  const mockPropriedade: PropriedadeRural = {
    id: '1',
    nomeFazenda: 'Fazenda Silva',
    cidade: 'São Paulo',
    estado: 'SP',
    areaTotal: 1000,
    areaAgricultavel: 800,
    areaVegetacao: 200,
    produtores: [],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockPropriedades: PropriedadeRural[] = [
    mockPropriedade,
    {
      id: '2',
      nomeFazenda: 'Fazenda Santos',
      cidade: 'Campinas',
      estado: 'SP',
      areaTotal: 1500,
      areaAgricultavel: 1200,
      areaVegetacao: 300,
      produtores: [],
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve buscar todas as propriedades rurais', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPropriedades);

      const result = await propriedadeRuralService.getAll();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/propriedades');
      expect(result).toEqual(mockPropriedades);
    });

    it('deve retornar array vazio quando não houver propriedades', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await propriedadeRuralService.getAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('API Error');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.getAll()).rejects.toThrow('API Error');
    });
  });

  describe('getByProdutor', () => {
    const produtorId = 'prod-123';

    it('deve buscar propriedades por produtor', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPropriedades);

      const result = await propriedadeRuralService.getByProdutor(produtorId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/propriedades?produtorId=${produtorId}`);
      expect(result).toEqual(mockPropriedades);
    });

    it('deve lidar com produtor inexistente', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await propriedadeRuralService.getByProdutor('inexistente');

      expect(result).toEqual([]);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('Produtor não encontrado');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.getByProdutor(produtorId)).rejects.toThrow(
        'Produtor não encontrado'
      );
    });
  });

  describe('getById', () => {
    const propriedadeId = '1';

    it('deve buscar propriedade por ID', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPropriedade);

      const result = await propriedadeRuralService.getById(propriedadeId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/propriedades/${propriedadeId}`);
      expect(result).toEqual(mockPropriedade);
    });

    it('deve propagar erro quando propriedade não for encontrada', async () => {
      const error = new Error('Propriedade não encontrada');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.getById('inexistente')).rejects.toThrow(
        'Propriedade não encontrada'
      );
    });

    it('deve lidar com ID vazio', async () => {
      const error = new Error('ID inválido');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.getById('')).rejects.toThrow('ID inválido');
    });
  });

  describe('create', () => {
    const createData: CreatePropriedadeData = {
      nomeFazenda: 'Nova Fazenda',
      cidade: 'Ribeirão Preto',
      estado: 'SP',
      areaTotal: 2000,
      areaAgricultavel: 1600,
      areaVegetacao: 400,
      produtorIds: ['prod-1', 'prod-2'],
    };

    it('deve criar nova propriedade rural', async () => {
      const novaPropriedade = { ...mockPropriedade, ...createData };
      mockApiClient.post.mockResolvedValueOnce(novaPropriedade);

      const result = await propriedadeRuralService.create(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/propriedades', createData);
      expect(result).toEqual(novaPropriedade);
    });

    it('deve propagar erro de validação', async () => {
      const error = new Error('Dados inválidos');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.create(createData)).rejects.toThrow('Dados inválidos');
    });

    it('deve validar soma das áreas', async () => {
      const dadosInvalidos = {
        ...createData,
        areaTotal: 100,
        areaAgricultavel: 80,
        areaVegetacao: 30, // Soma = 110 > 100
      };
      const error = new Error('Soma das áreas não pode ser maior que a área total');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.create(dadosInvalidos)).rejects.toThrow(
        'Soma das áreas não pode ser maior que a área total'
      );
    });

    it('deve lidar com dados incompletos', async () => {
      const dadosIncompletos = { nomeFazenda: 'Sem cidade' } as CreatePropriedadeData;
      const error = new Error('Cidade é obrigatória');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.create(dadosIncompletos)).rejects.toThrow(
        'Cidade é obrigatória'
      );
    });
  });

  describe('update', () => {
    const propriedadeId = '1';
    const updateData: UpdatePropriedadeData = {
      nomeFazenda: 'Fazenda Atualizada',
      cidade: 'São Carlos',
      areaTotal: 1200,
    };

    it('deve atualizar propriedade existente', async () => {
      const propriedadeAtualizada = { ...mockPropriedade, ...updateData };
      mockApiClient.patch.mockResolvedValueOnce(propriedadeAtualizada);

      const result = await propriedadeRuralService.update(propriedadeId, updateData);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/api/propriedades/${propriedadeId}`,
        updateData
      );
      expect(result).toEqual(propriedadeAtualizada);
    });

    it('deve propagar erro quando propriedade não for encontrada', async () => {
      const error = new Error('Propriedade não encontrada');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.update('inexistente', updateData)).rejects.toThrow(
        'Propriedade não encontrada'
      );
    });

    it('deve permitir atualização parcial', async () => {
      const updateParcial = { nomeFazenda: 'Apenas nome atualizado' };
      const propriedadeAtualizada = { ...mockPropriedade, nomeFazenda: updateParcial.nomeFazenda };
      mockApiClient.patch.mockResolvedValueOnce(propriedadeAtualizada);

      const result = await propriedadeRuralService.update(propriedadeId, updateParcial);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/api/propriedades/${propriedadeId}`,
        updateParcial
      );
      expect(result).toEqual(propriedadeAtualizada);
    });

    it('deve propagar erro de validação', async () => {
      const error = new Error('Nome da fazenda já existe');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.update(propriedadeId, updateData)).rejects.toThrow(
        'Nome da fazenda já existe'
      );
    });
  });

  describe('delete', () => {
    const propriedadeId = '1';

    it('deve deletar propriedade existente', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      await propriedadeRuralService.delete(propriedadeId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/api/propriedades/${propriedadeId}`);
    });

    it('deve propagar erro quando propriedade não for encontrada', async () => {
      const error = new Error('Propriedade não encontrada');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.delete('inexistente')).rejects.toThrow(
        'Propriedade não encontrada'
      );
    });

    it('deve lidar com ID vazio', async () => {
      const error = new Error('ID inválido');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(propriedadeRuralService.delete('')).rejects.toThrow('ID inválido');
    });

    it('deve retornar void quando deletar com sucesso', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      const result = await propriedadeRuralService.delete(propriedadeId);

      expect(result).toBeUndefined();
    });
  });

  describe('convertFormToCreateData', () => {
    const formData: PropriedadeRuralFormData = {
      nomeFazenda: 'Fazenda Teste',
      cidade: 'São Paulo',
      estado: 'SP',
      areaTotal: '1000',
      areaAgricultavel: '800',
      areaVegetacao: '200',
    };

    const produtorIds = ['prod-1', 'prod-2'];

    it('deve converter FormData para CreateData corretamente', () => {
      const result = propriedadeRuralService.convertFormToCreateData(formData, produtorIds);

      expect(result).toEqual({
        nomeFazenda: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotal: 1000,
        areaAgricultavel: 800,
        areaVegetacao: 200,
        produtorIds: ['prod-1', 'prod-2'],
      });
    });

    it('deve converter strings para números corretamente', () => {
      const result = propriedadeRuralService.convertFormToCreateData(formData, produtorIds);

      expect(typeof result.areaTotal).toBe('number');
      expect(typeof result.areaAgricultavel).toBe('number');
      expect(typeof result.areaVegetacao).toBe('number');
    });

    it('deve lidar com strings numéricas decimais', () => {
      const formDataDecimal = {
        ...formData,
        areaTotal: '1000.5',
        areaAgricultavel: '800.25',
        areaVegetacao: '200.75',
      };

      const result = propriedadeRuralService.convertFormToCreateData(formDataDecimal, produtorIds);

      expect(result.areaTotal).toBe(1000.5);
      expect(result.areaAgricultavel).toBe(800.25);
      expect(result.areaVegetacao).toBe(200.75);
    });

    it('deve lidar com array vazio de produtorIds', () => {
      const result = propriedadeRuralService.convertFormToCreateData(formData, []);

      expect(result.produtorIds).toEqual([]);
      expect(Array.isArray(result.produtorIds)).toBe(true);
    });

    it('deve preservar strings não numéricas', () => {
      const result = propriedadeRuralService.convertFormToCreateData(formData, produtorIds);

      expect(typeof result.nomeFazenda).toBe('string');
      expect(typeof result.cidade).toBe('string');
      expect(typeof result.estado).toBe('string');
    });

    it('deve lidar com strings vazias para números', () => {
      const formDataVazia = {
        ...formData,
        areaTotal: '',
        areaAgricultavel: '0',
        areaVegetacao: '',
      };

      const result = propriedadeRuralService.convertFormToCreateData(formDataVazia, produtorIds);

      expect(result.areaTotal).toBe(0); // Number('') = 0
      expect(result.areaAgricultavel).toBe(0);
      expect(result.areaVegetacao).toBe(0); // Number('') = 0
    });

    it('deve manter referência aos produtorIds', () => {
      const result = propriedadeRuralService.convertFormToCreateData(formData, produtorIds);

      expect(result.produtorIds).toBe(produtorIds);
      expect(result.produtorIds.length).toBe(2);
    });
  });

  describe('Error handling geral', () => {
    it('deve propagar erros de rede', async () => {
      const networkError = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(networkError);

      await expect(propriedadeRuralService.getAll()).rejects.toThrow('Network error');
    });

    it('deve propagar erros de timeout', async () => {
      const timeoutError = new Error('Request timeout');
      mockApiClient.post.mockRejectedValueOnce(timeoutError);

      await expect(
        propriedadeRuralService.create({
          nomeFazenda: 'Test',
          cidade: 'Test',
          estado: 'SP',
          areaTotal: 100,
          areaAgricultavel: 80,
          areaVegetacao: 20,
          produtorIds: [],
        })
      ).rejects.toThrow('Request timeout');
    });

    it('deve propagar erros de servidor (500)', async () => {
      const serverError = new Error('HTTP error! status: 500');
      mockApiClient.get.mockRejectedValueOnce(serverError);

      await expect(propriedadeRuralService.getAll()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('Data integrity', () => {
    it('deve preservar tipos de dados', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockPropriedades);

      const result = await propriedadeRuralService.getAll();

      expect(typeof result[0].id).toBe('string');
      expect(typeof result[0].nomeFazenda).toBe('string');
      expect(typeof result[0].cidade).toBe('string');
      expect(typeof result[0].estado).toBe('string');
      expect(typeof result[0].areaTotal).toBe('number');
      expect(typeof result[0].areaAgricultavel).toBe('number');
      expect(typeof result[0].areaVegetacao).toBe('number');
      expect(Array.isArray(result[0].produtores)).toBe(true);
    });

    it('deve manter estrutura do objeto PropriedadeRural', async () => {
      mockApiClient.get.mockResolvedValueOnce([mockPropriedade]);

      const result = await propriedadeRuralService.getAll();
      const propriedade = result[0];

      expect(propriedade).toHaveProperty('id');
      expect(propriedade).toHaveProperty('nomeFazenda');
      expect(propriedade).toHaveProperty('cidade');
      expect(propriedade).toHaveProperty('estado');
      expect(propriedade).toHaveProperty('areaTotal');
      expect(propriedade).toHaveProperty('areaAgricultavel');
      expect(propriedade).toHaveProperty('areaVegetacao');
      expect(propriedade).toHaveProperty('produtores');
      expect(propriedade).toHaveProperty('createdAt');
      expect(propriedade).toHaveProperty('updatedAt');
    });
  });
});
