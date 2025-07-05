import type { IServerConfig, CreateServerConfigRequest, UpdateServerConfigRequest } from '../types/ServerConfigTypes';
import type { ApiResponse } from '../types/ServerTypes';

const API_BASE_URL = 'http://localhost:8000';

class ServerConfigApiService {
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

  // Получить все конфигурации
  async getServerConfigs(): Promise<ApiResponse<IServerConfig[]>> {
    return this.request<IServerConfig[]>('/pesherkino/server-configs');
  }

  // Получить конфигурацию по ID
  async getServerConfig(id: string): Promise<ApiResponse<IServerConfig>> {
    return this.request<IServerConfig>(`/pesherkino/server-configs/${id}`);
  }

  // Создать новую конфигурацию
  async createServerConfig(configData: CreateServerConfigRequest): Promise<ApiResponse<IServerConfig>> {
    return this.request<IServerConfig>('/pesherkino/server-configs', {
      method: 'POST',
      body: JSON.stringify(configData),
    });
  }

  // Обновить конфигурацию
  async updateServerConfig(id: string, configData: UpdateServerConfigRequest): Promise<ApiResponse<IServerConfig>> {
    return this.request<IServerConfig>(`/pesherkino/server-configs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(configData),
    });
  }

  // Удалить конфигурацию
  async deleteServerConfig(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/pesherkino/server-configs/${id}`, {
      method: 'DELETE',
    });
  }
}

export const serverConfigApi = new ServerConfigApiService(); 