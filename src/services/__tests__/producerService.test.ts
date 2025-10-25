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

describe('ProducerService', () => {
  const mockProducer: Producer = {
    id: '1',
    cpfCnpj: '12345678901',
    nome: 'João Silva',
    propriedades: [],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockProducers: Producer[] = [
    mockProducer,
    {
      id: '2',
      cpfCnpj: '98765432100',
      nome: 'Maria Santos',
      propriedades: [],
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve buscar todos os produtores', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const result = await producerService.getAll();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores');
      expect(result).toEqual(mockProducers);
    });

    it('deve retornar array vazio quando não houver produtores', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await producerService.getAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('API Error');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(producerService.getAll()).rejects.toThrow('API Error');
    });
  });

  describe('getById', () => {
    const producerId = '1';

    it('deve buscar produtor por ID', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducer);

      const result = await producerService.getById(producerId);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/api/produtores/${producerId}`);
      expect(result).toEqual(mockProducer);
    });

    it('deve propagar erro quando produtor não for encontrado', async () => {
      const error = new Error('Produtor não encontrado');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(producerService.getById('inexistente')).rejects.toThrow(
        'Produtor não encontrado'
      );
    });

    it('deve lidar com ID vazio', async () => {
      const error = new Error('ID inválido');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(producerService.getById('')).rejects.toThrow('ID inválido');
    });
  });

  describe('create', () => {
    const createData: CreateProducerData = {
      cpfCnpj: '11111111111',
      nome: 'Novo Produtor',
    };

    it('deve criar novo produtor', async () => {
      const novoProdutor = { ...mockProducer, ...createData };
      mockApiClient.post.mockResolvedValueOnce(novoProdutor);

      const result = await producerService.create(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/produtores', createData);
      expect(result).toEqual(novoProdutor);
    });

    it('deve propagar erro de validação', async () => {
      const error = new Error('CPF/CNPJ inválido');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(producerService.create(createData)).rejects.toThrow('CPF/CNPJ inválido');
    });

    it('deve lidar com dados incompletos', async () => {
      const dadosIncompletos = { nome: 'Sem CPF' } as CreateProducerData;
      const error = new Error('CPF/CNPJ é obrigatório');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(producerService.create(dadosIncompletos)).rejects.toThrow(
        'CPF/CNPJ é obrigatório'
      );
    });
  });

  describe('update', () => {
    const producerId = '1';
    const updateData: UpdateProducerData = {
      nome: 'Produtor Atualizado',
      cpfCnpj: '99999999999',
    };

    it('deve atualizar produtor existente', async () => {
      const produtorAtualizado = { ...mockProducer, ...updateData };
      mockApiClient.patch.mockResolvedValueOnce(produtorAtualizado);

      const result = await producerService.update(producerId, updateData);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/api/produtores/${producerId}`,
        updateData
      );
      expect(result).toEqual(produtorAtualizado);
    });

    it('deve propagar erro quando produtor não for encontrado', async () => {
      const error = new Error('Produtor não encontrado');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(producerService.update('inexistente', updateData)).rejects.toThrow(
        'Produtor não encontrado'
      );
    });

    it('deve permitir atualização parcial', async () => {
      const updateParcial = { nome: 'Apenas nome atualizado' };
      const produtorAtualizado = { ...mockProducer, nome: updateParcial.nome };
      mockApiClient.patch.mockResolvedValueOnce(produtorAtualizado);

      const result = await producerService.update(producerId, updateParcial);

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        `/api/produtores/${producerId}`,
        updateParcial
      );
      expect(result).toEqual(produtorAtualizado);
    });

    it('deve propagar erro de validação', async () => {
      const error = new Error('CPF/CNPJ já existe');
      mockApiClient.patch.mockRejectedValueOnce(error);

      await expect(producerService.update(producerId, updateData)).rejects.toThrow(
        'CPF/CNPJ já existe'
      );
    });
  });

  describe('delete', () => {
    const producerId = '1';

    it('deve deletar produtor existente', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      await producerService.delete(producerId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/api/produtores/${producerId}`);
    });

    it('deve propagar erro quando produtor não for encontrado', async () => {
      const error = new Error('Produtor não encontrado');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(producerService.delete('inexistente')).rejects.toThrow(
        'Produtor não encontrado'
      );
    });

    it('deve lidar com ID vazio', async () => {
      const error = new Error('ID inválido');
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(producerService.delete('')).rejects.toThrow('ID inválido');
    });

    it('deve retornar void quando deletar com sucesso', async () => {
      mockApiClient.delete.mockResolvedValueOnce(undefined);

      const result = await producerService.delete(producerId);

      expect(result).toBeUndefined();
    });
  });

  describe('search', () => {
    it('deve buscar produtores sem parâmetros', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const result = await producerService.search();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores');
      expect(result).toEqual(mockProducers);
    });

    it('deve buscar produtores com página e limite', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const result = await producerService.search({ page: 2, limit: 10 });

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores?page=2&limit=10');
      expect(result).toEqual(mockProducers);
    });

    it('deve buscar produtores com termo de busca', async () => {
      mockApiClient.get.mockResolvedValueOnce([mockProducer]);

      const result = await producerService.search({ search: 'João' });

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores?search=Jo%C3%A3o');
      expect(result).toEqual([mockProducer]);
    });

    it('deve buscar produtores com todos os parâmetros', async () => {
      mockApiClient.get.mockResolvedValueOnce([mockProducer]);

      const result = await producerService.search({
        page: 1,
        limit: 5,
        search: 'Silva',
      });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/produtores?page=1&limit=5&search=Silva'
      );
      expect(result).toEqual([mockProducer]);
    });

    it('deve retornar array vazio quando não encontrar resultados', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      const result = await producerService.search({ search: 'inexistente' });

      expect(result).toEqual([]);
    });

    it('deve propagar erro do apiClient', async () => {
      const error = new Error('Erro na busca');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(producerService.search({ search: 'teste' })).rejects.toThrow(
        'Erro na busca'
      );
    });

    it('deve lidar com caracteres especiais na busca', async () => {
      mockApiClient.get.mockResolvedValueOnce([]);

      await producerService.search({ search: 'João & Maria' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/api/produtores?search=Jo%C3%A3o+%26+Maria'
      );
    });

    it('deve ignorar parâmetros undefined', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      await producerService.search({ page: undefined, limit: 10, search: undefined });

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores?limit=10');
    });

    it('deve lidar com página 0', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      await producerService.search({ page: 0 });

      // Page 0 is filtered out as falsy value by URLSearchParams logic
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/produtores');
    });
  });

  describe('Error handling geral', () => {
    it('deve propagar erros de rede', async () => {
      const networkError = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(networkError);

      await expect(producerService.getAll()).rejects.toThrow('Network error');
    });

    it('deve propagar erros de timeout', async () => {
      const timeoutError = new Error('Request timeout');
      mockApiClient.post.mockRejectedValueOnce(timeoutError);

      await expect(
        producerService.create({
          cpfCnpj: '12345678901',
          nome: 'Test',
        })
      ).rejects.toThrow('Request timeout');
    });

    it('deve propagar erros de servidor (500)', async () => {
      const serverError = new Error('HTTP error! status: 500');
      mockApiClient.get.mockRejectedValueOnce(serverError);

      await expect(producerService.getAll()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('Data integrity', () => {
    it('deve preservar tipos de dados', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockProducers);

      const result = await producerService.getAll();

      expect(typeof result[0].id).toBe('string');
      expect(typeof result[0].cpfCnpj).toBe('string');
      expect(typeof result[0].nome).toBe('string');
      expect(Array.isArray(result[0].propriedades)).toBe(true);
    });

    it('deve manter estrutura do objeto Producer', async () => {
      mockApiClient.get.mockResolvedValueOnce([mockProducer]);

      const result = await producerService.getAll();
      const producer = result[0];

      expect(producer).toHaveProperty('id');
      expect(producer).toHaveProperty('cpfCnpj');
      expect(producer).toHaveProperty('nome');
      expect(producer).toHaveProperty('propriedades');
      expect(producer).toHaveProperty('createdAt');
      expect(producer).toHaveProperty('updatedAt');
    });
  });
});
