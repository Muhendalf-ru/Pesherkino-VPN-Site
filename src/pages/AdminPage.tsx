import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import type { IServer, CreateServerRequest, UpdateServerRequest } from '../types/ServerTypes';
import type {
  IServerConfig,
  CreateServerConfigRequest,
  UpdateServerConfigRequest,
} from '../types/ServerConfigTypes';
import { serverApi } from '../services/serverApi';
import { serverConfigApi } from '../services/serverConfigApi';
import ServerModal from '../components/admin/ServerModal';
import ServerList from '../components/admin/ServerList';
import ServerConfigModal from '../components/admin/ServerConfigModal';

export default function AdminPage() {
  const [servers, setServers] = useState<IServer[]>([]);
  const [configs, setConfigs] = useState<IServerConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<IServer | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Состояние для конфигураций
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<IServerConfig | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [configModalLoading, setConfigModalLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadServers();
    loadConfigs();
  }, []);

  const loadServers = async () => {
    setLoading(true);
    setError(null);

    console.log('Loading servers...');
    const response = await serverApi.getServers();
    console.log('Server response:', response);

    if (response.success && response.data) {
      console.log('Setting servers:', response.data);
      setServers(response.data);
    } else {
      console.error('Error loading servers:', response.error);
      setError(response.error || 'Ошибка загрузки серверов');
    }

    setLoading(false);
  };

  const loadConfigs = async () => {
    console.log('Loading server configs...');
    const response = await serverConfigApi.getServerConfigs();
    console.log('Server configs response:', response);

    if (response.success && response.data) {
      console.log('Setting configs:', response.data);
      setConfigs(response.data);
    } else {
      console.error('Error loading configs:', response.error);
    }
  };

  const handleAddServer = () => {
    setEditingServer(null);
    setModalOpen(true);
  };

  const handleEditServer = (server: IServer) => {
    setEditingServer(server);
    setModalOpen(true);
  };

  const handleDeleteServer = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот сервер?')) {
      return;
    }

    const response = await serverApi.deleteServer(id);

    if (response.success) {
      setServers((prev) => prev.filter((server) => server._id !== id));
      showSuccess('Сервер успешно удален');
    } else {
      setError(response.error || 'Ошибка удаления сервера');
    }
  };

  const handleUpdateSession = async (id: string) => {
    const sessionCookie = prompt('Введите новую session cookie:');
    if (!sessionCookie) return;

    const response = await serverApi.updateSessionCookie(id, sessionCookie);

    if (response.success && response.data) {
      setServers((prev) => prev.map((server) => (server._id === id ? response.data! : server)));
      showSuccess('Session cookie обновлен');
    } else {
      setError(response.error || 'Ошибка обновления session cookie');
    }
  };

  // Функции для управления конфигурациями
  const handleAddConfig = (serverId: string) => {
    // Находим сервер по ID
    const server = servers.find((s) => s._id === serverId);
    if (server) {
      // Извлекаем домен из URL сервера
      const serverDomain = new URL(server.url).hostname;
      setSelectedServerId(serverDomain); // Используем домен как serverId
    } else {
      setSelectedServerId(serverId);
    }
    setEditingConfig(null);
    setConfigModalOpen(true);
  };

  const handleEditConfig = (config: IServerConfig) => {
    setEditingConfig(config);
    setConfigModalOpen(true);
  };

  const handleDeleteConfig = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту конфигурацию?')) {
      return;
    }

    const response = await serverConfigApi.deleteServerConfig(id);

    if (response.success) {
      setConfigs((prev) => prev.filter((config) => config._id !== id));
      showSuccess('Конфигурация успешно удалена');
    } else {
      setError(response.error || 'Ошибка удаления конфигурации');
    }
  };

  const handleSubmitConfig = async (
    data: CreateServerConfigRequest | UpdateServerConfigRequest,
  ) => {
    setConfigModalLoading(true);
    setError(null);

    let response;

    if (editingConfig) {
      response = await serverConfigApi.updateServerConfig(
        editingConfig._id,
        data as UpdateServerConfigRequest,
      );
    } else {
      response = await serverConfigApi.createServerConfig(data as CreateServerConfigRequest);
    }

    if (response.success && response.data) {
      if (editingConfig) {
        setConfigs((prev) =>
          prev.map((config) => (config._id === editingConfig._id ? response.data! : config)),
        );
        showSuccess('Конфигурация успешно обновлена');
      } else {
        setConfigs((prev) => [...prev, response.data!]);
        showSuccess('Конфигурация успешно добавлена');
      }
      setConfigModalOpen(false);
    } else {
      setError(response.error || 'Ошибка сохранения конфигурации');
    }

    setConfigModalLoading(false);
  };

  const closeConfigModal = () => {
    setConfigModalOpen(false);
    setEditingConfig(null);
    setSelectedServerId('');
    setError(null);
  };

  const handleSubmitServer = async (data: CreateServerRequest | UpdateServerRequest) => {
    setModalLoading(true);
    setError(null);

    let response;

    if (editingServer) {
      response = await serverApi.updateServer(editingServer._id, data as UpdateServerRequest);
    } else {
      response = await serverApi.createServer(data as CreateServerRequest);
    }

    if (response.success && response.data) {
      if (editingServer) {
        setServers((prev) =>
          prev.map((server) => (server._id === editingServer._id ? response.data! : server)),
        );
        showSuccess('Сервер успешно обновлен');
      } else {
        setServers((prev) => [...prev, response.data!]);
        showSuccess('Сервер успешно добавлен');
      }
      setModalOpen(false);
    } else {
      setError(response.error || 'Ошибка сохранения сервера');
    }

    setModalLoading(false);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingServer(null);
    setError(null);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: 0 }}>
      <div className="animated-background" />
      <div className="space-elements">
        <div className="comet" />
        <img src="/neptune.svg" alt="Neptune" className="planet planet-neptune" />
        <img src="/planet.svg" alt="Planet 1" className="planet planet-1" />
        <img src="/planet.svg" alt="Planet 2" className="planet planet-2" />
        <img src="/planet.svg" alt="Planet 3" className="planet planet-3" />
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-admin-${i}`}
            className={`star star-${['small', 'medium', 'large'][Math.floor(Math.random() * 3)]}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              ['--duration' as string]: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
      </div>

      <div className="content admin-content">
        <motion.div
          className="gradient-text admin-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}>
          Админ-панель Pesherkino VPN
        </motion.div>

        <motion.div
          className="admin-subtitle"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}>
          Управление серверами
        </motion.div>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}>
            {error}
            <button onClick={() => setError(null)}>×</button>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}>
            {successMessage}
            <button onClick={() => setSuccessMessage(null)}>×</button>
          </motion.div>
        )}

        <div className="admin-controls">
          <motion.button
            className="download-button"
            onClick={handleAddServer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            ➕ Добавить сервер
          </motion.button>

          <motion.button
            className="btn-secondary"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            🏠 На главную
          </motion.button>
        </div>

        <ServerList
          servers={servers}
          configs={configs}
          onEdit={handleEditServer}
          onDelete={handleDeleteServer}
          onUpdateSession={handleUpdateSession}
          onAddConfig={handleAddConfig}
          onEditConfig={handleEditConfig}
          onDeleteConfig={handleDeleteConfig}
          loading={loading}
        />

        {/* Непривязанные конфигурации */}
        {(() => {
          const usedHosts = new Set();
          servers.forEach((server) => {
            try {
              const serverDomain = new URL(server.url).hostname;
              usedHosts.add(serverDomain);
            } catch {
              console.error('Invalid URL:', server.url);
            }
          });

          const unassignedConfigs = configs.filter((config) => !usedHosts.has(config.host));

          if (unassignedConfigs.length > 0) {
            return (
              <motion.div
                className="unassigned-configs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}>
                <h3 className="unassigned-title">
                  Непривязанные конфигурации ({unassignedConfigs.length})
                </h3>
                <div className="configs-list">
                  {unassignedConfigs.map((config) => (
                    <div
                      key={config._id}
                      className={`config-item ${config.isActive ? 'active' : 'inactive'}`}>
                      <div className="config-info">
                        <div className="config-main">
                          <span className="config-label">
                            {config.countryCode} {config.label}
                          </span>
                          <span className="config-location">{config.location}</span>
                          <span
                            className={`config-status ${config.isActive ? 'active' : 'inactive'}`}>
                            {config.isActive ? 'Активна' : 'Неактивна'}
                          </span>
                        </div>
                        <div className="config-details">
                          <span className="config-detail">
                            <strong>Хост:</strong> {config.host}:{config.port}
                          </span>
                          <span className="config-detail">
                            <strong>SNI:</strong> {config.sni}
                          </span>
                          <span className="config-detail">
                            <strong>SID:</strong> {config.sid}
                          </span>
                          {config.createdAt && (
                            <span className="config-detail">
                              <strong>Создан:</strong>{' '}
                              {new Date(config.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="config-actions">
                        <button
                          className="btn-icon small"
                          onClick={() => handleEditConfig(config)}
                          title="Редактировать">
                          ✏️
                        </button>
                        <button
                          className="btn-icon small danger"
                          onClick={() => handleDeleteConfig(config._id)}
                          title="Удалить">
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          }
          return null;
        })()}

        <ServerModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmitServer}
          server={editingServer}
          loading={modalLoading}
        />

        <ServerConfigModal
          isOpen={configModalOpen}
          onClose={closeConfigModal}
          onSubmit={handleSubmitConfig}
          config={editingConfig}
          serverId={selectedServerId}
          loading={configModalLoading}
        />
      </div>
    </div>
  );
}
