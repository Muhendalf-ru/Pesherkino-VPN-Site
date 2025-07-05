import { motion } from 'framer-motion';
import type { IServer } from '../../types/ServerTypes';
import type { IServerConfig } from '../../types/ServerConfigTypes';

interface ServerListProps {
  servers: IServer[];
  configs: IServerConfig[];
  onEdit: (server: IServer) => void;
  onDelete: (id: string) => void;
  onUpdateSession: (id: string) => void;
  onAddConfig: (serverId: string) => void;
  onEditConfig: (config: IServerConfig) => void;
  onDeleteConfig: (id: string) => void;
  loading?: boolean;
}

export default function ServerList({
  servers,
  configs,
  onEdit,
  onDelete,
  onUpdateSession,
  onAddConfig,
  onEditConfig,
  onDeleteConfig,
  loading = false,
}: ServerListProps) {
  if (loading) {
    return (
      <div className="server-list-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка серверов...</p>
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="server-list-empty">
        <p>Серверы не найдены</p>
        <p>Добавьте первый сервер, чтобы начать работу</p>
      </div>
    );
  }

  return (
    <div className="server-list">
      {servers.map((server, index) => (
        <motion.div
          key={server._id}
          className={`server-card ${server.isActive ? 'active' : 'inactive'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}>
          <div className="server-header">
            <div className="server-info">
              <h3 className="server-label">
                {server.label}
                {(() => {
                  const serverDomain = new URL(server.url).hostname;
                  const configCount = configs.filter(
                    (config) => config.host === serverDomain,
                  ).length;
                  return configCount > 0 ? (
                    <span className="config-count">({configCount} конфигураций)</span>
                  ) : null;
                })()}
              </h3>
              <span className={`server-status ${server.isActive ? 'active' : 'inactive'}`}>
                {server.isActive ? 'Активен' : 'Неактивен'}
              </span>
            </div>
            <div className="server-actions">
              <button className="btn-icon" onClick={() => onEdit(server)} title="Редактировать">
                ✏️
              </button>
              <button
                className="btn-icon"
                onClick={() => onUpdateSession(server._id)}
                title="Обновить сессию">
                🔄
              </button>
              <button
                className="btn-icon"
                onClick={() => onAddConfig(server._id)}
                title="Добавить конфигурацию">
                ➕
              </button>
              <button
                className="btn-icon danger"
                onClick={() => onDelete(server._id)}
                title="Удалить">
                🗑️
              </button>
            </div>
          </div>

          <div className="server-details">
            <div className="detail-item">
              <span className="detail-label">URL:</span>
              <span className="detail-value">{server.url}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Пользователь:</span>
              <span className="detail-value">{server.username}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Сессия:</span>
              <span className="detail-value">
                {server.sessionCookie ? '✅ Установлена' : '❌ Не установлена'}
              </span>
            </div>
            {server.createdAt && (
              <div className="detail-item">
                <span className="detail-label">Создан:</span>
                <span className="detail-value">
                  {new Date(server.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            )}
          </div>

          {/* Конфигурации сервера */}
          {(() => {
            // Привязываем конфигурации к серверам по host
            const serverDomain = new URL(server.url).hostname;
            const serverConfigs = configs.filter((config) => {
              return config.host === serverDomain;
            });
            return (
              <div className="server-configs">
                <div className="configs-header">
                  <h4 className="configs-title">Конфигурации VPN ({serverConfigs.length})</h4>
                  {serverConfigs.length === 0 && (
                    <span className="no-configs">Нет конфигураций</span>
                  )}
                </div>
                {serverConfigs.length > 0 && (
                  <div className="configs-list">
                    {serverConfigs.map((config) => (
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
                              className={`config-status ${
                                config.isActive ? 'active' : 'inactive'
                              }`}>
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
                            onClick={() => onEditConfig(config)}
                            title="Редактировать">
                            ✏️
                          </button>
                          <button
                            className="btn-icon small danger"
                            onClick={() => onDeleteConfig(config._id)}
                            title="Удалить">
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>
      ))}
    </div>
  );
}
