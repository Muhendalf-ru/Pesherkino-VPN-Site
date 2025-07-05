import { motion } from 'framer-motion';
import type { IServerConfig } from '../../types/ServerConfigTypes';

interface ServerConfigListProps {
  configs: IServerConfig[];
  onEdit: (config: IServerConfig) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function ServerConfigList({
  configs,
  onEdit,
  onDelete,
  loading = false,
}: ServerConfigListProps) {
  if (loading) {
    return (
      <div className="server-list-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка конфигураций...</p>
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <div className="server-list-empty">
        <p>Конфигурации не найдены</p>
        <p>Добавьте первую конфигурацию, чтобы начать работу</p>
      </div>
    );
  }

  return (
    <div className="server-list">
      {configs.map((config, index) => (
        <motion.div
          key={config._id}
          className="server-card config-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}>
          <div className="server-header">
            <div className="server-info">
              <h3 className="server-label">
                {config.countryCode} {config.label}
              </h3>
              <span className="server-location">{config.location}</span>
            </div>
            <div className="server-actions">
              <button className="btn-icon" onClick={() => onEdit(config)} title="Редактировать">
                ✏️
              </button>
              <button
                className="btn-icon danger"
                onClick={() => onDelete(config._id)}
                title="Удалить">
                🗑️
              </button>
            </div>
          </div>

          <div className="server-details">
            <div className="detail-item">
              <span className="detail-label">Хост:</span>
              <span className="detail-value">{config.host}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Порт:</span>
              <span className="detail-value">{config.port}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">SNI:</span>
              <span className="detail-value">{config.sni}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Public Key:</span>
              <span className="detail-value code-value">{config.pbk}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Short ID:</span>
              <span className="detail-value">{config.sid}</span>
            </div>
            {config.createdAt && (
              <div className="detail-item">
                <span className="detail-label">Создан:</span>
                <span className="detail-value">
                  {new Date(config.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
