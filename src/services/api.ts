const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    producers: '/api/produtores',
    properties: '/api/propriedades',
    harvests: '/api/safras',
    cultures: '/api/culturas',
    cultivations: '/api/cultivos',
    dashboard: '/api/dashboard',
  },
};

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await this.handleError(response);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await this.handleError(response);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await this.handleError(response);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await this.handleError(response);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await this.handleError(response);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Para DELETE, verificar se há conteúdo para retornar
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    // Se não há conteúdo JSON, retornar undefined (para status 204 No Content)
    return undefined as T;
  },

  async handleError(response: Response): Promise<any> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
    } catch (error) {
      // Se não conseguir fazer parse do JSON, retorna objeto vazio
    }
    return {};
  },
};
