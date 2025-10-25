import { apiClient, apiConfig } from '../api';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('apiConfig', () => {
  beforeEach(() => {
    // Reset environment variables
    delete process.env.REACT_APP_API_URL;
  });

  it('deve usar URL padrão quando REACT_APP_API_URL não estiver definida', () => {
    expect(apiConfig.baseURL).toBe('http://localhost:3001');
  });

  it('deve ter todos os endpoints configurados', () => {
    expect(apiConfig.endpoints).toEqual({
      producers: '/api/produtores',
      properties: '/api/propriedades',
      harvests: '/api/safras',
      cultures: '/api/culturas',
      cultivations: '/api/cultivos',
      dashboard: '/api/dashboard',
    });
  });
});

describe('apiClient', () => {
  const mockResponseData = { id: 1, name: 'Test' };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET method', () => {
    it('deve fazer requisição GET com sucesso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      });

      const result = await apiClient.get('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/test-endpoint', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockResponseData);
    });

    it('deve lançar erro quando resposta não for ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(apiClient.get('/test-endpoint')).rejects.toThrow(
        'HTTP error! status: 404'
      );
    });

    it('deve lançar erro quando fetch falhar', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      await expect(apiClient.get('/test-endpoint')).rejects.toThrow('Network error');
    });
  });

  describe('POST method', () => {
    const testData = { name: 'Test', value: 123 };

    it('deve fazer requisição POST com sucesso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      });

      const result = await apiClient.post('/test-endpoint', testData);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/test-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      expect(result).toEqual(mockResponseData);
    });

    it('deve lançar erro quando resposta não for ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(apiClient.post('/test-endpoint', testData)).rejects.toThrow(
        'HTTP error! status: 400'
      );
    });

    it('deve enviar dados como JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      });

      await apiClient.post('/test-endpoint', testData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(testData),
        })
      );
    });
  });

  describe('PUT method', () => {
    const testData = { id: 1, name: 'Updated Test' };

    it('deve fazer requisição PUT com sucesso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      });

      const result = await apiClient.put('/test-endpoint', testData);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/test-endpoint', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      expect(result).toEqual(mockResponseData);
    });

    it('deve lançar erro quando resposta não for ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(apiClient.put('/test-endpoint', testData)).rejects.toThrow(
        'HTTP error! status: 500'
      );
    });
  });

  describe('PATCH method', () => {
    const testData = { name: 'Partially Updated' };

    it('deve fazer requisição PATCH com sucesso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      });

      const result = await apiClient.patch('/test-endpoint', testData);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/test-endpoint', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      expect(result).toEqual(mockResponseData);
    });

    it('deve lançar erro quando resposta não for ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
      });

      await expect(apiClient.patch('/test-endpoint', testData)).rejects.toThrow(
        'HTTP error! status: 422'
      );
    });
  });

  describe('DELETE method', () => {
    it('deve fazer requisição DELETE com sucesso com resposta JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (header: string) => header === 'content-type' ? 'application/json' : null,
        },
        json: () => Promise.resolve(mockResponseData),
      });

      const result = await apiClient.delete('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/test-endpoint', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockResponseData);
    });

    it('deve fazer requisição DELETE com sucesso sem resposta JSON (204 No Content)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (header: string) => null,
        },
      });

      const result = await apiClient.delete('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/test-endpoint', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toBeUndefined();
    });

    it('deve lançar erro quando resposta não for ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(apiClient.delete('/test-endpoint')).rejects.toThrow(
        'HTTP error! status: 403'
      );
    });
  });

  describe('Headers e configuração', () => {
    it('deve incluir Content-Type application/json em todas as requisições', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
        headers: { get: () => null },
      });

      const methods = ['get', 'post', 'put', 'patch', 'delete'];
      for (const method of methods) {
        mockFetch.mockClear();
        const args = method === 'get' || method === 'delete'
          ? ['/test']
          : ['/test', {}];

        await (apiClient as any)[method](...args);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
          })
        );
      }
    });

    it('deve usar a baseURL correta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/test',
        expect.any(Object)
      );
    });
  });

  describe('Error handling', () => {
    it('deve preservar status code no erro', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      try {
        await apiClient.get('/test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('HTTP error! status: 401');
      }
    });

    it('deve propagar erros de rede', async () => {
      const networkError = new Error('Failed to fetch');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(apiClient.get('/test')).rejects.toThrow('Failed to fetch');
    });
  });

  describe('JSON parsing', () => {
    it('deve lidar com resposta JSON inválida', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(apiClient.get('/test')).rejects.toThrow('Invalid JSON');
    });

    it('deve lidar com resposta vazia para DELETE', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (header: string) => header === 'content-type' ? 'text/plain' : null,
        },
      });

      const result = await apiClient.delete('/test');
      expect(result).toBeUndefined();
    });
  });
});
