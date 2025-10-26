import { apiClient, apiConfig } from '../api';

// Mock do fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('apiConfig', () => {
  it('should have correct default base URL', () => {
    expect(apiConfig.baseURL).toBe('http://localhost:3001');
  });

  it('should have all required endpoints', () => {
    expect(apiConfig.endpoints).toEqual({
      producers: '/api/produtores',
      properties: '/api/propriedades',
      harvests: '/api/safras',
      cultures: '/api/culturas',
      cultivations: '/api/cultivos',
      dashboard: '/api/dashboard',
    });
  });

  it('should use environment variable for base URL when available', () => {
    const originalEnv = process.env.REACT_APP_API_URL;
    process.env.REACT_APP_API_URL = 'https://api.example.com';

    // Re-import to get the updated config
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { apiConfig: newConfig } = require('../api');

    expect(newConfig.baseURL).toBe('https://api.example.com');

    // Restore original env
    process.env.REACT_APP_API_URL = originalEnv;
  });
});

describe('apiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('get method', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should throw error on failed GET request', async () => {
      const errorData = { message: 'Not found' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: {
          get: () => 'application/json',
        },
        json: async () => errorData,
      } as unknown as Response);

      await expect(apiClient.get('/test')).rejects.toThrow('Not found');
    });

    it('should throw error with status when no error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: {
          get: () => null,
        },
      } as unknown as Response);

      await expect(apiClient.get('/test')).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('post method', () => {
    it('should make successful POST request', async () => {
      const postData = { name: 'New Item' };
      const responseData = { id: 1, ...postData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseData,
      } as Response);

      const result = await apiClient.post('/test', postData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      expect(result).toEqual(responseData);
    });

    it('should throw error on failed POST request', async () => {
      const errorData = { message: 'Validation error' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: {
          get: () => 'application/json',
        },
        json: async () => errorData,
      } as unknown as Response);

      await expect(apiClient.post('/test', {})).rejects.toThrow('Validation error');
    });
  });

  describe('put method', () => {
    it('should make successful PUT request', async () => {
      const putData = { id: 1, name: 'Updated Item' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => putData,
      } as Response);

      const result = await apiClient.put('/test/1', putData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(putData),
      });
      expect(result).toEqual(putData);
    });

    it('should throw error on failed PUT request', async () => {
      const errorData = { message: 'Not found' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: {
          get: () => 'application/json',
        },
        json: async () => errorData,
      } as unknown as Response);

      await expect(apiClient.put('/test/1', {})).rejects.toThrow('Not found');
    });
  });

  describe('patch method', () => {
    it('should make successful PATCH request', async () => {
      const patchData = { name: 'Patched Item' };
      const responseData = { id: 1, ...patchData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseData,
      } as Response);

      const result = await apiClient.patch('/test/1', patchData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchData),
      });
      expect(result).toEqual(responseData);
    });

    it('should throw error on failed PATCH request', async () => {
      const errorData = { message: 'Forbidden' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: {
          get: () => 'application/json',
        },
        json: async () => errorData,
      } as unknown as Response);

      await expect(apiClient.patch('/test/1', {})).rejects.toThrow('Forbidden');
    });
  });

  describe('delete method', () => {
    it('should make successful DELETE request with JSON response', async () => {
      const responseData = { message: 'Deleted successfully' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
        json: async () => responseData,
      } as Response);

      const result = await apiClient.delete('/test/1');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/test/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(responseData);
    });

    it('should return undefined for DELETE request without JSON content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => null,
        },
      } as unknown as Response);

      const result = await apiClient.delete('/test/1');

      expect(result).toBeUndefined();
    });

    it('should throw error on failed DELETE request', async () => {
      const errorData = { message: 'Cannot delete' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        headers: {
          get: () => 'application/json',
        },
        json: async () => errorData,
      } as unknown as Response);

      await expect(apiClient.delete('/test/1')).rejects.toThrow('Cannot delete');
    });
  });

  describe('handleError method', () => {
    it('should parse JSON error response', async () => {
      const errorData = { message: 'Error message', code: 'ERR001' };
      const mockResponse = {
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
        json: async () => errorData,
      } as Response;

      const result = await apiClient.handleError(mockResponse);
      expect(result).toEqual(errorData);
    });

    it('should return empty object when response is not JSON', async () => {
      const mockResponse = {
        headers: {
          get: () => 'text/html',
        },
      } as unknown as Response;

      const result = await apiClient.handleError(mockResponse);
      expect(result).toEqual({});
    });

    it('should return empty object when JSON parsing fails', async () => {
      const mockResponse = {
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as Response;

      const result = await apiClient.handleError(mockResponse);
      expect(result).toEqual({});
    });

    it('should return empty object when no content-type header', async () => {
      const mockResponse = {
        headers: {
          get: () => null,
        },
      } as unknown as Response;

      const result = await apiClient.handleError(mockResponse);
      expect(result).toEqual({});
    });
  });
});
