import type { IServer, CreateServerRequest, UpdateServerRequest, ApiResponse } from '../types/ServerTypes';

const API_BASE_URL = 'http://localhost:8000';

class ServerApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      console.log(`Making request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, response.headers);

      const data = await response.json();
      console.log(`Response data:`, data);

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      // Проверяем, если API возвращает данные напрямую, а не в формате {success, data}
      if (Array.isArray(data) || (data && typeof data === 'object' && !data.success)) {
        return {
          success: true,
          data: data as T,
        };
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    }
  }

  // Получить все серверы
  async getServers(): Promise<ApiResponse<IServer[]>> {
    return this.request<IServer[]>('/pesherkino/servers');
  }

  // Получить сервер по ID
  async getServer(id: string): Promise<ApiResponse<IServer>> {
    return this.request<IServer>(`/pesherkino/servers/${id}`);
  }

  // Добавить новый сервер
  async createServer(serverData: CreateServerRequest): Promise<ApiResponse<IServer>> {
    return this.request<IServer>('/pesherkino/servers', {
      method: 'POST',
      body: JSON.stringify(serverData),
    });
  }

  // Обновить сервер
  async updateServer(id: string, serverData: UpdateServerRequest): Promise<ApiResponse<IServer>> {
    return this.request<IServer>(`/pesherkino/servers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serverData),
    });
  }

  // Удалить сервер
  async deleteServer(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/pesherkino/servers/${id}`, {
      method: 'DELETE',
    });
  }

  // Обновить sessionCookie
  async updateSessionCookie(id: string, sessionCookie: string): Promise<ApiResponse<IServer>> {
    return this.request<IServer>(`/pesherkino/servers/${id}/session`, {
      method: 'PATCH',
      body: JSON.stringify({ sessionCookie }),
    });
  }
}

export const serverApi = new ServerApiService(); 