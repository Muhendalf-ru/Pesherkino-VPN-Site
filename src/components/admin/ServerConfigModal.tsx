import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  IServerConfig,
  CreateServerConfigRequest,
  UpdateServerConfigRequest,
} from '../../types/ServerConfigTypes';
import { parseVlessUrl, validateVlessUrl } from '../../utils/vlessParser';

interface ServerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateServerConfigRequest | UpdateServerConfigRequest) => void;
  config?: IServerConfig | null;
  serverId?: string; // ID сервера для новой конфигурации
  loading?: boolean;
}

export default function ServerConfigModal({
  isOpen,
  onClose,
  onSubmit,
  config,
  serverId,
  loading = false,
}: ServerConfigModalProps) {
  const [formData, setFormData] = useState<CreateServerConfigRequest>({
    serverId: serverId || '',
    label: '',
    host: '',
    pbk: '',
    sid: '',
    sni: '',
    port: 443,
    location: '',
    countryCode: '',
    isActive: true,
  });

  const [vlessUrl, setVlessUrl] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);

  const isEditing = !!config;

  useEffect(() => {
    if (config) {
      setFormData({
        serverId: config.serverId,
        label: config.label,
        host: config.host,
        pbk: config.pbk,
        sid: config.sid,
        sni: config.sni,
        port: config.port,
        location: config.location,
        countryCode: config.countryCode,
        isActive: config.isActive,
      });
      setIsManualMode(true);
    } else {
      setFormData({
        serverId: serverId || '',
        label: '',
        host: '',
        pbk: '',
        sid: '',
        sni: '',
        port: 443,
        location: '',
        countryCode: '',
        isActive: true,
      });
      setVlessUrl('');
      setParseError(null);
      setIsManualMode(false);
    }
  }, [config, serverId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleVlessUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const url = e.target.value;
    setVlessUrl(url);
    setParseError(null);

    if (url && validateVlessUrl(url)) {
      const parsed = parseVlessUrl(url);
      if (parsed) {
        setFormData((prev) => ({
          ...prev,
          host: parsed.host,
          pbk: parsed.pbk,
          sid: parsed.sid,
          sni: parsed.sni,
          port: parsed.port,
        }));
      }
    } else if (url) {
      setParseError('Неверный формат VLESS ссылки');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}>
          <motion.div
            className="modal-content admin-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Редактировать конфигурацию' : 'Добавить конфигурацию'}</h2>
              <button className="modal-close" onClick={onClose}>
                ×
              </button>
            </div>
            {!isEditing && serverId && (
              <div className="server-info-banner">
                Конфигурация будет привязана к серверу: <strong>{serverId}</strong>
              </div>
            )}

            <form onSubmit={handleSubmit} className="server-form">
              {!isEditing && (
                <div className="form-group">
                  <div className="mode-toggle">
                    <button
                      type="button"
                      className={`mode-btn ${!isManualMode ? 'active' : ''}`}
                      onClick={() => setIsManualMode(false)}>
                      VLESS ссылка
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${isManualMode ? 'active' : ''}`}
                      onClick={() => setIsManualMode(true)}>
                      Ручной ввод
                    </button>
                  </div>
                </div>
              )}

              {!isManualMode && !isEditing && (
                <div className="form-group">
                  <label htmlFor="vlessUrl">VLESS ссылка</label>
                  <textarea
                    id="vlessUrl"
                    value={vlessUrl}
                    onChange={handleVlessUrlChange}
                    placeholder="vless://uuid@host:port?type=tcp&security=reality&pbk=...&sni=...&sid=...#name"
                    rows={3}
                    className="vless-input"
                  />
                  {parseError && <div className="error-text">{parseError}</div>}
                  {vlessUrl && !parseError && validateVlessUrl(vlessUrl) && (
                    <div className="success-text">✓ VLESS ссылка корректна</div>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="label">Название конфигурации *</label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  required
                  placeholder="Например: Netherlands, Germany, Sweden"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Локация *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Например: Amsterdam, Frankfurt, Stockholm"
                />
              </div>

              <div className="form-group">
                <label htmlFor="countryCode">Эмодзи страны *</label>
                <input
                  type="text"
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                  placeholder="🇳🇱 🇩🇪 🇸🇪"
                />
              </div>

              <div className="form-group">
                <label htmlFor="host">Хост *</label>
                <input
                  type="text"
                  id="host"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  required
                  placeholder="nl.pesherkino.store"
                />
              </div>

              <div className="form-group">
                <label htmlFor="port">Порт *</label>
                <input
                  type="number"
                  id="port"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  required
                  min="1"
                  max="65535"
                  placeholder="443"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pbk">Public Key (pbk) *</label>
                <input
                  type="text"
                  id="pbk"
                  name="pbk"
                  value={formData.pbk}
                  onChange={handleChange}
                  required
                  placeholder="Y8Oj6vCjX-zU5HiNkTT-H4lmB-Qgyn3xv2yn21GqFAM"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sid">Short ID (sid) *</label>
                <input
                  type="text"
                  id="sid"
                  name="sid"
                  value={formData.sid}
                  onChange={handleChange}
                  required
                  placeholder="8a301443"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sni">SNI *</label>
                <input
                  type="text"
                  id="sni"
                  name="sni"
                  value={formData.sni}
                  onChange={handleChange}
                  required
                  placeholder="cdn.jsdelivr.net"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Активна
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                  disabled={loading}>
                  Отмена
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Сохранение...' : isEditing ? 'Обновить' : 'Добавить'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
